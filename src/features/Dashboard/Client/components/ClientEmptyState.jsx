import { Link } from "react-router-dom";
import Icon from "../../../../Shared/ui/Icon.jsx";

export default function ClientEmptyState({ icon = "calendar", title, description, to, actionLabel }) {
  return <div className="rounded-2xl border border-dashed border-ink/20 bg-white/60 p-6 text-center sm:p-8"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-ink/70"><Icon name={icon} size={24} aria-hidden="true"/></span><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">{description}</p>{to && <Link to={to} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 text-sm font-semibold text-cream">{actionLabel}</Link>}</div>;
}
