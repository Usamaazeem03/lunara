export default function ClientPageHeader({ eyebrow, title, description, children }) {
  return <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-ink-muted mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">{eyebrow}</p><h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>{description && <p className="text-ink-muted mt-2 max-w-xl text-sm leading-6">{description}</p>}</div>{children && <div className="shrink-0">{children}</div>}</header>;
}
