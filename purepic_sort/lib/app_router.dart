import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/app_state.dart';
import 'providers/app_provider.dart';
import 'screens/live_sorting_screen.dart';
import 'screens/preparing_screen.dart';
import 'screens/results_screen.dart';
import 'screens/welcome_screen.dart';

/// Root widget that watches the current screen and
/// renders the appropriate screen with a smooth page transition.
class AppRouter extends ConsumerWidget {
  const AppRouter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final screen = ref.watch(currentScreenProvider);

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 380),
      switchInCurve: Curves.easeOut,
      switchOutCurve: Curves.easeIn,
      transitionBuilder: (child, animation) {
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.02, 0),
              end: Offset.zero,
            ).animate(animation),
            child: child,
          ),
        );
      },
      child: _buildScreen(screen),
    );
  }

  Widget _buildScreen(AppScreen screen) {
    switch (screen) {
      case AppScreen.welcome:
        return const WelcomeScreen(key: ValueKey('welcome'));
      case AppScreen.preparing:
        return const PreparingScreen(key: ValueKey('preparing'));
      case AppScreen.liveSorting:
        return const LiveSortingScreen(key: ValueKey('live_sorting'));
      case AppScreen.results:
        return const ResultsScreen(key: ValueKey('results'));
    }
  }
}
