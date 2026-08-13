import 'dart:async';
import 'dart:convert';
import 'dart:io';

/// A single progress event streamed from the Python backend.
class ProgressEvent {
  const ProgressEvent({
    required this.index,
    required this.total,
    required this.file,
    required this.filePath,
    required this.destPath,
    required this.label,
    required this.score,
    required this.confidence,
    required this.technical,
    required this.aesthetic,
  });

  final int index;
  final int total;
  final String file;
  final String filePath;
  final String destPath;
  final String label;     // artistic_keep | good | ok | reject
  final double score;     // 0.0 – 1.0
  final double confidence;
  final double technical;
  final double aesthetic;

  factory ProgressEvent.fromJson(Map<String, dynamic> j) => ProgressEvent(
        index:      (j['index']      as num).toInt(),
        total:      (j['total']      as num).toInt(),
        file:       j['file']       as String? ?? '',
        filePath:   j['file_path']  as String? ?? '',
        destPath:   j['dest_path']  as String? ?? '',
        label:      j['label']      as String? ?? 'reject',
        score:      (j['score']      as num?)?.toDouble() ?? 0.0,
        confidence: (j['confidence'] as num?)?.toDouble() ?? 0.0,
        technical:  (j['technical']  as num?)?.toDouble() ?? 0.0,
        aesthetic:  (j['aesthetic']  as num?)?.toDouble() ?? 0.0,
      );
}

/// Result returned when the backend finishes.
class SortComplete {
  const SortComplete({
    required this.total,
    required this.counts,
    required this.outputDir,
  });

  final int total;
  final Map<String, int> counts;
  final String outputDir;

  factory SortComplete.fromJson(Map<String, dynamic> j) => SortComplete(
        total:     (j['total'] as num).toInt(),
        outputDir: j['output_dir'] as String? ?? '',
        counts: (j['counts'] as Map<String, dynamic>? ?? {}).map(
          (k, v) => MapEntry(k, (v as num).toInt()),
        ),
      );
}

/// Possible states the service can be in.
enum BackendState { idle, scanning, processing, complete, error, cancelled }

/// Manages the Python subprocess lifecycle and exposes streams.
class BackendService {
  BackendService({required this.pythonPath, required this.scriptPath});

  /// Path to the Python executable (e.g. "python" or full venv path).
  final String pythonPath;

  /// Absolute path to purepic_server.py.
  final String scriptPath;
  Process? _process;
  StreamSubscription<String>? _stdoutSub;

  final _progressController =
      StreamController<ProgressEvent>.broadcast();
  final _logController =
      StreamController<String>.broadcast();
  final _stateController =
      StreamController<BackendState>.broadcast();
  final _scanResultController =
      StreamController<int>.broadcast(); // emits image count
  final _completeController =
      StreamController<SortComplete>.broadcast();
  final _errorController =
      StreamController<String>.broadcast();

  Stream<ProgressEvent> get onProgress => _progressController.stream;
  Stream<String>         get onLog      => _logController.stream;
  Stream<BackendState>   get onState    => _stateController.stream;
  Stream<int>            get onScanResult => _scanResultController.stream;
  Stream<SortComplete>   get onComplete => _completeController.stream;
  Stream<String>         get onError    => _errorController.stream;

  BackendState _state = BackendState.idle;
  BackendState get state => _state;

  void _setState(BackendState s) {
    _state = s;
    _stateController.add(s);
  }

  // ── Start the Python process ───────────────────────────────────────────────

  Future<void> _ensureProcess() async {
    if (_process != null) return;

    _process = await Process.start(
      pythonPath,
      ['-u', scriptPath],           // -u = unbuffered stdout
      workingDirectory: File(scriptPath).parent.path,
    );

    // Discard Python stderr in all modes (TF/oneDNN noise)
    _process!.stderr
        .transform(utf8.decoder)
        .transform(const LineSplitter())
        .listen((_) {}); // silently discarded

    // Parse stdout JSON lines
    _stdoutSub = _process!.stdout
        .transform(utf8.decoder)
        .transform(const LineSplitter())
        .listen(_handleLine, onDone: _handleProcessExit);
  }

  // ── Send a sort command ────────────────────────────────────────────────────

  Future<void> startSort({
    required String inputFolder,
    required String outputFolder,
  }) async {
    if (_state == BackendState.processing || _state == BackendState.scanning) {
      return;
    }

    _setState(BackendState.scanning);

    await _ensureProcess();

    final cmd = json.encode({
      'cmd':    'scan',
      'input':  inputFolder,
      'output': outputFolder,
    });

    _process!.stdin.writeln(cmd);
    await _process!.stdin.flush();
  }

  // ── Cancel ────────────────────────────────────────────────────────────────

  Future<void> cancel() async {
    if (_process == null) return;
    _process!.stdin.writeln(json.encode({'cmd': 'cancel'}));
    await _process!.stdin.flush();
  }

  // ── Kill process entirely ─────────────────────────────────────────────────

  Future<void> dispose() async {
    await _stdoutSub?.cancel();
    _process?.kill();
    _process = null;
    await _progressController.close();
    await _logController.close();
    await _stateController.close();
    await _scanResultController.close();
    await _completeController.close();
    await _errorController.close();
  }

  // ── Handle one stdout line ────────────────────────────────────────────────

  void _handleLine(String line) {
    if (line.trim().isEmpty) return;

    Map<String, dynamic> msg;
    try {
      msg = json.decode(line) as Map<String, dynamic>;
    } catch (_) {
      // Non-JSON output from Python — treat as log
      _logController.add(line);
      return;
    }

    final type = msg['type'] as String? ?? '';

    switch (type) {
      case 'log':
        _logController.add(msg['message'] as String? ?? '');
        break;

      case 'scan_result':
        final total = (msg['total'] as num).toInt();
        _scanResultController.add(total);
        _setState(BackendState.processing);
        break;

      case 'progress':
        _progressController.add(ProgressEvent.fromJson(msg));
        break;

      case 'progress_error':
        // A single image failed — log and continue
        _logController.add(
          '⚠ Skipped ${msg['file']}: ${msg['message']}',
        );
        break;

      case 'complete':
        final result = SortComplete.fromJson(msg);
        _completeController.add(result);
        _setState(BackendState.complete);
        break;

      case 'cancelled':
        _setState(BackendState.cancelled);
        break;

      case 'error':
        final err = msg['message'] as String? ?? 'Unknown error';
        _errorController.add(err);
        _setState(BackendState.error);
        break;
    }
  }

  void _handleProcessExit() {
    if (_state != BackendState.complete &&
        _state != BackendState.cancelled) {
      _setState(BackendState.error);
      _errorController.add('Python process exited unexpectedly.');
    }
    _process = null;
  }
}
