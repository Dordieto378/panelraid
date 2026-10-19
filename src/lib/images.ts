export function imageSrcSet(url: string): string | undefined {
  if (url.startsWith("/images/") && url.endsWith(".webp")) {
    if (url.includes("gaming")) return undefined;
    const base = url.slice(0, -5);
    return `${base}-420.webp 420w, ${base}-800.webp 800w, ${url} ${url.includes("frieren") ? 1600 : 1000}w`;
  }
  if (url.startsWith("https://cdn.sanity.io/")) {
    return [420, 800, 1400]
      .map((width) => {
        const imageUrl = new URL(url);
        imageUrl.searchParams.set("w", String(width));
        return `${imageUrl.href} ${width}w`;
      })
      .join(", ");
  }
  return undefined;
}
