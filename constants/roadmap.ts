import type { RoadmapPhase } from "@/types/roadmap.types";

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 — Foundation",
    subtitle: "Core intelligence is live",
    items: [
      {
        id: "culling-engine",
        title: "AI Culling Engine",
        description:
          "Human-perception scoring pipeline with technical + aesthetic + moment analysis.",
        status: "completed",
        tags: ["Core", "AI"],
      },
      {
        id: "sorting-engine",
        title: "Intelligent Sorting Engine",
        description:
          "Genre-aware sorting into artistic_keep, good, ok, and reject categories.",
        status: "completed",
        tags: ["Core"],
      },
      {
        id: "raw-support",
        title: "RAW File Support",
        description:
          "Embedded JPEG preview extraction for CR2, NEF, ARW, DNG with full quality perception.",
        status: "completed",
        tags: ["Core", "Format"],
      },
      {
        id: "parallel",
        title: "Parallel Batch Processing",
        description: "Multi-core analysis for high-volume folders.",
        status: "completed",
        tags: ["Performance"],
      },
      {
        id: "aesthetic-model",
        title: "Aesthetic Deep Learning Model",
        description:
          "Trained ONNX/TFLite model for composition and aesthetic scoring.",
        status: "completed",
        tags: ["AI", "Model"],
      },
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 — Editing Intelligence",
    subtitle: "Editing engine under active development",
    items: [
      {
        id: "editing-engine",
        title: "AI Editing Engine",
        description:
          "Context-aware editing decisions driven by image content analysis.",
        status: "in-progress",
        eta: "Q3 2025",
        tags: ["Editing", "AI"],
      },
      {
        id: "semantic-regions",
        title: "Semantic Region Detection",
        description:
          "Identify and isolate sky, skin, subject, background for targeted editing.",
        status: "in-progress",
        eta: "Q3 2025",
        tags: ["AI", "Segmentation"],
      },
      {
        id: "recipe-export",
        title: "Lightroom Recipe Export",
        description:
          "Export editing decisions as Lightroom-compatible XMP presets.",
        status: "in-progress",
        eta: "Q4 2025",
        tags: ["Export", "Integration"],
      },
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3 — Subject Intelligence",
    subtitle: "Object-aware editing and universal masking",
    items: [
      {
        id: "object-detection",
        title: "Object Detection Engine",
        description:
          "Detect and classify subjects — people, animals, vehicles — for object-aware editing.",
        status: "planned",
        eta: "Q1 2026",
        tags: ["AI", "Detection"],
      },
      {
        id: "universal-masking",
        title: "Universal Masking",
        description:
          "One-click intelligent masks for any subject with edge-precise boundaries.",
        status: "planned",
        eta: "Q1 2026",
        tags: ["Masking", "AI"],
      },
      {
        id: "subject-intelligence",
        title: "Subject Intelligence Layer",
        description:
          "Understand subject context — emotion, pose, action — for intelligent editing decisions.",
        status: "planned",
        eta: "Q2 2026",
        tags: ["AI", "Analysis"],
      },
    ],
  },
  {
    id: "phase-4",
    title: "Phase 4 — Platform & Cloud",
    subtitle: "Collaboration, cloud, and ecosystem",
    items: [
      {
        id: "render-router",
        title: "Adaptive Render Router",
        description:
          "Intelligently route rendering tasks based on image content and output intent.",
        status: "future",
        tags: ["Performance", "AI"],
      },
      {
        id: "cloud-sync",
        title: "Cloud Synchronization",
        description:
          "Cross-device project sync, settings, and export history.",
        status: "future",
        tags: ["Cloud", "Platform"],
      },
      {
        id: "collaboration",
        title: "Team Collaboration",
        description:
          "Shared projects, commenting, version history, and role-based access for studios.",
        status: "future",
        tags: ["Cloud", "Team"],
      },
      {
        id: "ai-assistant",
        title: "AI Photography Assistant",
        description:
          "Conversational interface for editing guidance, image explanation, and workflow automation.",
        status: "future",
        tags: ["AI", "Assistant"],
      },
      {
        id: "style-transfer",
        title: "AI Style Transfer",
        description:
          "Content-aware cinematic and editorial style application.",
        status: "future",
        tags: ["AI", "Editing"],
      },
    ],
  },
];
