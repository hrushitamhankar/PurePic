import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

/// Displays a category label with a smoothly animated count.
class AnimatedCounter extends StatefulWidget {
  const AnimatedCounter({
    super.key,
    required this.label,
    required this.count,
    required this.accentColor,
  });

  final String label;
  final int count;
  final Color accentColor;

  @override
  State<AnimatedCounter> createState() => _AnimatedCounterState();
}

class _AnimatedCounterState extends State<AnimatedCounter>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  int _displayedCount = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 280),
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    )..addStatusListener((s) {
        if (s == AnimationStatus.completed) {
          _controller.reverse();
        }
      });
    _displayedCount = widget.count;
  }

  @override
  void didUpdateWidget(AnimatedCounter old) {
    super.didUpdateWidget(old);
    if (widget.count != old.count) {
      _displayedCount = widget.count;
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 4,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border, width: 1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Row(
        children: [
          // Accent bar
          Container(
            width: 2.5,
            height: 28,
            decoration: BoxDecoration(
              color: widget.accentColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: AppSpacing.sm + 2),

          // Label
          Expanded(
            child: Text(
              widget.label,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: AppColors.secondaryText,
                letterSpacing: 0.2,
              ),
            ),
          ),

          // Animated count
          ScaleTransition(
            scale: _scaleAnim,
            child: Text(
              '$_displayedCount',
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w300,
                color: AppColors.primaryText,
                letterSpacing: -0.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
