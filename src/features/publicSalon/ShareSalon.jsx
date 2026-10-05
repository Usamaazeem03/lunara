import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { notify } from "../../Shared/lib/toast.jsx";
import PublicSalonSocialLinks from "./PublicSalonSocialLinks.jsx";

export default function ShareSalon({ salonUrl, ownerName, socialLinks }) {
  const { t } = useTranslation();
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(salonUrl);
      setCopied(true);
      notify.success(t("salon.linkCopied"));
    } catch {
      notify.error(t("salon.couldNotCopyTryManually"));
    }
  };
  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml;charset=utf-8",
      }),
    );
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 720;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, 720, 720);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${ownerName.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-") || "salon"}-qr.png`;
        link.click();
        notify.success(t("salon.qrCodeDownloaded"));
      } catch {
        notify.error(t("salon.page.qrDownloadFailed"));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      notify.error(t("salon.page.qrDownloadFailed"));
    };
    img.src = url;
  };
  return (
    <section className="salon-share salon-panel">
      <PublicSalonSocialLinks links={socialLinks} />
      <p className="salon-eyebrow">{t("salon.spreadTheWord")}</p>
      <h2>{t("salon.shareSalon")}</h2>
      <p className="salon-muted">{t("salon.page.shareDescription")}</p>
      <button className="salon-copy-button" onClick={copyLink}>
        {t(copied ? "salon.linkCopied" : "salon.copyLink")}{" "}
        <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
      </button>
      <details className="salon-qr">
        <summary>
          {t("salon.qrCode")}
          <span>{t("salon.scanToVisit")}</span>
        </summary>
        <div ref={qrRef}>
          <QRCodeSVG
            value={salonUrl}
            size={180}
            level="H"
            marginSize={4}
            fgColor="#2d2620"
            bgColor="#ffffff"
          />
        </div>
        <button className="salon-text-button" onClick={downloadQR}>
          {t("salon.downloadQr")} ↓
        </button>
      </details>
    </section>
  );
}
