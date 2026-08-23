/** Reads a File as a data URL, downscaling it first if it's larger than `maxDim` on its longest side. */
export async function readAndDownscaleImage(file: File, maxDim = 1600): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to decode image'));
    el.src = rawDataUrl;
  });

  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  if (longest <= maxDim) return rawDataUrl;

  const scale = maxDim / longest;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return rawDataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.9);
}
