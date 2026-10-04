function decodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image decode failed'));
    image.src = src;
  });
}

/** Fetch an SVG and stamp it onto a bitmap so the puzzle cutter always has real pixels. */
export async function loadStoryImage(src: string, width = 800, height = 600): Promise<HTMLImageElement> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Could not fetch ${src} (${response.status})`);
  }

  const svgText = await response.text();
  const blobUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const svgImage = await decodeImage(blobUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas');
    context.fillStyle = '#fff8ee';
    context.fillRect(0, 0, width, height);
    context.drawImage(svgImage, 0, 0, width, height);
    return decodeImage(canvas.toDataURL('image/png'));
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
