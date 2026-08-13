import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/folder_selection_card.dart';
import '../widgets/footer.dart';
import '../widgets/primary_button.dart';
import '../widgets/welcome_header.dart';

class WelcomeScreen extends ConsumerWidget {
  const WelcomeScreen({super.key});

  Future<void> _pickFolder(
    BuildContext context,
    WidgetRef ref,
    bool isInput,
  ) async {
    final result = await FilePicker.platform.getDirectoryPath(
      dialogTitle: isInput ? 'Select Input Folder' : 'Select Output Folder',
    );
    if (result != null) {
      if (isInput) {
        ref.read(inputFolderProvider.notifier).state = result;
      } else {
        ref.read(outputFolderProvider.notifier).state = result;
      }
    }
  }

  void _startSorting(BuildContext context, WidgetRef ref) {
    final input = ref.read(inputFolderProvider);
    final output = ref.read(outputFolderProvider);

    if (input.isEmpty || output.isEmpty) return;

    // Navigate to preparing screen first (backend integration point)
    ref.read(currentScreenProvider.notifier).state = AppScreen.preparing;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inputPath = ref.watch(inputFolderProvider);
    final outputPath = ref.watch(outputFolderProvider);
    final canStart = inputPath.isNotEmpty && outputPath.isNotEmpty;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 560),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xl,
                    vertical: AppSpacing.xxl,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Header ──────────────────────────────────────────
                      const WelcomeHeader(),
                      const SizedBox(height: AppSpacing.xxl),

                      // ── Folder section label ─────────────────────────────
                      Text(
                        'SELECT FOLDERS',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          letterSpacing: 1.6,
                          fontWeight: FontWeight.w600,
                          color: AppColors.secondaryText,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // ── Input folder ─────────────────────────────────────
                      FolderSelectionCard(
                        label: 'INPUT FOLDER',
                        path: inputPath,
                        icon: Icons.folder_open_outlined,
                        onBrowse: () => _pickFolder(context, ref, true),
                      ),
                      const SizedBox(height: AppSpacing.sm + 4),

                      // ── Output folder ────────────────────────────────────
                      FolderSelectionCard(
                        label: 'OUTPUT FOLDER',
                        path: outputPath,
                        icon: Icons.drive_folder_upload_outlined,
                        onBrowse: () => _pickFolder(context, ref, false),
                      ),
                      const SizedBox(height: AppSpacing.xxl),

                      // ── Start button ─────────────────────────────────────
                      Center(
                        child: PrimaryButton(
                          label: 'Start Sorting',
                          width: 220,
                          enabled: canStart,
                          icon: Icons.play_arrow_outlined,
                          onPressed: canStart
                              ? () => _startSorting(context, ref)
                              : null,
                        ),
                      ),

                      if (!canStart) ...[
                        const SizedBox(height: AppSpacing.md),
                        Center(
                          child: Text(
                            'Select both folders to continue',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              color: AppColors.secondaryText.withAlpha(100),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Footer ────────────────────────────────────────────────────
          const Divider(height: 1),
          const Footer(version: '1.0.0'),
        ],
      ),
    );
  }
}
