import { FALLBACK_IMAGES } from "@/lib/constants/images";

export const failedImageCache = new Set<string>();
const loadedHighResImages = new Set<string>();

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = FALLBACK_IMAGES.LANDMARK
) => {
  const target = e.currentTarget;
  const currentSrc = target.src;

  failedImageCache.add(currentSrc);

  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
};

export const getLowQualityImageSrc = (src: string): string => {
  if (!src) return "";
  
  // If it's already a low-quality image, return as is
  if (src.includes('-low.webp')) return src;
  
  // Convert to low-quality version
  return src.replace('.webp', '-low.webp');
};

export const getImageSrc = (
  src: string,
  fallbackSrc: string = FALLBACK_IMAGES.LANDMARK
): string => {
  if (failedImageCache.has(src)) {
    return fallbackSrc;
  }

  try {
    new URL(src);
    return src;
  } catch {
    if (src.startsWith("/")) {
      if (failedImageCache.has(src)) {
        return fallbackSrc;
      }
      return src;
    }
    return fallbackSrc;
  }
};

export const preloadImage = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => {
      failedImageCache.add(src);
      resolve(FALLBACK_IMAGES.LANDMARK);
    };
    img.src = src;
  });
};

export const preloadHighResImage = (lowQualitySrc: string, highQualitySrc: string): void => {
  // Skip if already loaded or if sources are the same
  if (loadedHighResImages.has(highQualitySrc) || lowQualitySrc === highQualitySrc) return;
  
  const img = new Image();
  img.onload = () => {
    loadedHighResImages.add(highQualitySrc);
  };
  img.src = highQualitySrc;
};
