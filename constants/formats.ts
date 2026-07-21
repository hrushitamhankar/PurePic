export interface SupportedFormat {
  extension: string;
  brand?: string;
  category: "raw" | "standard";
}

export const supportedFormats: SupportedFormat[] = [
  { extension: ".CR2", brand: "Canon", category: "raw" },
  { extension: ".CR3", brand: "Canon", category: "raw" },
  { extension: ".NEF", brand: "Nikon", category: "raw" },
  { extension: ".NRW", brand: "Nikon", category: "raw" },
  { extension: ".ARW", brand: "Sony", category: "raw" },
  { extension: ".SRW", brand: "Samsung", category: "raw" },
  { extension: ".RAF", brand: "Fujifilm", category: "raw" },
  { extension: ".ORF", brand: "Olympus", category: "raw" },
  { extension: ".RW2", brand: "Panasonic", category: "raw" },
  { extension: ".DNG", brand: "Universal", category: "raw" },
  { extension: ".PEF", brand: "Pentax", category: "raw" },
  { extension: ".X3F", brand: "Sigma", category: "raw" },
  { extension: ".JPEG", brand: undefined, category: "standard" },
  { extension: ".JPG", brand: undefined, category: "standard" },
  { extension: ".PNG", brand: undefined, category: "standard" },
  { extension: ".TIFF", brand: undefined, category: "standard" },
  { extension: ".WEBP", brand: undefined, category: "standard" },
  { extension: ".HEIC", brand: "Apple", category: "standard" },
];
