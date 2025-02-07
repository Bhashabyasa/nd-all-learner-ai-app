import { useState, useEffect } from "react";

const usePreloadAudio = (audioUrl) => {
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
        const audioObjectUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioObjectUrl);
      } catch (error) {
        console.error("Error preloading audio:", error);
      }
    };

    preloadAudio();

    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioUrl]);

  return audioSrc;
};
export default usePreloadAudio;
