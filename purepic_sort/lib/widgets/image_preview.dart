import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../theme/app_theme.dart';

/// Large image preview widget shown during live sorting.
/// Displays a crossfade transition when the current image changes.
class ImagePreview extends StatefulWidget {
  const ImagePreview({
    super.key,
    required this.imagePath,
    required this.filename,
    required this.confidence,
    required this.category,
  });

  final String imagePath;
  final String filename;
  final double confidence;
  final SortCategory category;

  @override
  State<ImagePreview> createState() => _ImagePreviewState();
}

class _ImagePreviewState extends State<ImagePreview>
    with SingleTickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnim;
  String _currentPath = '';

  @override
  void initState() {
    super.initState();
    _currentPath = widget.imagePath;
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
      value: 1.0,
    );
    _fadeAnim = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    );
  }

  @override
  void didUpdateWidget(ImagePreview old) {
    super.didUpdateWidget(old);
    if (widget.imagePath != old.imagePath) {
      _fadeController.reverse().then((_) {
        if (mounted) {
          setState(() => _currentPath = widget.imagePath);
          _fadeController.forward();
        }
      });
    }
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  Color get _categoryColor {
    switch (widget.category) {
      case SortCategory.artisticKeep:
        return AppColors.artisticKeep;
      case SortCategory.good:
        return AppColors.good;
      case SortCategory.ok:
        return AppColors.ok;
      case SortCategory.reject:
        return AppColors.reject;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Image frame
        Expanded(
          child: FadeTransition(
            opacity: _fadeAnim,
            child: _ImageFrame(imagePath: _currentPath),
          ),
        ),

        const SizedBox(height: AppSpacing.md),

        // Metadata row
        _MetadataRow(
          filename: widget.filename,
          confidence: widget.confidence,
          category: widget.category,
          categoryColor: _categoryColor,
        ),
      ],
    );
  }
}

class _ImageFrame extends StatelessWidget {
  const _ImageFrame({required this.imagePath});

  final String imagePath;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border, width: 1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      clipBehavior: Clip.antiAlias,
      child: _buildImage(),
    );
  }

  Widget _buildImage() {
    if (imagePath.isEmpty) {
      return _placeholder();
    }

    final file = File(imagePath);
    if (!file.existsSync()) {
      return _placeholder();
    }

    return Image.file(
      file,
      fit: BoxFit.contain,
      errorBuilder: (ctx, err, stack) => _placeholder(),
    );
  }

  Widget _placeholder() {
    return Container(
      color: AppColors.surface,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.image_outlined,
              size: 48,
              color: AppColors.border,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Processing...',
              style: GoogleFonts.inter(
                fontSize: 12,
                color: AppColors.secondaryText.withAlpha(80),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetadataRow extends StatelessWidget {
  const _MetadataRow({
    required this.filename,
    required this.confidence,
    required this.category,
    required this.categoryColor,
  });

  final String filename;
  final double confidence;
  final SortCategory category;
  final Color categoryColor;

  @override
  Widget build(BuildContext context) {
    final pct = (confidence * 100).toStringAsFixed(0);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 2,
      ),
      decoration: BoxDecoration(
        color: AppColors.panel,
        border: Border.all(color: AppColors.border, width: 1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Row(
        children: [
          // Filename
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'FILE',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: AppColors.secondaryText.withAlpha(140),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  filename.isNotEmpty ? filename : '—',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    color: AppColors.primaryText,
                  ),
                ),
              ],
            ),
          ),

          _Divider(),

          // Confidence
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'AI CONFIDENCE',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: AppColors.secondaryText.withAlpha(140),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  filename.isNotEmpty ? '$pct%' : '—',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    color: AppColors.primaryText,
                  ),
                ),
              ],
            ),
          ),

          _Divider(),

          // Destination
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'DESTINATION',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: AppColors.secondaryText.withAlpha(140),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  filename.isNotEmpty ? category.label : '—',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: categoryColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 32,
      color: AppColors.border,
      margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
    );
  }
}
