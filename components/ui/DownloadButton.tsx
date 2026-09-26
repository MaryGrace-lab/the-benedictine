"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  fileName?: string;
}

export default function DownloadButton({ fileName = "Report_Card" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = document.querySelector(".print-area") as HTMLElement | null;
    if (!element) {
      toast.error("Nothing to download");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Preparing image...");

    // Save current inline styles so we can restore them after capture
    const originalStyle = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      overflow: element.style.overflow,
      position: element.style.position,
    };

    // Force A4 desktop width for the capture
    const A4_WIDTH = 794; // 210mm at 96dpi
    element.style.width = `${A4_WIDTH}px`;
    element.style.maxWidth = `${A4_WIDTH}px`;
    element.style.overflow = "visible";
    element.style.position = "relative";

    // Give the browser a moment to reflow at the new width
    await new Promise((resolve) => setTimeout(resolve, 80));

    try {
      const { toJpeg } = await import("html-to-image");

      const dataUrl = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 2,                 // 2x for crisp text
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: false,
        width: A4_WIDTH,
        height: element.scrollHeight,
        style: { transform: "none" },
      });

      const link = document.createElement("a");
      link.download = `${fileName}.jpg`;
      link.href = dataUrl;
      link.click();

      toast.success("Image downloaded!", { id: toastId });
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Failed to generate image", { id: toastId });
    } finally {
      // Restore the original styles
      element.style.width = originalStyle.width;
      element.style.maxWidth = originalStyle.maxWidth;
      element.style.overflow = originalStyle.overflow;
      element.style.position = originalStyle.position;
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} />
          Download Image
        </>
      )}
    </button>
  );
}