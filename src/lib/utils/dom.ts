export const toggleFullScreen = (elem?: HTMLElement): void => {
  if (typeof document === 'undefined') return;
  const target = elem || document.body;
  if (!document.fullscreenElement) {
    target.requestFullscreen?.().catch((err) => console.error("Fullscreen error:", err));
  } else {
    document.exitFullscreen?.().catch((err) => console.error("Exit fullscreen error:", err));
  }
};

export const toggleHideOverlays = (showOverlays: boolean): void => {
  if (typeof document === 'undefined') return;
  const hideElements = document.getElementsByClassName("overlay-can-hide");
  const fadeElements = document.getElementsByClassName("overlay-can-fade-out");

  const opacity = showOverlays ? "1" : "0";
  const fadeOpacity = showOverlays ? "1" : "0.1";

  Array.from(hideElements).forEach((el) => {
    (el as HTMLElement).style.opacity = opacity;
  });

  Array.from(fadeElements).forEach((el) => {
    (el as HTMLElement).style.opacity = fadeOpacity;
  });
};

export const loadScript = (src: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(false);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });