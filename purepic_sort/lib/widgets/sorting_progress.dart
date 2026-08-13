import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../theme/app_theme.dart';

class SortingProgressBar extends StatelessWidget {
  const SortingProgressBar({
    super.key,
    required this.progress,
  });

  final SortingProgress progress;

  @override
  Widget build(BuildContext context) {
    final speed = progress.speedPerSecond.toStringAsFixed(1);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: AppColors.panel,
        border: Border(
          top: BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Progress track
          _AnimatedProgressTrack(fraction: progress.progressFraction),
          const SizedBox(height: AppSpacing.sm + 2),

          // Stats row
          Row(
            children: [
              _StatChip(
                label: 'IMAGES',
                value:
                    '${progress.processed} / ${progress.total}',
              ),
              const Spacer(),
              _StatChip(
                label: 'ETA',
                value: progress.etaFormatted,
              ),
              const SizedBox(width: AppSpacing.lg),
              _StatChip(
                label: 'SPEED',
                value: '$speed img/s',
              ),
              const SizedBox(width: AppSpacing.lg),
              _StatusBadge(
                isComplete: progress.isComplete,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _AnimatedProgressTrack extends StatelessWidget {
  const _AnimatedProgressTrack({required this.fraction});

  final double fraction;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            // Track
            Container(
              height: 2,
              width: constraints.maxWidth,
              color: AppColors.border,
            ),
            // Fill
            AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              curve: Curves.easeOut,
              height: 2,
              width: constraints.maxWidth * fraction.clamp(0.0, 1.0),
              color: AppColors.primaryText,
            ),
          ],
        );
      },
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 9,
            letterSpacing: 1.2,
            color: AppColors.secondaryText.withAlpha(140),
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: AppColors.primaryText,
          ),
        ),
      ],
    );
  }
}

class _StatusBadge extends StatefulWidget {
  const _StatusBadge({required this.isComplete});
  final bool isComplete;

  @override
  State<_StatusBadge> createState() => _StatusBadgeState();
}

class _StatusBadgeState extends State<_StatusBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isComplete) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.check_circle_outline,
              size: 11, color: Color(0xFF81C784)),
          const SizedBox(width: 5),
          Text(
            'Complete',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: const Color(0xFF81C784),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        FadeTransition(
          opacity: _pulseAnim,
          child: Container(
            width: 6,
            height: 6,
            decoration: const BoxDecoration(
              color: AppColors.primaryText,
              shape: BoxShape.circle,
            ),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          'Sorting...',
          style: GoogleFonts.inter(
            fontSize: 12,
            color: AppColors.secondaryText,
            fontWeight: FontWeight.w400,
          ),
        ),
      ],
    );
  }
}
