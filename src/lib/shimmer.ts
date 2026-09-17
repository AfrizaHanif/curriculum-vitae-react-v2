// Helper konversi ke base64 di browser/node
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

/**
 * Menghasilkan SVG animasi gelombang kilau (shimmer wave)
 */
export const shimmerSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#2a2e39" offset="20%" />
      <stop stop-color="#3b4252" offset="50%" />
      <stop stop-color="#2a2e39" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#242933" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

export const getShimmerDataUrl = (w = 700, h = 475) =>
  `data:image/svg+xml;base64,${toBase64(shimmerSvg(w, h))}`;
