import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  AppColors._();

  static const Color background = Color(0xFF0D0D0D);
  static const Color surface = Color(0xFF181818);
  static const Color panel = Color(0xFF202020);
  static const Color border = Color(0xFF2B2B2B);
  static const Color primaryText = Color(0xFFF5F5F5);
  static const Color secondaryText = Color(0xFFA0A0A0);
  static const Color accentWhite = Color(0xFFFFFFFF);
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFFA726);

  // Category accent colours — muted, professional
  static const Color artisticKeep = Color(0xFF7EB8F7);
  static const Color good = Color(0xFF81C784);
  static const Color ok = Color(0xFFFFD54F);
  static const Color reject = Color(0xFFE57373);
}

class AppSpacing {
  AppSpacing._();

  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppRadius {
  AppRadius._();

  static const double sm = 3.0;
  static const double md = 5.0;
  static const double lg = 8.0;
}

ThemeData buildAppTheme() {
  final base = ThemeData.dark();
  return base.copyWith(
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: const ColorScheme.dark(
      surface: AppColors.surface,
      primary: AppColors.primaryText,
      secondary: AppColors.secondaryText,
    ),
    textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(
      bodyColor: AppColors.primaryText,
      displayColor: AppColors.primaryText,
    ),
    dividerColor: AppColors.border,
    dividerTheme: const DividerThemeData(
      color: AppColors.border,
      thickness: 1,
      space: 0,
    ),
  );
}
