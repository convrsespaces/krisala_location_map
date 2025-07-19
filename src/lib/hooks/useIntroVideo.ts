import { useState, useEffect, useCallback } from "react";

interface UseIntroVideoProps {
    videoUrl: string;
    enableIntro?: boolean;
}

interface UseIntroVideoReturn {
    showIntroVideo: boolean;
    hasVideoCompleted: boolean;
    handleVideoComplete: () => void;
}

/** Custom hook to manage intro video state */

export function useIntroVideo ({
    videoUrl,
    enableIntro = true,
}: UseIntroVideoProps) : UseIntroVideoReturn {
    const [showIntroVideo, setShowIntroVideo] = useState(enableIntro);
    const [hasVideoCompleted, setHasVideoCompleted] = useState(false);

    // Handle video completion
    const handleVideoComplete = useCallback(() => {
        setShowIntroVideo(false);
        setHasVideoCompleted(true);
    }, []);

    // If intro is disabled, mark as completed immediately

    useEffect (() => {
        if(!enableIntro) {
            setShowIntroVideo(false);
            setHasVideoCompleted(true);
        }
    }, [enableIntro]);

    return {
        showIntroVideo,
        hasVideoCompleted,
        handleVideoComplete,
    };
}

export default useIntroVideo