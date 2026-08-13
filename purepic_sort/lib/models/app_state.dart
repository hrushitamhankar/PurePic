import 'package:flutter/foundation.dart';

enum AppScreen { welcome, preparing, liveSorting, results }

enum SortCategory { artisticKeep, good, ok, reject }

extension SortCategoryLabel on SortCategory {
  String get label {
    switch (this) {
      case SortCategory.artisticKeep:
        return 'Artistic Keep';
      case SortCategory.good:
        return 'Good';
      case SortCategory.ok:
        return 'OK';
      case SortCategory.reject:
        return 'Reject';
    }
  }
}

@immutable
class SortedImage {
  const SortedImage({
    required this.path,
    required this.filename,
    required this.category,
    required this.confidence,
  });

  final String path;
  final String filename;
  final SortCategory category;
  final double confidence; // 0.0 – 1.0
}

@immutable
class SortingProgress {
  const SortingProgress({
    required this.processed,
    required this.total,
    required this.etaSeconds,
    required this.speedPerSecond,
    required this.currentImage,
    required this.currentFilename,
    required this.currentConfidence,
    required this.currentCategory,
    required this.artisticKeepCount,
    required this.goodCount,
    required this.okCount,
    required this.rejectCount,
    this.isComplete = false,
    this.hasError = false,
    this.errorMessage = '',
  });

  final int processed;
  final int total;
  final int etaSeconds;
  final double speedPerSecond;
  final String currentImage;
  final String currentFilename;
  final double currentConfidence;
  final SortCategory currentCategory;
  final int artisticKeepCount;
  final int goodCount;
  final int okCount;
  final int rejectCount;
  final bool isComplete;
  final bool hasError;
  final String errorMessage;

  double get progressFraction =>
      total > 0 ? processed / total : 0.0;

  String get etaFormatted {
    if (etaSeconds <= 0) return '0s';
    final m = etaSeconds ~/ 60;
    final s = etaSeconds % 60;
    if (m > 0) return '${m}m ${s.toString().padLeft(2, '0')}s';
    return '${s}s';
  }
}

@immutable
class SortingResult {
  const SortingResult({
    required this.totalImages,
    required this.processingTimeSeconds,
    required this.artisticKeepImages,
    required this.goodImages,
    required this.okImages,
    required this.rejectImages,
    this.artisticKeepTotal = 0,
    this.goodTotal = 0,
    this.okTotal = 0,
    this.rejectTotal = 0,
  });

  final int totalImages;
  final int processingTimeSeconds;
  final List<SortedImage> artisticKeepImages;
  final List<SortedImage> goodImages;
  final List<SortedImage> okImages;
  final List<SortedImage> rejectImages;
  // Real counts from backend
  final int artisticKeepTotal;
  final int goodTotal;
  final int okTotal;
  final int rejectTotal;

  String get processingTimeFormatted {
    final m = processingTimeSeconds ~/ 60;
    final s = processingTimeSeconds % 60;
    if (m > 0) return '${m}m ${s}s';
    return '${s}s';
  }
}
