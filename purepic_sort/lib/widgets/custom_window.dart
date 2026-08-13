import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Wraps the entire app in the custom window chrome.
/// On Windows the real title bar is hidden via the windows runner;
/// this widget provides the application-level frame appearance.
class CustomWindow extends StatelessWidget {
  const CustomWindow({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: child,
    );
  }
}
