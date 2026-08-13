import 'dart:async';
import 'dart:io';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_state.dart';
import '../services/backend_service.dart';

// ─── Current screen ──────────────────────────────────────────────────────────

final currentScreenProvider = StateProvider<AppScreen>(
  (_) => AppScreen.welcome,
);

// ─── Folder paths ─────────────────────────────────────────────────────────────

final inputFolderProvider  = StateProvider<String>((_) => '');
final outputFolderProvider = StateProvider<String>((_) => '');

// ─── Python path resolution ───────────────────────────────────────────────────

/// Resolves the Python executable to use.
/// Priority: venv next to purepic_server.py > known Python 3.10 install > system "python"
String resolvePythonPath(String scriptDir) {
  // Check for a venv in the script directory
  final venvWindows = '$scriptDir\\venv\\Scripts\\python.exe';
  final venvLinux   = '$scriptDir/venv/bin/python';
  if (File(venvWindows).existsSync()) return venvWindows;
  if (File(venvLinux).existsSync())   return venvLinux;

  // Known Python 3.10 install location on this machine
  const knownPy310 =
      r'C:\Users\vaish\AppData\Local\Programs\Python\Python310\python.exe';
  if (File(knownPy310).existsSync()) return knownPy310;

  // Generic fallbacks
  return Platform.isWindows ? 'python' : 'python3';
}

// ─── Backend service provider ─────────────────────────────────────────────────

final backendServiceProvider = Provider<BackendService>((ref) {
  // Absolute script path — this is where purepic_server.py lives.
  const String scriptPath =
      r'C:\Users\vaish\OneDrive\Desktop\Purepic3\PurePic\PurePic\purepic_server.py';

  final scriptDir  = File(scriptPath).parent.path;
  final pythonPath = resolvePythonPath(scriptDir);

  final service = BackendService(
    pythonPath: pythonPath,
    scriptPath: scriptPath,
  );

  ref.onDispose(service.dispose);
  return service;
});

// ─── Sorting progress ─────────────────────────────────────────────────────────

class SortingProgressNotifier extends StateNotifier<SortingProgress?> {
  SortingProgressNotifier(this._ref) : super(null);

  final Ref _ref;

  StreamSubscription<ProgressEvent>? _progressSub;
  StreamSubscription<SortComplete>?  _completeSub;
  StreamSubscription<String>?        _errorSub;
  StreamSubscription<int>?           _scanSub;

  // ── Start real backend sort ───────────────────────────────────────────────

