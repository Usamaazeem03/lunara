function WorkflowStepCard({ index, title, description }) {
  return (
    <div className="border border-black/20 bg-white/70 p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-black text-sm font-semibold text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        {title && <h3 className="text-xl font-semibold tracking-wide">{title}</h3>}
      </div>
      {description && <p className="mt-4 text-sm text-black/70">{description}</p>}
    </div>
  );
}

function WorkflowStepsSection({ steps }) {
  const data = steps ?? [];

  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-[#ede2d3] px-6 py-16 md:px-12 lg:px-20"
    >
      <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.4em] text-black/50">
          How it works
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
          A smooth flow for teams and clients.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.map((step, index) => {
            const title = step.title || step.label || "";
            const description = step.text || step.description || step.subtitle || "";
            const key = step.id || title || index;

            return (
              <WorkflowStepCard
                key={key}
                index={index}
                title={title}
                description={description}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WorkflowStepsSection;
