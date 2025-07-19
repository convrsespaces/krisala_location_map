    const STORAGE_KEY = "animatedMaps";

    export function isMapAnimated(mapId: string): boolean {
    if (typeof window === "undefined") return false;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    try {
        const arr = JSON.parse(stored);
        return Array.isArray(arr) && arr.includes(mapId);
    } catch {
        return false;
    }
    }

    export function markMapAsAnimated(mapId: string) {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    let arr: string[] = [];
    try {
        arr = stored ? JSON.parse(stored) : [];
    } catch {}
    if (!arr.includes(mapId)) arr.push(mapId);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }