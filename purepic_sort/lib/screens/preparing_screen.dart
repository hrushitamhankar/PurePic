import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

// ─── Phase model ─────────────────────────────────────────────────────────────

enum _Phase { scanning, found, preparing, launching }

class PreparingScreen extends ConsumerStatefulWidget {
  const PreparingScreen({super.key});

  @override
  ConsumerState<PreparingScreen> createState() => _PreparingScreenState();
}

class _PreparingScreenState extends ConsumerState<PreparingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _barController;
  late Animation<double> _barAnim;

  _Phase _phase = _Phase.scanning;
  int _imageCount = 0;

  final List<_LogLine> _log = [];

  StreamSubscription<int>?    _scanSub;
  StreamSubscription<String>? _logSub;
  StreamSubscription<String>? _errorSub;

  int _dotsCount = 0;
  Timer? _dotsTimer;
  Timer? _launchTimer;

  @override
  void initState() {
    super.initState();

    _barController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );
    _barAnim = CurvedAnimation(parent: _barController, curve: Curves.easeInOut);

    // Defer all provider reads/writes until after the first build frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _startSequence();
    });
  }

  void _startSequence() {
    _addLog('Initialising PurePic Sort engine…', dim: true);
    _barController.forward();

    // Animate dots while scanning
    _dotsTimer = Timer.periodic(const Duration(milliseconds: 380), (_) {
      if (mounted) setState(() => _dotsCount = (_dotsCount + 1) % 4);
    });

    final service      = ref.read(backendServiceProvider);
    final inputFolder  = ref.read(inputFolderProvider);
    final outputFolder = ref.read(outputFolderProvider);

    // Subscribe to backend log lines
    _logSub = service.onLog.listen((msg) {
      if (mounted) setState(() => _log.add(_LogLine(msg, dim: true)));
    });

    // Subscribe to error
    _errorSub = service.onError.listen((err) {
      if (!mounted) return;
      setState(() {
        _log.add(_LogLine('Error: $err', accent: true));
      });
    });

    // Subscribe to scan result — Python tells us the image count
    _scanSub = service.onScanResult.listen((total) {
      if (!mounted) return;
      _dotsTimer?.cancel();
      setState(() {
        _imageCount = total;
        _phase = _Phase.found;
        _log.add(_LogLine('$total images found.', accent: true));
      });

      // Short pause then show "Preparing AI Engine"
      Future.delayed(const Duration(milliseconds: 600), () {
        if (!mounted) return;
        setState(() {
          _phase = _Phase.preparing;
          _log.add(_LogLine('Loading AI model weights…', dim: true));
        });

        // Transition to live sorting after a beat
        _launchTimer = Timer(const Duration(milliseconds: 900), () {
          if (!mounted) return;
          setState(() {
            _phase = _Phase.launching;
            _log.add(_LogLine('Ready. Starting sort…', accent: true));
          });

          Future.delayed(const Duration(milliseconds: 500), () {
            if (!mounted) return;
            // Progress notifier is already wired to the backend service
            // via startSort — just switch screen
            ref.read(currentScreenProvider.notifier).state =
                AppScreen.liveSorting;
          });
        });
      });
    });

    // Start the real sort (scan phase begins immediately)
    ref
        .read(sortingProgressProvider.notifier)
        .startSort(inputFolder, outputFolder);
  }

  void _addLog(String text, {bool dim = false, bool accent = false}) {
    _log.add(_LogLine(text, dim: dim, accent: accent));
  }

  void _goBack() {
    _launchTimer?.cancel();
    _dotsTimer?.cancel();
    _scanSub?.cancel();
    _logSub?.cancel();
    _errorSub?.cancel();
    _barController.stop();
    ref.read(backendServiceProvider).cancel();
    ref.read(sortingProgressProvider.notifier).stop();
    ref.read(currentScreenProvider.notifier).state = AppScreen.welcome;
  }

  @override
  void dispose() {
    _launchTimer?.cancel();
    _dotsTimer?.cancel();
    _scanSub?.cancel();
    _logSub?.cancel();
    _errorSub?.cancel();
    _barController.dispose();
    super.dispose();
  }

  String get _scanningLabel {
    final dots = '.' * _dotsCount;
    return 'Scanning Folder$dots';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Top bar with back button ─────────────────────────────────
          _TopBar(onBack: _goBack),

          // ── Main content ─────────────────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.xl,
                      vertical: AppSpacing.xxl,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ── Title ────────────────────────────────────────
                        _buildTitle(),
                        const SizedBox(height: AppSpacing.xxl),

                        // ── Progress bar ─────────────────────────────────
                        _ScanProgressBar(animation: _barAnim),
                        const SizedBox(height: AppSpacing.xl),

                        // ── Phase label ──────────────────────────────────
                        _PhaseLabel(phase: _phase, imageCount: _imageCount),
                        const SizedBox(height: AppSpacing.xxl),

                        // ── Log lines ────────────────────────────────────
                        _LogLines(lines: _log),
                        const SizedBox(height: AppSpacing.xl),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTitle() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _phase == _Phase.scanning
              ? _scanningLabel
              : _phase == _Phase.found
                  ? '$_imageCount Images Found'
                  : _phase == _Phase.preparing
                      ? 'Preparing AI Engine…'
                      : 'Ready',
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w300,
            letterSpacing: 0.3,
            color: AppColors.primaryText,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          _phase == _Phase.scanning
              ? 'Analysing your input folder'
              : _phase == _Phase.found
                  ? 'Images ready for processing'
                  : _phase == _Phase.preparing
                      ? 'Loading PurePic neural network'
                      : 'Launching sorting workspace',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: AppColors.secondaryText,
          ),
        ),
      ],
    );
  }
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  const _TopBar({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
      decoration: const BoxDecoration(
        color: AppColors.panel,
        border: Border(
          bottom: BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      child: Row(
        children: [
          // Back button
          _BackButton(onPressed: onBack),
          const SizedBox(width: AppSpacing.md),
          Container(width: 1, height: 16, color: AppColors.border),
          const SizedBox(width: AppSpacing.md),
          Text(
            'PurePic Sort',
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w300,
              letterSpacing: 1.4,
              color: AppColors.primaryText,
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Container(width: 1, height: 16, color: AppColors.border),
          const SizedBox(width: AppSpacing.md),
          Text(
            'PREPARING',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.4,
              color: AppColors.secondaryText,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Back button ──────────────────────────────────────────────────────────────

class _BackButton extends StatefulWidget {
  const _BackButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  State<_BackButton> createState() => _BackButtonState();
}

class _BackButtonState extends State<_BackButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm + 2,
            vertical: 5,
          ),
          decoration: BoxDecoration(
            color: _hovered
                ? AppColors.primaryText.withAlpha(12)
                : Colors.transparent,
            border: Border.all(
              color: _hovered ? AppColors.border : Colors.transparent,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 11,
                color: _hovered
                    ? AppColors.primaryText
                    : AppColors.secondaryText,
              ),
              const SizedBox(width: 5),
              Text(
                'Back',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: _hovered
                      ? AppColors.primaryText
                      : AppColors.secondaryText,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Scan progress bar ────────────────────────────────────────────────────────

class _ScanProgressBar extends StatelessWidget {
  const _ScanProgressBar({required this.animation});

  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Track + fill
        LayoutBuilder(
          builder: (ctx, constraints) {
            return Stack(
              children: [
                // Background track
                Container(
                  height: 2,
                  width: constraints.maxWidth,
                  color: AppColors.border,
                ),
                // Animated fill
                AnimatedBuilder(
                  animation: animation,
                  builder: (ctx, _) => Container(
                    height: 2,
                    width: constraints.maxWidth * animation.value,
                    decoration: BoxDecoration(
                      color: AppColors.primaryText,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryText.withAlpha(60),
                          blurRadius: 8,
                          spreadRadius: 0,
                        ),
                      ],
                    ),
                  ),
                ),
                // Leading glow dot
                AnimatedBuilder(
                  animation: animation,
                  builder: (ctx, _) {
                    final x = constraints.maxWidth * animation.value;
                    return Positioned(
                      left: (x - 3).clamp(0.0, constraints.maxWidth - 6),
                      top: -2,
                      child: Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: AppColors.primaryText,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryText.withAlpha(100),
                              blurRadius: 10,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            );
          },
        ),
      ],
    );
  }
}

// ─── Phase label ─────────────────────────────────────────────────────────────

class _PhaseLabel extends StatelessWidget {
  const _PhaseLabel({required this.phase, required this.imageCount});

  final _Phase phase;
  final int imageCount;

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 350),
      switchInCurve: Curves.easeOut,
      transitionBuilder: (child, anim) => FadeTransition(
        opacity: anim,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.15),
            end: Offset.zero,
          ).animate(anim),
          child: child,
        ),
      ),
      child: _buildChip(phase),
    );
  }

  Widget _buildChip(_Phase p) {
    switch (p) {
      case _Phase.scanning:
        return _Chip(
          key: const ValueKey('scanning'),
          icon: Icons.folder_open_outlined,
          label: 'Reading folder structure',
          color: AppColors.secondaryText,
        );
      case _Phase.found:
        return _Chip(
          key: const ValueKey('found'),
          icon: Icons.check_circle_outline_rounded,
          label: '$imageCount images ready for analysis',
          color: AppColors.good,
        );
      case _Phase.preparing:
        return _Chip(
          key: const ValueKey('preparing'),
          icon: Icons.memory_outlined,
          label: 'Warming up neural network',
          color: AppColors.artisticKeep,
        );
      case _Phase.launching:
        return _Chip(
          key: const ValueKey('launching'),
          icon: Icons.play_circle_outline_rounded,
          label: 'Launching sorting workspace',
          color: AppColors.primaryText,
        );
    }
  }
}

class _Chip extends StatelessWidget {
  const _Chip({
    super.key,
    required this.icon,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 2,
      ),
      decoration: BoxDecoration(
        color: color.withAlpha(14),
        border: Border.all(color: color.withAlpha(50), width: 1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: AppSpacing.sm),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: color,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Log lines ────────────────────────────────────────────────────────────────

class _LogLine {
  const _LogLine(this.text, {this.dim = false, this.accent = false});

  final String text;
  final bool dim;
  final bool accent;
}

class _LogLines extends StatelessWidget {
  const _LogLines({required this.lines});

  final List<_LogLine> lines;

  @override
  Widget build(BuildContext context) {
    if (lines.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border, width: 1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final line in lines) ...[
            _AnimatedLogEntry(line: line),
            if (line != lines.last)
              const SizedBox(height: AppSpacing.xs),
          ],
        ],
      ),
    );
  }
}

class _AnimatedLogEntry extends StatefulWidget {
  const _AnimatedLogEntry({required this.line});

  final _LogLine line;

  @override
  State<_AnimatedLogEntry> createState() => _AnimatedLogEntryState();
}

class _AnimatedLogEntryState extends State<_AnimatedLogEntry>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    )..forward();
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.line.accent
        ? AppColors.primaryText
        : widget.line.dim
            ? AppColors.secondaryText.withAlpha(100)
            : AppColors.secondaryText;

    return FadeTransition(
      opacity: _fade,
      child: Row(
        children: [
          Text(
            '› ',
            style: GoogleFonts.robotoMono(
              fontSize: 11,
              color: AppColors.border,
            ),
          ),
          Text(
            widget.line.text,
            style: GoogleFonts.robotoMono(
              fontSize: 11,
              color: color,
              fontWeight: widget.line.accent
                  ? FontWeight.w500
                  : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}
