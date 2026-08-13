import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../theme/app_theme.dart';

class ResultThumbnail extends StatefulWidget {
  const ResultThumbnail({
    super.key,
    required this.image,
    required this.index,
  });

  final SortedImage image;
  final int index;

  @override
  State<ResultThumbnail> createState() => _ResultThumbnailState();
}

class _ResultThumbnailState extends State<ResultThumbnail> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final pct = (widget.image.confidence * 100).toStringAsFixed(0);

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(
            color: _hovered ? AppColors.secondaryText : AppColors.border,
            width: 1,
          ),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image
            Expanded(
              child: _buildImage(),
            ),

            // Caption
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.sm,
                vertical: 5,
              ),
              color: AppColors.panel,
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.image.filename,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        color: AppColors.secondaryText,
                        fontWeight: FontWeight.w400,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text(
                    '$pct%',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: AppColors.primaryText,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    if (widget.image.path.isNotEmpty) {
      final file = File(widget.image.path);
      if (file.existsSync()) {
        return Image.file(
          file,
          fit: BoxFit.cover,
          errorBuilder: (ctx, err, stack) => _placeholderImage(),
        );
      }
    }
    return _placeholderImage();
  }

  Widget _placeholderImage() {
    return Container(
      color: AppColors.background,
      child: Center(
        child: Icon(
          Icons.image_outlined,
          size: 24,
          color: AppColors.border,
        ),
      ),
    );
  }
}
