import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../providers/app_provider.dart';
import '../services/backend_service.dart';
import '../theme/app_theme.dart';
import '../widgets/animated_counter.dart';
import '../widgets/image_preview.dart';
import '../widgets/sorting_progress.dart';

class LiveSortingScreen extends ConsumerStatefulWidget {
  const LiveSortingScreen({super.key});

  @override
  ConsumerState<LiveSortingScreen> createState() => _LiveSortingScreenState();
}

class _LiveSortingScreenState extends ConsumerState<LiveSortingScreen> {
  bool _didTransitionToResults = false;

  // Accumulate top-5 per category (highest confidence first)
  final List<SortedImage> _artisticKeep = [];
  final List<SortedImage> _good = [];
  final List<SortedImage> _ok = [];
  final List<SortedImage> _reject = [];

  StreamSubscription<ProgressEvent>? _progressSub;
  StreamSubscription<SortComplete>?  _completeSub;
  DateTime? _startTime;

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now();
    _subscribeToBackend();
  }

  void _subscribeToBackend() {
    final service = ref.read(backendServiceProvider);

    // Collect images per category — keep top 5 by confidence
    _progressSub = service.onProgress.listen((evt) {
      final img = SortedImage(
        path:       evt.filePath,
        filename:   evt.file,
        category:   _labelToCategory(evt.label),
        confidence: evt.confidence,
      );
      _insertTopN(img);
    });

    // When complete, build real results and navigate
    _completeSub = service.onComplete.listen((complete) {
      if (_didTransitionToResults) return;
      _didTransitionToResults = true;

      final elapsed = _startTime != null
          ? DateTime.now().difference(_startTime!).inSeconds
          : 0;

      final result = buildResultFromBackend(
        complete:              complete,
        artisticKeepImages:    List.from(_artisticKeep),
        goodImages:            List.from(_good),
        okImages:              List.from(_ok),
        rejectImages:          List.from(_reject),
        processingTimeSeconds: elapsed,
      );

      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(sortingResultProvider.notifier).state = result;
        ref.read(currentScreenProvider.notifier).state = AppScreen.results;
      });
    });
  }

  void _insertTopN(SortedImage img, {int n = 5}) {
    List<SortedImage> list;
    switch (img.category) {
      case SortCategory.artisticKeep: list = _artisticKeep; break;
      case SortCategory.good:         list = _good;         break;
      case SortCategory.ok:           list = _ok;           break;
      case SortCategory.reject:       list = _reject;       break;
    }

    list.add(img);
    list.sort((a, b) => b.confidence.compareTo(a.confidence));
    if (list.length > n) list.removeLast();
  }

  @override
  void dispose() {
    _progressSub?.cancel();
    _completeSub?.cancel();
    super.dispose();
  }

  void _goBack() {
    _progressSub?.cancel();
    _completeSub?.cancel();
    ref.read(backendServiceProvider).cancel();
    ref.read(sortingProgressProvider.notifier).stop();
    ref.read(currentScreenProvider.notifier).state = AppScreen.welcome;
  }

  @override
  Widget build(BuildContext context) {
    final progress = ref.watch(sortingProgressProvider);

    // Fallback — if progress completes via the progress provider (demo mode)
    if (progress != null &&
        progress.isComplete &&
        !_didTransitionToResults &&
        _completeSub == null) {
      _didTransitionToResults = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final result = buildMockResult(progress);
        ref.read(sortingResultProvider.notifier).state = result;
        ref.read(currentScreenProvider.notifier).state = AppScreen.results;
      });
    }

    if (progress == null) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: CircularProgressIndicator(
            color: AppColors.secondaryText,
            strokeWidth: 1.5,
          ),
        ),
      );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (progress.hasError) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Column(
          children: [
            _TopBar(onBack: _goBack),
            Expanded(
              child: Center(
                child: _ErrorView(
                  message: progress.errorMessage,
                  onBack: _goBack,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // ── Top bar ────────────────────────────────────────────────────
          _TopBar(onBack: _goBack),

          // ── Main workspace ─────────────────────────────────────────────
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Image preview
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: ImagePreview(
                      imagePath:  progress.currentImage,
                      filename:   progress.currentFilename,
                      confidence: progress.currentConfidence,
                      category:   progress.currentCategory,
                    ),
                  ),
                ),
                // Right counters panel
                _RightPanel(progress: progress),
              ],
            ),
          ),

          // ── Progress bar ───────────────────────────────────────────────
          SortingProgressBar(progress: progress),
        ],
      ),
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
        border: Border(bottom: BorderSide(color: AppColors.border, width: 1)),
      ),
      child: Row(
        children: [
          _BackButton(onPressed: onBack),
          const SizedBox(width: AppSpacing.md),
          Container(width: 1, height: 16, color: AppColors.border),
          const SizedBox(width: AppSpacing.md),
          Text(
            'PurePic Sort',
            style: GoogleFonts.inter(
              fontSize: 13, fontWeight: FontWeight.w300,
              letterSpacing: 1.4, color: AppColors.primaryText,
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Container(width: 1, height: 16, color: AppColors.border),
          const SizedBox(width: AppSpacing.md),
          Text(
            'SORTING',
            style: GoogleFonts.inter(
              fontSize: 10, fontWeight: FontWeight.w600,
              letterSpacing: 1.4, color: AppColors.secondaryText,
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
      onExit:  (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: _hovered ? AppColors.primaryText.withAlpha(12) : Colors.transparent,
            border: Border.all(
              color: _hovered ? AppColors.border : Colors.transparent, width: 1),
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.arrow_back_ios_new_rounded, size: 11,
                  color: _hovered ? AppColors.primaryText : AppColors.secondaryText),
              const SizedBox(width: 5),
              Text('Back',
                  style: GoogleFonts.inter(fontSize: 12,
                      color: _hovered ? AppColors.primaryText : AppColors.secondaryText)),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Right panel ──────────────────────────────────────────────────────────────

class _RightPanel extends StatelessWidget {
  const _RightPanel({required this.progress});
  final SortingProgress progress;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      decoration: const BoxDecoration(
        color: AppColors.panel,
        border: Border(left: BorderSide(color: AppColors.border, width: 1)),
      ),
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('CATEGORIES',
              style: GoogleFonts.inter(
                fontSize: 9, letterSpacing: 1.6, fontWeight: FontWeight.w600,
                color: AppColors.secondaryText.withAlpha(140),
              )),
          const SizedBox(height: AppSpacing.md),
          AnimatedCounter(label: 'Artistic Keep',
              count: progress.artisticKeepCount, accentColor: AppColors.artisticKeep),
          const SizedBox(height: AppSpacing.sm),
          AnimatedCounter(label: 'Good',
              count: progress.goodCount, accentColor: AppColors.good),
          const SizedBox(height: AppSpacing.sm),
          AnimatedCounter(label: 'OK',
              count: progress.okCount, accentColor: AppColors.ok),
          const SizedBox(height: AppSpacing.sm),
          AnimatedCounter(label: 'Reject',
              count: progress.rejectCount, accentColor: AppColors.reject),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm + 2),
            decoration: BoxDecoration(
              color: AppColors.surface,
              border: Border.all(color: AppColors.border, width: 1),
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('PROCESSED',
                    style: GoogleFonts.inter(fontSize: 9, letterSpacing: 1.2,
                        color: AppColors.secondaryText.withAlpha(140),
                        fontWeight: FontWeight.w500)),
                const SizedBox(height: 4),
                Text('${progress.processed} / ${progress.total}',
                    style: GoogleFonts.inter(fontSize: 15,
                        fontWeight: FontWeight.w300, color: AppColors.primaryText)),
                const SizedBox(height: 6),
                LayoutBuilder(
                  builder: (ctx, c) => Stack(children: [
                    Container(height: 2, width: c.maxWidth, color: AppColors.border),
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeOut,
                      height: 2,
                      width: c.maxWidth * progress.progressFraction,
                      color: AppColors.primaryText,
                    ),
                  ]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Error view ───────────────────────────────────────────────────────────────

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onBack});
  final String message;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 480),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 36, color: AppColors.reject),
            const SizedBox(height: AppSpacing.md),
            Text('Sorting Error',
                style: GoogleFonts.inter(fontSize: 18,
                    fontWeight: FontWeight.w300, color: AppColors.primaryText)),
            const SizedBox(height: AppSpacing.sm),
            Text(message,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 12, color: AppColors.secondaryText)),
            const SizedBox(height: AppSpacing.xl),
            GestureDetector(
              onTap: onBack,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Text('Back to Welcome',
                    style: GoogleFonts.inter(fontSize: 12, color: AppColors.primaryText)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

SortCategory _labelToCategory(String label) {
  switch (label) {
    case 'artistic_keep': return SortCategory.artisticKeep;
    case 'good':          return SortCategory.good;
    case 'ok':            return SortCategory.ok;
    default:              return SortCategory.reject;
  }
}
