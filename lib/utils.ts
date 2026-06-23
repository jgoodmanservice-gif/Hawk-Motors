export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatMileage(n: number) {
  return `${new Intl.NumberFormat("en-GB").format(n)} mi`;
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Extract a YouTube/Vimeo embed URL from a watch link. */
export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* noop */
  }
  return url;
}

export function youtubeThumb(url: string): string | null {
  try {
    const u = new URL(url);
    const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    /* noop */
  }
  return null;
}

export const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
  DRAFT: "Draft",
};
