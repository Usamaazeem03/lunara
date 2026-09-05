function Spinner() {
  return (
    <>
      <style>{`
        @keyframes morph-spin {
          0% {
            border-radius: 50%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 50%;
            transform: rotate(90deg) scale(0.85);
          }
          50% {
            border-radius: 12%;
            transform: rotate(180deg) scale(1);
          }
          75% {
            border-radius: 12%;
            transform: rotate(270deg) scale(0.85);
          }
          100% {
            border-radius: 50%;
            transform: rotate(360deg) scale(1);
          }
        }
        .morph-spinner {
          animation: morph-spin 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
      <div className="text-center">
        <div className="border-ink morph-spinner mx-auto h-12 w-12 border-2" />
      </div>
    </>
  );
}

export default Spinner;
