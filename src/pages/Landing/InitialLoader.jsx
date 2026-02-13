import { useEffect, useState } from "react";

function InitialLoader() {
  const [progress, setProgress] = useState(0);
  // const [done, setDone] = useState(false);

  useEffect(function () {
    const intervel = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 50);

    // const handleLoad = () => {
    //   clearInterval(intervel);
    //   setProgress(100);

    //   setTimeout(() => {
    //     setDone(true);
    //   }, 800);
    // };
    // if (document.readyState === "complete") {
    //   handleLoad();
    // } else {
    //   window.addEventListener("load", handleLoad);
    // }

    return () => {
      clearInterval(intervel);
      // window.removeEventListener("load", handleLoad);
    };
  }, []);
  // if (done) return null;
  if (progress >= 100) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full">
      {/* Percentage */}
      <span className="text-6xl initialLoader absolute right-4 bottom-6 ">
        {progress}%
      </span>

      {/* Progress Bar */}
      <div
        className="h-4 bg-black transition-all duration-200"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default InitialLoader;
