const InfoCard = ({
  children,
  label,
  title,
  meta,
  rightContent,
  bg = "bg-cream",
  padding = "px-4 py-2",
  className = "",
  contentClassName,
  layout = "stacked", // "stacked" | "inline" | "loyalty"
  progress,
  progressLeft,
  progressRight,
}) => {
  const hasStructuredContent =
    label ||
    title ||
    meta ||
    rightContent ||
    typeof progress === "number" ||
    progressLeft ||
    progressRight;
  const isInline = layout === "inline";
  const isLoyalty = layout === "loyalty";
  const contentLayout =
    contentClassName ??
    (isInline
      ? "flex flex-wrap items-center gap-3"
      : "flex flex-wrap items-center justify-between gap-3");

  return (
    <div
      className={`mt-3 border-2 border-ink/20 ${bg} ${padding} ${className}`}
    >
      {hasStructuredContent ? (
        isLoyalty ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {label && (
                  <p className="text-xs uppercase tracking-widest text-ink-muted">
                    {label}
                  </p>
                )}
                {title && (
                  <p className="mt-2 text-2xl font-semibold">{title}</p>
                )}
                {meta && <p className="text-xs text-ink-muted">{meta}</p>}
              </div>
              {rightContent && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink/20 bg-cream">
                  {rightContent}
                </div>
              )}
            </div>
            {typeof progress === "number" && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden border-2 border-ink bg-white/70">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {(progressLeft || progressRight) && (
                  <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-widest text-ink-muted">
                    {progressLeft && <span>{progressLeft}</span>}
                    {progressRight && <span>{progressRight}</span>}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={contentLayout}>
            {isInline ? (
              <>
                {label && (
                  <span className="text-[0.65rem] uppercase tracking-widest text-ink-muted">
                    {label}
                  </span>
                )}
                {title && (
                  <span className="text-sm font-semibold">{title}</span>
                )}
                {meta && <span className="text-xs text-ink-muted">{meta}</span>}
              </>
            ) : (
              <div>
                {label && (
                  <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted">
                    {label}
                  </p>
                )}
                {title && <p className="mt-1 text-sm font-semibold">{title}</p>}
                {meta && <p className="mt-1 text-xs text-ink-muted">{meta}</p>}
              </div>
            )}
            {rightContent}
          </div>
        )
      ) : (
        children
      )}
    </div>
  );
};

export default InfoCard;

{
  /* <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-2 border-[#2d2620] bg-[#f3efe9] px-4 py-2">
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest text-[#5f544b]">
            Booking Progress
          </p>
          <p className="text-sm font-semibold">
            Step {step} of {steps.length} - {activeMeta.title}
          </p>
        </div>

        <div className="w-full sm:w-52">
          <div className="h-2 w-full overflow-hidden border-2 border-[#2d2620] bg-white/60">
            <div
              className="h-full bg-[#2d2620]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[0.65rem] uppercase tracking-widest text-[#5f544b]">
            {progress}% complete
          </p>
        </div>
      </div> */
}
