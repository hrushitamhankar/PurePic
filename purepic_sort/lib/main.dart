import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_router.dart';
import 'theme/app_theme.dart';
import 'widgets/custom_window.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: PurePicSortApp(),
    ),
  );
}

class PurePicSortApp extends StatelessWidget {
  const PurePicSortApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PurePic Sort',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const CustomWindow(
        child: AppRouter(),
      ),
    );
  }
}
