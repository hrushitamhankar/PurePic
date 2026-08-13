import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class Footer extends StatelessWidget {
  const Footer({super.key, this.version = '1.0.0'});

  final String version;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.xl,
        vertical: AppSpacing.md,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _FooterChip(
            icon: Icons.wifi_off_rounded,
            label: 'Offline',
          ),
          const SizedBox(width: AppSpacing.lg),
          _FooterDot(),
          const SizedBox(width: AppSpacing.lg),
          _FooterChip(
            icon: Icons.check_circle_outline_rounded,
            label: 'Ready',
            iconColor: const Color(0xFF81C784),
          ),
          const SizedBox(width: AppSpacing.lg),
          _FooterDot(),
          const SizedBox(width: AppSpacing.lg),
          _FooterChip(
            icon: Icons.info_outline_rounded,
            label: 'v$version',
          ),
        ],
      ),
    );
  }
}

class _FooterChip extends StatelessWidget {
  const _FooterChip({
    required this.icon,
    required this.label,
    this.iconColor,
  });

  final IconData icon;
  final String label;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 11,
          color: iconColor ?? AppColors.secondaryText.withAlpha(140),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            color: AppColors.secondaryText.withAlpha(140),
            fontWeight: FontWeight.w400,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }
}

class _FooterDot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 3,
      height: 3,
      decoration: BoxDecoration(
        color: AppColors.border,
        shape: BoxShape.circle,
      ),
    );
  }
}
