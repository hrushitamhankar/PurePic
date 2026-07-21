export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FAQItem[] = [
  {
    category: "General",
    question: "What is PurePic?",
    answer:
      "PurePic is an AI-powered desktop application that analyzes and intelligently sorts your photographs before you start editing. It evaluates each image on technical quality, aesthetic composition, subject presence, and emotional moment — the way a professional editor would.",
  },
  {
    category: "General",
    question: "How is PurePic different from other photo tools?",
    answer:
      "Most tools compare images within a folder to find the 'best'. PurePic judges each image independently using a multi-dimensional scoring system trained on professional editorial standards. It understands photography genres, forgives intentional artistic choices, and explains its decisions.",
  },
  {
    category: "General",
    question: "Does PurePic upload my photos to the cloud?",
    answer:
      "No. PurePic runs 100% offline on your machine. All AI models run locally. Your images never leave your computer. Privacy is a core principle of PurePic.",
  },
  {
    category: "Technical",
    question: "What file formats does PurePic support?",
    answer:
      "PurePic supports JPEG, PNG, and all major RAW formats including CR2 (Canon), NEF (Nikon), ARW (Sony), and DNG (Universal). RAW files are processed using embedded JPEG preview extraction for full-quality perception at 10× the speed of full RAW decoding.",
  },
  {
    category: "Technical",
    question: "What are the system requirements?",
    answer:
      "Minimum: Windows 10 / macOS 11 / Ubuntu 20.04, 8GB RAM, 4-core CPU. Recommended: 16GB RAM, 8-core CPU, NVIDIA GPU for accelerated AI inference. A GPU is not required but significantly improves performance on large batches.",
  },
  {
    category: "Technical",
    question: "How fast is PurePic?",
    answer:
      "On a modern 8-core CPU, PurePic processes 100–500 images in a matter of minutes using parallel multi-core analysis. GPU acceleration can reduce this further. Processing time depends on image resolution and enabled analysis modules.",
  },
  {
    category: "Features",
    question: "What AI models does PurePic use?",
    answer:
      "PurePic uses custom-trained ONNX and TFLite models for aesthetic scoring, alongside classical computer vision algorithms for technical quality analysis. The aesthetic model was trained on curated professional photography datasets.",
  },
  {
    category: "Features",
    question: "What categories does PurePic sort images into?",
    answer:
      "PurePic sorts into four primary categories: artistic_keep (strong editorial/portfolio shots), good (deliverable images), ok (backup/secondary selections), and reject (technically or visually weak images). The free tier includes basic sorting; Pro includes extended categories.",
  },
  {
    category: "Pricing",
    question: "Is there a free version?",
    answer:
      "Yes. The Free tier allows up to 500 images per month with AI culling and technical analysis. No credit card required. Pro and Studio plans unlock unlimited processing, aesthetic analysis, batch processing, Lightroom export, and cloud sync.",
  },
  {
    category: "Pricing",
    question: "Can I try Pro before buying?",
    answer:
      "Yes. Pro and Studio plans include a 14-day free trial with no credit card required. You can experience the full feature set before committing.",
  },
];
