import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_state.dart';
import '../theme/app_theme.dart';

class ResultCategory extends StatelessWidget {
  const ResultCategory({
    super.key,
    required this.category,
    required this.images,
    required this.totalCount,
    required this.accentColor,
  });

  final SortCategory category;
  final List<SortedImage> images;
  final int totalCount;
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    final best = images.isNotEmpty ? images.first : null;
    final pct = best != null
        ? '${(best.confidence * 100).toStringAsFixed(0)}%'
        : null;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border, width: 1),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      clipBehavior: Clip.antiAlias,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Accent sidebar ───────────────────────────────────────────
            Container(width: 3, color: accentColor),

            // ── Square image (120×120) ───────────────────────────────────
            SizedBox(
              width: 120,
              height: 120,
              child: best != null
                  ? _BestImage(image: best)
                  : _NoImage(),
            ),

            // ── Separator ────────────────────────────────────────────────
            Container(width: 1, color: AppColors.border),

            // ── Info block ───────────────────────────────────────────────
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Top: label + count
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          category.label.toUpperCase(),
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.8,
                            color: accentColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              '$totalCount',
                              style: GoogleFonts.inter(
                                fontSize: 28,
                                fontWeight: FontWeight.w200,
                                color: AppColors.primaryText,
                                letterSpacing: -1,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Text(
                              'images',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppColors.secondaryText,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Bottom: filename + confidence
                    if (best != null)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            best.filename,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              color: AppColors.secondaryText,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 5),
                          Row(
                            children: [
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(1),
                                  child: LinearProgressIndicator(
                                    value: best.confidence.clamp(0.0, 1.0),
                                    minHeight: 2,
                                    backgroundColor: AppColors.border,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                        accentColor),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                pct!,
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: accentColor,
                                ),
                              ),
                            ],
                          ),
                        ],
                      )
                    else
                      Text(
                        'No images',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          color: AppColors.secondaryText.withAlpha(60),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Best image ───────────────────────────────────────────────────────────────

class _BestImage extends StatefulWidget {
  const _BestImage({required this.image});
  final SortedImage image;

  @override
  State<_BestImage> createState() => _BestImageState();
}

class _BestImageState extends State<_BestImage> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Stack(
        fit: StackFit.expand,
        children: [
          _buildImage(),
          AnimatedOpacity(
            duration: const Duration(milliseconds: 150),
            opacity: _hovered ? 1.0 : 0.0,
            child: Container(
              color: Colors.black.withAlpha(80),
              child: const Center(
                child: Icon(Icons.zoom_in_rounded,
                    color: Colors.white, size: 20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImage() {
    if (widget.image.path.isNotEmpty) {
      final file = File(widget.image.path);
      if (file.existsSync()) {
        return Image.file(file, fit: BoxFit.cover,
            errorBuilder: (ctx, err, stack) => _placeholder());
      }
    }
    return _placeholder();
  }

  Widget _placeholder() => Container(
        color: AppColors.background,
        child: const Center(
          child: Icon(Icons.image_outlined, size: 24, color: AppColors.border),
        ),
      );
}

// ─── No image ─────────────────────────────────────────────────────────────────

class _NoImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
        color: AppColors.background,
        child: Center(
          child: Icon(Icons.hide_image_outlined,
              size: 22, color: AppColors.border.withAlpha(120)),
        ),
      );
}
