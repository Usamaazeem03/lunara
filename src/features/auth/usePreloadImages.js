import { useEffect } from "react";

function usePreloadImages(sources) {
  useEffect(() => {
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sources]);
}

export default usePreloadImages;
