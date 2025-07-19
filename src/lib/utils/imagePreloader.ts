/**
 * Utility for preloading images to improve performance
 */

import { mapsConfig } from "@/config/maps";

// Cache for preloaded images
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Preloads an image by creating a new Image object and setting its src
 * @param src The image source URL
 * @param priority Optional priority hint for the browser
 * @returns A promise that resolves when the image is loaded or errors
 */
export const preloadImage = (src: string, priority: 'high' | 'low' | 'auto' = 'auto'): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Check if image is already in cache
    if (imageCache.has(src)) {
      resolve();
      return;
    }

    const img = new window.Image();
    
    // Set fetchPriority if supported
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = priority;
    }
    
    // Set loading attributes for better performance
    img.loading = priority === 'high' ? 'eager' : 'lazy';
    img.decoding = 'async';
    
    img.onload = () => {
      // Store in cache
      imageCache.set(src, img);
      resolve();
    };
    
    img.onerror = () => {
      // Remove from cache on error
      imageCache.delete(src);
      resolve(); // Resolve even on error to prevent hanging
    };
    
    img.src = src;
  });
};

/**
 * Preloads all map images in the background with priority
 * @param currentMapId The ID of the currently displayed map (will be loaded with high priority)
 * @param onProgress Optional callback to track loading progress
 */
export const preloadAllMapImages = async (
  currentMapId?: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const totalMaps = mapsConfig.length;
  let loadedMaps = 0;

  // First preload the current map with high priority
  if (currentMapId) {
    const currentMap = mapsConfig.find(map => map.id === currentMapId);
    if (currentMap) {
      await preloadImage(currentMap.imagePath, 'high');
      loadedMaps++;
      onProgress?.(Math.round((loadedMaps / totalMaps) * 100));
    }
  }

  // Then preload other maps with low priority
  const otherMaps = mapsConfig.filter(map => map.id !== currentMapId);
  
  // Use requestIdleCallback for non-critical preloading if available
  const preloadOtherMaps = () => {
    const loadNextMap = async (index: number) => {
      if (index >= otherMaps.length) return;
      
      const map = otherMaps[index];
      await preloadImage(map.imagePath, 'low');
      loadedMaps++;
      onProgress?.(Math.round((loadedMaps / totalMaps) * 100));
      
      // Load next map after a small delay to prevent blocking
      setTimeout(() => loadNextMap(index + 1), 50);
    };
    
    loadNextMap(0);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadOtherMaps, { timeout: 2000 });
  } else {
    setTimeout(preloadOtherMaps, 1000);
  }
};

/**
 * Generates a blur placeholder for images
 * @param color The background color for the blur placeholder
 * @returns A base64 encoded blur placeholder
 */
export const generateBlurPlaceholder = (color: string = '#e5e7eb'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 10, 10);
  }
  
  return canvas.toDataURL();
};

/**
 * Preloads a set of images with progress tracking
 * @param images Array of image URLs to preload
 * @param onProgress Callback function to track loading progress
 * @returns A promise that resolves when all images are loaded
 */
export const preloadImagesWithProgress = async (
  images: string[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  let loaded = 0;
  const total = images.length;
  
  const loadNextImage = async (index: number) => {
    if (index >= images.length) return;
    
    const src = images[index];
    await preloadImage(src, index === 0 ? 'high' : 'low');
    loaded++;
    onProgress?.(Math.round((loaded / total) * 100));
    
    // Load next image after a small delay
    setTimeout(() => loadNextImage(index + 1), 50);
  };
  
  await loadNextImage(0);
};

/**
 * Clears the image cache to free up memory
 */
export const clearImageCache = () => {
  imageCache.clear();
};

/**
 * Gets a preloaded image from cache
 * @param src The image source URL
 * @returns The cached image element or undefined if not found
 */
export const getCachedImage = (src: string): HTMLImageElement | undefined => {
  return imageCache.get(src);
};