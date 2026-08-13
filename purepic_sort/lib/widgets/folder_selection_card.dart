import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class FolderSelectionCard extends StatefulWidget {
  const FolderSelectionCard({
    super.key,
    required this.label,
    required this.path,
    required this.onBrowse,
    this.icon = Icons.folder_outlined,
  });

  final String label;
  final String path;
  final VoidCallback onBrowse;
  final IconData icon;

  @override
  State<FolderSelectionCard> createState() => _FolderSelectionCardState();
}

class _FolderSelectionCardState extends State<FolderSelectionCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final hasPath = widget.path.isNotEmpty;

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          color: _hovered ? AppColors.panel : AppColors.surface,
          border: Border.all(
            color: _hovered ? AppColors.secondaryText : AppColors.border,
            width: 1,
          ),
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
        child: Row(
          children: [
            // Icon
            Icon(
              widget.icon,
              size: 18,
              color: hasPath
                  ? AppColors.primaryText
                  : AppColors.secondaryText,
            ),
            const SizedBox(width: AppSpacing.md),

            // Label + path
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.label,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 1.2,
                      color: AppColors.secondaryText,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    hasPath ? widget.path : 'No folder selected',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: hasPath
                          ? AppColors.primaryText
                          : AppColors.secondaryText.withAlpha(120),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            const SizedBox(width: AppSpacing.md),

            // Browse button
            _BrowseButton(onPressed: widget.onBrowse),
          ],
        ),
      ),
    );
  }
}

class _BrowseButton extends StatefulWidget {
  const _BrowseButton({required this.onPressed});
  final VoidCallback onPressed;

  @override
  State<_BrowseButton> createState() => _BrowseButtonState();
}

class _BrowseButtonState extends State<_BrowseButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            color: _hovered
                ? AppColors.primaryText.withAlpha(20)
                : Colors.transparent,
            border: Border.all(color: AppColors.border, width: 1),
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
          child: Text(
            'Browse',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.primaryText,
              letterSpacing: 0.4,
            ),
          ),
        ),
      ),
    );
  }
}
