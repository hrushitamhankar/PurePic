export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "in-development";
  detail?: string;
}

export const coreFeatures: Feature[] = [
  {
    id: "culling",
    icon: "Layers",
    title: "AI Image Culling",
    description:
      "Automatically sort thousands of images by quality, composition, and emotional impact. Eliminate rejects without touching a single slider.",
    status: "available",
    detail:
      "PurePic evaluates each image independently using a multi-dimensional scoring pipeline: technical quality, aesthetic composition, subject presence, moment strength, and eye focus. No comparisons within folders. Every image judged on its own merit.",
  },
  {
    id: "sorting",
    icon: "SortAsc",
    title: "Intelligent Sorting",
    description:
      "Genre-aware intelligent categorization. Wildlife, wedding, portrait, street — PurePic adapts its criteria to the shooting context automatically.",
    status: "available",
  },
  {
    id: "technical",
    icon: "Microscope",
    title: "Technical Quality Analysis",
    description:
      "Deep analysis of sharpness, exposure, noise, chromatic aberration, and focus accuracy across the entire frame.",
    status: "available",
  },
  {
    id: "aesthetic",
    icon: "Palette",
    title: "Aesthetic Analysis",
    description:
      "A trained deep learning model evaluates composition, color harmony, tonal balance, and visual storytelling — the way a human editor would.",
    status: "available",
  },
  {
    id: "editing",
    icon: "Sliders",
    title: "AI Editing Engine",
    description:
      "Context-aware editing decisions based on what's actually in the image. Not generic presets — intelligent adjustments.",
    status: "in-development",
  },
  {
    id: "semantic",
    icon: "Scan",
    title: "Semantic Region Detection",
    description:
      "PurePic identifies what's in the image — subject, background, sky, skin, foliage — and applies targeted editing to each region independently.",
    status: "in-development",
  },
  {
    id: "masking",
    icon: "Wand2",
    title: "Universal Masking",
    description:
      "One-click intelligent masks for subjects, backgrounds, skies, and custom regions. Object-aware, edge-precise.",
    status: "coming-soon",
  },
  {
    id: "batch",
    icon: "Zap",
    title: "Batch Processing",
    description:
      "Process hundreds of images simultaneously using multi-core parallel analysis. Designed for volume — weddings, events, studios.",
    status: "available",
  },
  {
    id: "recipe",
    icon: "FileOutput",
    title: "Lightroom Recipe Export",
    description:
      "Export PurePic's editing decisions as Lightroom-compatible presets. Bring AI intelligence into your existing workflow.",
    status: "in-development",
  },
  {
    id: "style",
    icon: "Sparkles",
    title: "AI Style Transfer",
    description:
      "Apply cinematic and editorial styles intelligently — style is applied with awareness of the image content, not blindly.",
    status: "coming-soon",
  },
  {
    id: "cloud",
    icon: "Cloud",
    title: "Cloud Synchronization",
    description:
      "Sync your projects, settings, and exports across devices. Access from anywhere without re-processing.",
    status: "coming-soon",
  },
  {
    id: "assistant",
    icon: "MessageSquare",
    title: "AI Photography Assistant",
    description:
      "Ask PurePic about your images. Get explanations, editing suggestions, and insights through a conversational interface.",
    status: "coming-soon",
  },
];