  Future<void> startSort(String inputFolder, String outputFolder) async {
    final service = _ref.read(backendServiceProvider);

    // ── Guard: check script exists ─────────────────────────────────────
    if (!File(service.scriptPath).existsSync()) {
      state = SortingProgress(
        processed: 0, total: 0, etaSeconds: 0, speedPerSecond: 0,
        currentImage: '', currentFilename: '',
        currentConfidence: 0, currentCategory: SortCategory.reject,
        artisticKeepCount: 0, goodCount: 0, okCount: 0, rejectCount: 0,
        hasError: true,
        errorMessage: 'Python backend not found at:\n${service.scriptPath}',
      );
      return;
    }

    int total = 0;
    int artisticKeep = 0, good = 0, ok = 0, reject = 0;

    // Initialise empty progress so UI shows immediately
    state = SortingProgress(
      processed:         0,
      total:             0,
      etaSeconds:        0,
      speedPerSecond:    0,
      currentImage:      '',
      currentFilename:   '',
      currentConfidence: 0,
      currentCategory:   SortCategory.good,
      artisticKeepCount: 0,
      goodCount:         0,
      okCount:           0,
      rejectCount:       0,
    );

    // ── Scan result: we now know total ────────────────────────────────────
    _scanSub = service.onScanResult.listen((total_) {
      total = total_;
      state = SortingProgress(
        processed:         0,
        total:             total_,
        etaSeconds:        0,
        speedPerSecond:    0,
        currentImage:      '',
        currentFilename:   '',
        currentConfidence: 0,
        currentCategory:   SortCategory.good,
        artisticKeepCount: 0,
        goodCount:         0,
        okCount:           0,
        rejectCount:       0,
      );
    });

    // ── Per-image progress ────────────────────────────────────────────────
    final startTime = DateTime.now();
    _progressSub = service.onProgress.listen((evt) {
      final cat = _labelToCategory(evt.label);

      switch (cat) {
        case SortCategory.artisticKeep: artisticKeep++; break;
        case SortCategory.good:         good++;         break;
        case SortCategory.ok:           ok++;           break;
        case SortCategory.reject:       reject++;       break;
      }

      final elapsed  = DateTime.now().difference(startTime).inSeconds;
      final speed    = elapsed > 0 ? evt.index / elapsed : 1.0;
      final remaining = (total - evt.index).clamp(0, total);
      final eta      = speed > 0 ? (remaining / speed).round() : 0;

      state = SortingProgress(
        processed:         evt.index,
        total:             evt.total,
        etaSeconds:        eta,
        speedPerSecond:    speed,
        currentImage:      evt.filePath,
        currentFilename:   evt.file,
        currentConfidence: evt.confidence,
        currentCategory:   cat,
        artisticKeepCount: artisticKeep,
        goodCount:         good,
        okCount:           ok,
        rejectCount:       reject,
        isComplete:        evt.index >= evt.total,
      );
    });

    // ── Complete ──────────────────────────────────────────────────────────
    _completeSub = service.onComplete.listen((result) {
      final current = state;
      if (current == null) return;
      state = SortingProgress(
        processed:         current.total,
        total:             current.total,
        etaSeconds:        0,
        speedPerSecond:    current.speedPerSecond,
        currentImage:      current.currentImage,
        currentFilename:   current.currentFilename,
        currentConfidence: current.currentConfidence,
        currentCategory:   current.currentCategory,
        artisticKeepCount: result.counts['artistic_keep'] ?? artisticKeep,
        goodCount:         result.counts['good']          ?? good,
        okCount:           result.counts['ok']            ?? ok,
        rejectCount:       result.counts['reject']        ?? reject,
        isComplete:        true,
      );
    });

    // ── Error ─────────────────────────────────────────────────────────────
    _errorSub = service.onError.listen((err) {
      // Surface error via a special progress state the UI can detect
      final current = state;
      if (current != null) {
        state = SortingProgress(
          processed:         current.processed,
          total:             current.total,
          etaSeconds:        0,
          speedPerSecond:    0,
          currentImage:      current.currentImage,
          currentFilename:   'Error: $err',
          currentConfidence: 0,
          currentCategory:   SortCategory.reject,
          artisticKeepCount: current.artisticKeepCount,
          goodCount:         current.goodCount,
          okCount:           current.okCount,
          rejectCount:       current.rejectCount,
          isComplete:        false,
          hasError:          true,
          errorMessage:      err,
        );
      }
    });

    await service.startSort(
      inputFolder:  inputFolder,
      outputFolder: outputFolder,
    );
  }

  // ── Demo mode (fallback when Python not found) ────────────────────────────

  Timer? _demoTimer;
  int _demoTick = 0;
  final Random _random = Random();

  static const List<String> _demoFiles = [
    'IMG_2048.CR3', 'DSC_0312.NEF', 'IMG_7789.JPG',
    'RAW_1024.ARW', 'IMG_3344.CR2', 'DSC_9901.NEF',
    'IMG_5567.DNG', 'RAW_2200.ARW', 'IMG_0091.JPG',
    'DSC_4410.NEF',
  ];

  static const List<SortCategory> _demoCategories = [
    SortCategory.artisticKeep, SortCategory.good, SortCategory.good,
    SortCategory.ok,           SortCategory.reject, SortCategory.artisticKeep,
    SortCategory.good,         SortCategory.ok,   SortCategory.reject,
    SortCategory.artisticKeep,
  ];

  void startDemo(int total) {
    _demoTick = 0;
    int ak = 0, g = 0, ok = 0, rej = 0;

    state = SortingProgress(
      processed: 0, total: total, etaSeconds: 0, speedPerSecond: 0,
      currentImage: '', currentFilename: '', currentConfidence: 0,
      currentCategory: SortCategory.good,
      artisticKeepCount: 0, goodCount: 0, okCount: 0, rejectCount: 0,
    );

    _demoTimer = Timer.periodic(const Duration(milliseconds: 600), (t) {
      _demoTick++;
      final processed = min(_demoTick * 4, total);
      final idx = _demoTick % _demoFiles.length;
      final cat = _demoCategories[idx];

      switch (cat) {
        case SortCategory.artisticKeep: ak++;  break;
        case SortCategory.good:         g++;   break;
        case SortCategory.ok:           ok++;  break;
        case SortCategory.reject:       rej++; break;
      }

      final speed = 4 + _random.nextDouble() * 2;
      final eta   = ((total - processed) / speed).round();

      state = SortingProgress(
        processed:         processed,
        total:             total,
        etaSeconds:        eta,
        speedPerSecond:    speed,
        currentImage:      '',
        currentFilename:   _demoFiles[idx],
        currentConfidence: 0.70 + _random.nextDouble() * 0.28,
        currentCategory:   cat,
        artisticKeepCount: ak,
        goodCount:         g,
        okCount:           ok,
        rejectCount:       rej,
        isComplete:        processed >= total,
      );

      if (processed >= total) t.cancel();
    });
  }

