import { useEffect, useState } from "react";
import Icon from "../../Shared/ui/Icon";

import { useExternalWebsite } from "./useExternalWebsite";
import { useUpdateExternalWebsite } from "./useUpdateExternalWebsite";

function AddWebsite() {
  const { externalWebsiteUrl, isLoading, error } = useExternalWebsite();

  const { mutate: updateWebsite, isPending: isUpdating } =
    useUpdateExternalWebsite();

  const [websiteUrl, setWebsiteUrl] = useState("");

  // Put database value into the input after loading
  useEffect(() => {
    if (!isLoading) {
      setWebsiteUrl(externalWebsiteUrl ?? "");
    }
  }, [externalWebsiteUrl, isLoading]);

  const savedWebsiteUrl = externalWebsiteUrl ?? "";
  const hasChanges = websiteUrl.trim() !== savedWebsiteUrl;

  function handleSave() {
    if (!hasChanges || isUpdating) return;

    updateWebsite({
      websiteUrl: websiteUrl.trim(),
    });
  }

  return (
    <section className="border-ink/20 border-2 bg-white p-5">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="border-ink/20 flex h-11 w-11 shrink-0 items-center justify-center border-2">
          <Icon name="globe" size={20} />
        </div>

        <div>
          <h2 className="text-ink text-lg font-semibold">External Website</h2>

          <p className="text-ink-muted mt-1 text-sm">
            Connect your own salon website to Lunara.
          </p>
        </div>
      </div>

      {/* Website URL */}
      <div>
        <label
          htmlFor="externalWebsiteUrl"
          className="text-ink-muted text-xs tracking-widest uppercase"
        >
          Website URL
        </label>

        <input
          id="externalWebsiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://www.yoursalon.com"
          disabled={isLoading || isUpdating}
          className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-3 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p className="text-ink-muted mt-2 text-xs leading-relaxed">
          Leave this empty to use your Lunara public salon page.
        </p>

        {error && (
          <p className="mt-2 text-xs text-red-600">
            Unable to load your website settings.
          </p>
        )}
      </div>

      {/* Explanation */}
      <div className="border-ink/15 bg-cream/40 mt-5 border p-4">
        <p className="text-ink text-sm font-medium">
          Your salon link stays the same
        </p>

        <p className="text-ink-muted mt-1 text-xs leading-relaxed">
          Your Lunara link and QR code stay unchanged. When a website is
          connected, visitors using your salon link will be redirected to your
          website.
        </p>
      </div>

      {/* Actions */}
      <div className="border-ink/10 mt-5 flex items-center justify-between gap-4 border-t pt-4">
        <p className="text-ink-muted text-xs">
          {isLoading
            ? "Loading..."
            : externalWebsiteUrl
              ? "External website connected"
              : "Using Lunara public page"}
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isLoading || isUpdating}
          className="border-ink bg-ink text-cream disabled:border-ink/20 disabled:bg-ink/30 shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition disabled:cursor-not-allowed"
        >
          {isUpdating ? "Saving..." : "Save Website"}
        </button>
      </div>
    </section>
  );
}

export default AddWebsite;
