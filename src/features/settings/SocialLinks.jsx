import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import Icon from "../../Shared/ui/Icon";
import ButtonSpinner from "../../Shared/ui/ButtonSpinner";
import { normalizeSocialUrl, SOCIAL_LINK_TITLE_MAX_LENGTH } from "../../Shared/lib/socialLinks.js";
import { useSocialLinks } from "./useSocialLinks.js";

const EMPTY_LINK = { title: "", url: "" };

function SocialLinksForm({ links, save }) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState(null);
  const { register, handleSubmit, reset, setFocus, formState: { errors, isDirty, isValid } } = useForm({
    mode: "onChange",
    defaultValues: EMPTY_LINK,
  });

  function clearEditor() {
    setEditingIndex(null);
    reset(EMPTY_LINK);
  }

  function submitLink(values) {
    const link = { title: values.title.trim(), url: values.url.trim() };
    const next = editingIndex === null ? [...links, link] : links.map((current, index) => index === editingIndex ? link : current);
    save.mutate(next, { onSuccess: clearEditor });
  }

  function editLink(index) {
    setEditingIndex(index);
    reset(links[index]);
    setFocus("title");
  }

  function removeLink(index) {
    save.mutate(links.filter((_, position) => position !== index), {
      onSuccess: () => {
        if (editingIndex === index) clearEditor();
        else if (editingIndex !== null && index < editingIndex) setEditingIndex(editingIndex - 1);
      },
    });
  }

  return <>
    <form noValidate onSubmit={handleSubmit(submitLink)}>
      <fieldset disabled={save.isPending} className="grid min-w-0 gap-4">
        <label className="min-w-0" htmlFor="social-title">
          <span className="text-ink mb-2 block text-xs font-medium">{t("settings.socialLinks.linkTitle")}</span>
          <input {...register("title", { validate: value => Boolean(value.trim()) || t("settings.socialLinks.titleRequired"), maxLength: { value: SOCIAL_LINK_TITLE_MAX_LENGTH, message: t("settings.socialLinks.titleTooLong") } })}
            id="social-title" type="text" autoComplete="off" maxLength={SOCIAL_LINK_TITLE_MAX_LENGTH} placeholder={t("settings.socialLinks.titlePlaceholder")}
            aria-required="true" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "social-title-error" : undefined}
            className="border-ink/20 text-ink focus:border-ink min-h-11 w-full min-w-0 border-2 bg-white px-3 py-2 text-base outline-none disabled:opacity-50 sm:text-sm" />
          {errors.title && <span id="social-title-error" role="alert" className="text-danger mt-1 block text-xs">{errors.title.message}</span>}
        </label>
        <label className="min-w-0" htmlFor="social-url">
          <span className="text-ink mb-2 block text-xs font-medium">{t("settings.socialLinks.linkUrl")}</span>
          <input {...register("url", { validate: value => Boolean(normalizeSocialUrl(value)) || t("settings.socialLinks.invalidUrl") })}
            id="social-url" type="url" inputMode="url" autoCapitalize="none" spellCheck={false} autoComplete="off" placeholder="https://www.instagram.com/yoursalon" maxLength={2048}
            aria-required="true" aria-invalid={Boolean(errors.url)} aria-describedby={errors.url ? "social-url-error" : undefined}
            className="border-ink/20 text-ink focus:border-ink min-h-11 w-full min-w-0 border-2 bg-white px-3 py-2 text-base outline-none disabled:opacity-50 sm:text-sm" />
          {errors.url && <span id="social-url-error" role="alert" className="text-danger mt-1 block text-xs">{errors.url.message}</span>}
        </label>
      </fieldset>
      <p className="text-ink-muted mt-4 text-xs leading-relaxed">{t("settings.socialLinks.help")}</p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {(editingIndex !== null || isDirty) && <button type="button" disabled={save.isPending} onClick={clearEditor} className="border-ink/20 min-h-11 border-2 px-4 text-xs tracking-widest uppercase disabled:opacity-40">{t("common.cancel")}</button>}
        <button type="submit" disabled={!isDirty || !isValid || save.isPending} aria-busy={save.isPending} className="bg-ink text-cream min-h-11 px-4 text-xs tracking-widest uppercase disabled:opacity-40">
          {save.isPending ? <span className="inline-flex items-center gap-2"><ButtonSpinner />{t("common.saving")}</span> : t(editingIndex === null ? "settings.socialLinks.addLink" : "settings.socialLinks.updateLink")}
        </button>
      </div>
    </form>
    <div className="border-ink/10 mt-5 border-t pt-4" aria-live="polite">
      <h3 className="text-ink text-sm font-semibold">{t("settings.socialLinks.savedLinks")}</h3>
      {links.length === 0 ? <p className="text-ink-muted mt-2 text-xs leading-relaxed">{t("settings.socialLinks.empty")}</p> : <ul className="mt-3 space-y-3">
        {links.map((link, index) => <li key={`${index}-${link.title}`} data-social-link className="border-ink/15 flex min-w-0 flex-wrap items-center gap-3 border p-3">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="min-w-0 basis-40 flex-1"><strong className="text-ink block text-sm font-medium [overflow-wrap:anywhere]">{link.title}</strong><span className="text-ink-muted mt-1 block truncate text-xs">{link.url}</span></a>
          <div className="ml-auto flex shrink-0 gap-1">
            <button type="button" data-edit-link disabled={save.isPending} onClick={() => editLink(index)} aria-label={t("settings.socialLinks.editLabel", { title: link.title })} className="border-ink/20 text-ink flex min-h-11 min-w-11 items-center justify-center border disabled:opacity-40"><Icon name="edit-pencil" size={17} aria-hidden="true" /></button>
            <button type="button" data-remove-link disabled={save.isPending} onClick={() => removeLink(index)} aria-label={t("settings.socialLinks.removeLabel", { title: link.title })} className="border-ink/20 text-danger flex min-h-11 min-w-11 items-center justify-center border disabled:opacity-40"><Icon name="close-x" size={17} aria-hidden="true" /></button>
          </div>
        </li>)}
      </ul>}
    </div>
  </>;
}

export default function SocialLinks() {
  const { t } = useTranslation();
  const { data, ownerId, isPending, error, refetch, save } = useSocialLinks();
  return <section className="border-ink/20 min-w-0 border-2 bg-white p-4 sm:p-5">
    <div className="mb-5 flex items-start gap-3"><span className="border-ink/20 flex h-11 w-11 shrink-0 items-center justify-center border-2"><Icon name="globe" size={20} aria-hidden="true" /></span><div><h2 className="text-ink text-lg font-semibold">{t("settings.socialLinks.title")}</h2><p className="text-ink-muted mt-1 text-sm">{t("settings.socialLinks.description")}</p></div></div>
    {isPending ? <p role="status" className="text-ink-muted text-sm">{t("settings.socialLinks.loading")}</p> : error ? <div role="alert" className="text-danger text-sm"><p>{error.message}</p><button type="button" onClick={() => refetch()} className="mt-2 min-h-11 underline">{t("common.tryAgain")}</button></div> : <SocialLinksForm key={ownerId} links={data} save={save} />}
  </section>;
}
