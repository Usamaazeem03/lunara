import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Icon from "../../Shared/ui/Icon";

/**
 * Salon Share Card
 * Displays owner's public salon URL and QR code
 * Shows in the owner's dashboard
 */
function SalonShareCard({ ownerProfile }) {
  const [copied, setCopied] = useState(false);

  if (!ownerProfile?.salon_slug) {
    return null;
  }

  const salonUrl = `${window.location.origin}/salon/${ownerProfile.salon_slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(salonUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-ink/10 rounded-xl border bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon name="link" size={20} className="text-ink" />
        <h3 className="text-ink text-lg font-bold">Your Salon Page</h3>
      </div>

      <p className="text-ink/60 mb-4 text-sm">
        Share your unique salon page with clients
      </p>

      {/* URL Display */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={salonUrl}
          readOnly
          className="border-ink/20 bg-cream-soft text-ink/70 flex-1 truncate rounded-lg border px-3 py-2 text-sm"
        />
        <button
          onClick={handleCopyLink}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            copied
              ? "bg-green-100 text-green-800"
              : "bg-ink text-cream hover:bg-ink/90"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* QR Code */}
      <div className="bg-cream-soft mb-6 flex justify-center rounded-lg p-4">
        <QRCodeSVG
          value={salonUrl}
          size={180}
          level="H"
          includeMargin={true}
          fgColor="#2d2620"
          bgColor="#f7f5f0"
        />
      </div>

      <p className="text-ink/60 text-center text-xs">
        Scan or share to let clients book directly
      </p>
    </div>
  );
}

export default SalonShareCard;
