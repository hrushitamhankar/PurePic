import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class WelcomeHeader extends StatelessWidget {
  const WelcomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const _LogoMark(),
        const SizedBox(height: AppSpacing.md),
        Text(
          'PurePic Sort',
          style: GoogleFonts.inter(
            fontSize: 28,
            fontWeight: FontWeight.w300,
            letterSpacing: 2.0,
            color: AppColors.primaryText,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'AI-powered Photo Culling for Professionals',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            letterSpacing: 0.6,
            color: AppColors.secondaryText,
          ),
        ),
      ],
    );
  }
}

class _LogoMark extends StatelessWidget {
  const _LogoMark();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 52,
      height: 52,
      child: CustomPaint(painter: _AperturePainter()),
    );
  }
}

class _AperturePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Outer ring
    canvas.drawCircle(
      center,
      radius - 1,
      Paint()
        ..color = AppColors.primaryText
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.2,
    );

    // Inner fill
    canvas.drawCircle(
      center,
      radius * 0.42,
      Paint()
        ..color = AppColors.secondaryText.withAlpha(30)
        ..style = PaintingStyle.fill,
    );

    // Inner ring
    canvas.drawCircle(
      center,
      radius * 0.42,
      Paint()
        ..color = AppColors.secondaryText
        ..style = PaintingStyle.stroke
        ..strokeWidth = 0.8,
    );

    // Aperture blade lines
    final bladePaint = Paint()
      ..color = AppColors.primaryText
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < 6; i++) {
      final angle = i * 60.0 * math.pi / 180.0;
      final x1 = center.dx + (radius * 0.42) * math.cos(angle);
      final y1 = center.dy + (radius * 0.42) * math.sin(angle);
      final x2 = center.dx + (radius - 1) * math.cos(angle);
      final y2 = center.dy + (radius - 1) * math.sin(angle);
      canvas.drawLine(Offset(x1, y1), Offset(x2, y2), bladePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