  void stop() {
    _demoTimer?.cancel();
    _progressSub?.cancel();
    _completeSub?.cancel();
    _errorSub?.cancel();
    _scanSub?.cancel();
    state = null;
  }

  @override
  void dispose() {
    stop();
    super.dispose();
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

SortCategory _labelToCategory(String label) {
  switch (label) {
    case 'artistic_keep': return SortCategory.artisticKeep;
    case 'good':          return SortCategory.good;
    case 'ok':            return SortCategory.ok;
    default:              return SortCategory.reject;
  }
}

final sortingProgressProvider =
    StateNotifierProvider<SortingProgressNotifier, SortingProgress?>(
  (ref) => SortingProgressNotifier(ref),
);

// ─── Sorting result ───────────────────────────────────────────────────────────

final sortingResultProvider = StateProvider<SortingResult?>((_) => null);

// ─── Build result from a completed SortComplete + real image lists ────────────

SortingResult buildResultFromBackend({
  required SortComplete complete,
  required List<SortedImage> artisticKeepImages,
  required List<SortedImage> goodImages,
  required List<SortedImage> okImages,
  required List<SortedImage> rejectImages,
  required int processingTimeSeconds,
}) {
  return SortingResult(
    totalImages:           complete.total,
    processingTimeSeconds: processingTimeSeconds,
    artisticKeepImages:    artisticKeepImages,
    goodImages:            goodImages,
    okImages:              okImages,
    rejectImages:          rejectImages,
    artisticKeepTotal:     complete.counts['artistic_keep'] ?? 0,
    goodTotal:             complete.counts['good']          ?? 0,
    okTotal:               complete.counts['ok']            ?? 0,
    rejectTotal:           complete.counts['reject']        ?? 0,
  );
}

// ─── Legacy mock result (demo mode fallback) ──────────────────────────────────

SortingResult buildMockResult(SortingProgress progress) {
  SortedImage makeImg(String name, SortCategory cat, double conf) =>
      SortedImage(path: '', filename: name, category: cat, confidence: conf);

  return SortingResult(
    totalImages:           progress.total,
    processingTimeSeconds: 142,
    artisticKeepImages: [
      makeImg('IMG_2048.CR3', SortCategory.artisticKeep, 0.97),
      makeImg('DSC_0312.NEF', SortCategory.artisticKeep, 0.95),
      makeImg('IMG_7789.JPG', SortCategory.artisticKeep, 0.93),
      makeImg('RAW_1024.ARW', SortCategory.artisticKeep, 0.91),
      makeImg('IMG_3344.CR2', SortCategory.artisticKeep, 0.89),
    ],
    goodImages: [
      makeImg('DSC_9901.NEF', SortCategory.good, 0.84),
      makeImg('IMG_5567.DNG', SortCategory.good, 0.82),
      makeImg('RAW_2200.ARW', SortCategory.good, 0.80),
      makeImg('IMG_0091.JPG', SortCategory.good, 0.78),
      makeImg('DSC_4410.NEF', SortCategory.good, 0.75),
    ],
    okImages: [
      makeImg('IMG_1122.CR3', SortCategory.ok, 0.65),
      makeImg('DSC_5533.NEF', SortCategory.ok, 0.62),
      makeImg('IMG_8844.JPG', SortCategory.ok, 0.60),
      makeImg('RAW_3300.ARW', SortCategory.ok, 0.58),
      makeImg('IMG_6677.CR2', SortCategory.ok, 0.55),
    ],
    rejectImages: [
      makeImg('DSC_7788.NEF', SortCategory.reject, 0.30),
      makeImg('IMG_9900.JPG', SortCategory.reject, 0.25),
      makeImg('RAW_4400.ARW', SortCategory.reject, 0.20),
      makeImg('IMG_1234.CR3', SortCategory.reject, 0.18),
      makeImg('DSC_5678.NEF', SortCategory.reject, 0.15),
    ],
  );
}
