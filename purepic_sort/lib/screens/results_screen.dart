import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/primary_button.dart';
import '../widgets/result_category.dart';

class ResultsScreen extends ConsumerStatefulWidget {
  const ResultsScreen({super.key});

  @override
  ConsumerState<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends ConsumerState<ResultsScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _enterController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _enterController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    )..forward();
    _fadeAnim = CurvedAnimation(parent: _enterController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.03),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _enterController, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _enterController.dispose();
    super.dispose();
  }

  void _sortAnother() {
    ref.read(sortingProgressProvider.notifier).stop();
    ref.read(sortingResultProvider.notifier).state = null;
    ref.read(inputFolderProvider.notifier).state = '';
    ref.read(outputFolderProvider.notifier).state = '';
    ref.read(currentScreenProvider.notifier).state = AppScreen.welcome;
  }

  @override
  Widget build(BuildContext context) {
    final result = ref.watch(sortingResultProvider);
    if (result == null) {
      return const Scaffold(backgroundColor: AppColors.background);
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: FadeTransition(
        opacity: _fadeAnim,
        child: SlideTransition(
          position: _slideAnim,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _TopBar(onBack: _sortAnother),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.xl, AppSpacing.xl,
                    AppSpacing.xl, AppSpacing.xxl,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ── Summary ────────────────────────────────────────
                      _SummaryHeader(result: result),
                      const SizedBox(height: AppSpacing.xl + 4),
                      const Divider(height: 1),
                      const SizedBox(height: AppSpacing.xl + 4),

                      // ── 2 × 2 category grid ────────────────────────────
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                ResultCategory(
                                  category: SortCategory.artisticKeep,
                                  images: result.artisticKeepImages,
                                  totalCount: result.artisticKeepTotal > 0
                                      ? result.artisticKeepTotal
                                      : result.artisticKeepImages.length,
                                  accentColor: AppColors.artisticKeep,
                                ),
                                const SizedBox(height: AppSpacing.md),
                                ResultCategory(
                                  category: SortCategory.ok,
                                  images: result.okImages,
                                  totalCount: result.okTotal > 0
                                      ? result.okTotal
                                      : result.okImages.length,
                                  accentColor: AppColors.ok,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Column(
                              children: [
                                ResultCategory(
                                  category: SortCategory.good,
                                  images: result.goodImages,
                                  totalCount: result.goodTotal > 0
                                      ? result.goodTotal
                                      : result.goodImages.length,
                                  accentColor: AppColors.good,
                                ),
                                const SizedBox(height: AppSpacing.md),
                                ResultCategory(
                                  category: SortCategory.reject,
                                  images: result.rejectImages,
                                  totalCount: result.rejectTotal > 0
                                      ? result.rejectTotal
                                      : result.rejectImages.length,
                                  accentColor: AppColors.reject,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: AppSpacing.xxl),
                      const Divider(height: 1),
                      const SizedBox(height: AppSpacing.xl),

                      // ── Action buttons ─────────────────────────────────
                      _ActionButtons(
                        onOpenFolder: () {
                          final outputPath = ref.read(outputFolderProvider);
                          if (outputPath.isNotEmpty) {
                            Process.run('explorer', [outputPath]);
                          }
                        },
                        onSortAnother: _sortAnother,
                        onExit: () => Navigator.of(context).maybePop(),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
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
          Text('PurePic Sort',
              style: GoogleFonts.inter(
                fontSize: 13, fontWeight: FontWeight.w300,
                letterSpacing: 1.4, color: AppColors.primaryText,
              )),
          const SizedBox(width: AppSpacing.md),
          Container(width: 1, height: 16, color: AppColors.border),
          const SizedBox(width: AppSpacing.md),
          Text('RESULTS',
              style: GoogleFonts.inter(
                fontSize: 10, fontWeight: FontWeight.w600,
                letterSpacing: 1.4, color: AppColors.secondaryText,
              )),
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

// ─── Summary header ───────────────────────────────────────────────────────────

class _SummaryHeader extends StatelessWidget {
  const _SummaryHeader({required this.result});
  final SortingResult result;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        // Title
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: Color(0xFF81C784),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Sorting Complete',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.4,
                      color: const Color(0xFF81C784),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${result.totalImages} images sorted',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w200,
                  letterSpacing: -0.5,
                  color: AppColors.primaryText,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Processed in ${result.processingTimeFormatted}  ·  '
                '${result.artisticKeepTotal} keep  ·  '
                '${result.goodTotal} good  ·  '
                '${result.okTotal} ok  ·  '
                '${result.rejectTotal} reject',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppColors.secondaryText,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),

        // Donut-style breakdown
        _BreakdownBar(result: result),
      ],
    );
  }
}

// ─── Proportional breakdown bar ───────────────────────────────────────────────

class _BreakdownBar extends StatelessWidget {
  const _BreakdownBar({required this.result});
  final SortingResult result;

  @override
  Widget build(BuildContext context) {
    final total = result.totalImages;
    if (total == 0) return const SizedBox.shrink();

    final segments = [
      _Seg(result.artisticKeepTotal, AppColors.artisticKeep, 'Keep'),
      _Seg(result.goodTotal,         AppColors.good,          'Good'),
      _Seg(result.okTotal,           AppColors.ok,            'OK'),
      _Seg(result.rejectTotal,       AppColors.reject,        'Reject'),
    ];

    return SizedBox(
      width: 220,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Stacked bar
          ClipRRect(
            borderRadius: BorderRadius.circular(2),
            child: SizedBox(
              height: 4,
              child: Row(
                children: segments.map((s) {
                  final frac = total > 0 ? s.count / total : 0.0;
                  return Flexible(
                    flex: (frac * 1000).round().clamp(1, 1000),
                    child: Container(color: s.color),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 10),
          // Legend
          Wrap(
            spacing: 12,
            runSpacing: 4,
            alignment: WrapAlignment.end,
            children: segments.map((s) => _LegendDot(seg: s)).toList(),
          ),
        ],
      ),
    );
  }
}

class _Seg {
  const _Seg(this.count, this.color, this.label);
  final int count;
  final Color color;
  final String label;
}

class _LegendDot extends StatelessWidget {
  const _LegendDot({required this.seg});
  final _Seg seg;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 6, height: 6,
          decoration: BoxDecoration(color: seg.color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(
          '${seg.label} ${seg.count}',
          style: GoogleFonts.inter(
            fontSize: 10,
            color: AppColors.secondaryText,
            fontWeight: FontWeight.w400,
          ),
        ),
      ],
    );
  }
}

// ─── Action buttons ───────────────────────────────────────────────────────────

class _ActionButtons extends StatelessWidget {
  const _ActionButtons({
    required this.onOpenFolder,
    required this.onSortAnother,
    required this.onExit,
  });

  final VoidCallback onOpenFolder;
  final VoidCallback onSortAnother;
  final VoidCallback onExit;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        PrimaryButton(
          label: 'Open Output Folder',
          icon: Icons.folder_open_outlined,
          onPressed: onOpenFolder,
          variant: PrimaryButtonVariant.outlined,
        ),
        const SizedBox(width: AppSpacing.md),
        PrimaryButton(
          label: 'Sort Another Folder',
          icon: Icons.refresh_rounded,
          onPressed: onSortAnother,
        ),
        const SizedBox(width: AppSpacing.md),
        PrimaryButton(
          label: 'Exit',
          icon: Icons.close,
          onPressed: onExit,
          variant: PrimaryButtonVariant.outlined,
        ),
      ],
    );
  }
}
