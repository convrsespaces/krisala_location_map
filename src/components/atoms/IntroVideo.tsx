"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Loading from "./Loading";

interface IntroVideoProps {
  onFinish: () => void;
  src: string;
  fallbackImageUrl?: string;
}

const IntroVideo: React.FC<IntroVideoProps> = ({
  onFinish,
  src,
  // fallbackImageUrl = "/brand.webp",
  fallbackImageUrl = "/logo.png",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video play
  const playVideo = useCallback(() => {
    if (!videoRef.current) return;

    const playPromise = videoRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Video started playing successfully
          console.log("Video playing");
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          setError(true);
          setLoading(false);
        });
    }
  }, []);

  // Handle video ready to play
  const handleCanPlayThrough = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  // Handle video ended
  const handleEnded = useCallback(() => {
    onFinish();
  }, [onFinish]);

  // Handle video error
  const handleError = useCallback(() => {
    console.error("Video failed to load");
    setError(true);
    setLoading(false);
  }, []);

  // Handle skip button
  const handleSkip = useCallback(() => {
    onFinish();
  }, [onFinish]);

  // Auto-play video when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      playVideo();
    }, 100);

    return () => clearTimeout(timer);
  }, [playVideo]);

  // If there's an error, show fallback
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white">
          <img
            src={fallbackImageUrl}
            alt="Brand Logo"
            className="w-32 h-16 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold mb-2">Welcome</h2>
          <p className="text-gray-300 mb-6">Loading your experience...</p>
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-[#ECB92D] text-black rounded-lg hover:bg-[#d5ad52] transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading Component */}
      {loading && <Loading />}

      {/* Video Container */}
      <div className="fixed inset-0 z-50">
        <button
          onClick={handleSkip}
          className="absolute bottom-6 right-8 z-60 px-5 py-2 bg-[#ffffff]/10 text-white rounded-lg shadow hover:bg-[#d5ad52]/80 transition-colors font-medium cursor-pointer"
          style={{ minWidth: 80 }}
          aria-label="Skip Intro"
        >
          Skip
        </button>
        <video
          ref={videoRef}
          className="object-cover w-screen h-screen fixed top-0 left-0"
          muted
          preload="auto"
          playsInline
          onCanPlayThrough={handleCanPlayThrough}
          onEnded={handleEnded}
          onError={handleError}
        >
          <source src={src} type="video/mp4" />
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default IntroVideo;