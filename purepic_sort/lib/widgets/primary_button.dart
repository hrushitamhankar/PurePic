import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

enum PrimaryButtonVariant { filled, outlined }

class PrimaryButton extends StatefulWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = PrimaryButtonVariant.filled,
    this.icon,
    this.width,
    this.enabled = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final PrimaryButtonVariant variant;
  final IconData? icon;
  final double? width;
  final bool enabled;

  @override
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final isFilled = widget.variant == PrimaryButtonVariant.filled;
    final active = widget.enabled && widget.onPressed != null;

    Color bgColor;
    Color borderColor;
    Color textColor;

    if (!active) {
      bgColor = AppColors.panel;
      borderColor = AppColors.border;
      textColor = AppColors.secondaryText.withAlpha(80);
    } else if (isFilled) {
      bgColor = _pressed
          ? AppColors.primaryText.withAlpha(220)
          : _hovered
              ? AppColors.primaryText.withAlpha(240)
              : AppColors.primaryText;
      borderColor = AppColors.primaryText;
      textColor = AppColors.background;
    } else {
      bgColor = _pressed
          ? AppColors.primaryText.withAlpha(20)
          : _hovered
              ? AppColors.primaryText.withAlpha(12)
              : Colors.transparent;
      borderColor =
          _hovered ? AppColors.primaryText : AppColors.secondaryText;
      textColor = AppColors.primaryText;
    }

    return MouseRegion(
      cursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onEnter: (_) {
        if (active) setState(() => _hovered = true);
      },
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTapDown: (_) {
          if (active) setState(() => _pressed = true);
        },
        onTapUp: (_) {
          setState(() => _pressed = false);
          if (active) widget.onPressed?.call();
        },
        onTapCancel: () => setState(() => _pressed = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          width: widget.width,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl,
            vertical: 14,
          ),
          decoration: BoxDecoration(
            color: bgColor,
            border: Border.all(color: borderColor, width: 1),
            borderRadius: BorderRadius.circular(AppRadius.sm),
            boxShadow: isFilled && active && !_pressed
                ? [
                    BoxShadow(
                      color: AppColors.primaryText.withAlpha(15),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (widget.icon != null) ...[
                Icon(widget.icon, size: 15, color: textColor),
                const SizedBox(width: AppSpacing.sm),
              ],
              Text(
                widget.label,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 0.8,
                  color: textColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
