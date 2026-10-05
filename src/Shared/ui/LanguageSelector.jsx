import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", name: "English", labelKey: "common.english" },
  { code: "tr", name: "Türkçe", labelKey: "common.turkish" },
];

// Inline flags render consistently on Windows as well as mobile devices.
function LanguageFlag({ code, rounded }) {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true" className={`h-7 w-10 shrink-0 overflow-hidden ${rounded ? "rounded-md shadow-sm" : "rounded-none"}`}>
      {code === "tr" ? <>
        <path fill="#e30a17" d="M0 0h60v40H0z" />
        <circle cx="25" cy="20" r="10" fill="white" />
        <circle cx="28" cy="20" r="8" fill="#e30a17" />
        <path fill="white" d="m36 14 1.5 4.2 4.5.1-3.6 2.7 1.3 4.3-3.7-2.5-3.7 2.5 1.3-4.3-3.6-2.7 4.5-.1Z" />
      </> : <>
        <path fill="#253b80" d="M0 0h60v40H0z" />
        <path stroke="white" strokeWidth="9" d="m0 0 60 40M60 0 0 40" />
        <path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40" />
        <path stroke="white" strokeWidth="13" d="M30 0v40M0 20h60" />
        <path stroke="#c8102e" strokeWidth="7" d="M30 0v40M0 20h60" />
      </>}
    </svg>
  );
}

export default function LanguageSelector({ variant = "owner" }) {
  const { t, i18n } = useTranslation();
  const isClient = variant === "client";
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const menu = useRef(null);
  const id = useId();
  const current = LANGUAGES.find(language => language.code === i18n.resolvedLanguage) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector('[aria-checked="true"]')?.focus();
    const closeOutside = event => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const close = () => { setOpen(false); trigger.current?.focus(); };
  const onMenuKeyDown = event => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const options = [...menu.current.querySelectorAll('[role="menuitemradio"]')];
    const index = options.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 :
      (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options[next]?.focus();
  };

  return (
    <section className={isClient
      ? "rounded-2xl border border-ink/10 bg-white/80 p-5 sm:p-6"
      : "rounded-none border-2 border-ink/20 bg-white/90 p-4 sm:p-5"}>
      <div className="mb-5 flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center bg-cream text-ink ${isClient ? "rounded-xl" : "rounded-none border-2 border-ink/20"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" />
          </svg>
        </span>
        <div><h2 id={`${id}-label`} className="text-lg font-semibold">{t("common.language")}</h2>
          <p id={`${id}-description`} className="mt-1 text-sm leading-6 text-ink-muted">{t("settings.languageDescription")}</p></div>
      </div>
      <div ref={container} className="relative" onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <button ref={trigger} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={`${id}-menu`}
          aria-labelledby={`${id}-label ${id}-value`} aria-describedby={`${id}-description`}
          onClick={() => setOpen(value => !value)}
          onKeyDown={event => { if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); setOpen(true); } }}
          className={`flex min-h-16 w-full items-center gap-3 bg-white px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/10 ${isClient ? "rounded-xl border" : "rounded-none border-2"} ${open ? "border-ink/40 ring-4 ring-ink/5" : "border-ink/20 hover:border-ink/30 hover:bg-cream/30"}`}>
          <LanguageFlag code={current.code} rounded={isClient} />
          <span id={`${id}-value`} className="flex-1 text-sm font-semibold" lang={current.code}>{current.name}</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">{current.code}</span>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`h-4 w-4 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}><path d="m5 7.5 5 5 5-5" /></svg>
        </button>
        {open && <div ref={menu} id={`${id}-menu`} role="menu" aria-labelledby={`${id}-label`} onKeyDown={onMenuKeyDown}
          className={`absolute inset-x-0 top-full z-30 mt-2 bg-white p-1.5 shadow-[0_12px_36px_rgba(45,38,32,0.12)] ${isClient ? "rounded-xl border border-ink/10" : "rounded-none border-2 border-ink/20"}`}>
          {LANGUAGES.map(language => <button key={language.code} type="button" role="menuitemradio" aria-checked={current.code === language.code} tabIndex={-1}
            onClick={async () => { await i18n.changeLanguage(language.code); close(); }}
            className={`flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-cream focus:bg-cream focus:outline-none ${isClient ? "rounded-lg" : "rounded-none"} ${current.code === language.code ? "bg-cream/70" : ""}`}>
            <LanguageFlag code={language.code} rounded={isClient} />
            <span className="flex-1"><span className="block text-sm font-semibold" lang={language.code}>{language.name}</span>
              <span className="text-xs text-ink-muted">{t(language.labelKey)}</span></span>
            {current.code === language.code && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5"><path d="m4 10 4 4 8-8" /></svg>}
          </button>)}
        </div>}
      </div>
      <p className="mt-3 text-xs leading-5 text-ink-muted">{t("settings.languageSavedAutomatically")}</p>
    </section>
  );
}
