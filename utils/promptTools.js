export const MODEL_OPTIONS = [
  'ChatGPT / DALL-E',
  'Gemini / Nano Banana',
  'Midjourney',
  'Google Flow',
  'Seedance',
  'Stable Diffusion',
  'Other',
];

export const STYLE_OPTIONS = [
  'Cinematic',
  'Anime',
  'Portrait',
  'Product',
  'Logo Design',
  'Fantasy',
  'UI/UX',
  'Abstract',
  'Minimalist',
  'Other',
];

export function getModelUrl(model = '') {
  const value = model.toLowerCase();
  if (value.includes('chatgpt') || value.includes('dall')) return 'https://chatgpt.com/';
  if (value.includes('gemini') || value.includes('banana')) return 'https://gemini.google.com/app';
  if (value.includes('flow')) return 'https://labs.google/fx/tools/flow';
  if (value.includes('midjourney')) return 'https://www.midjourney.com/imagine';
  if (value.includes('seedance')) return 'https://dreamina.capcut.com/';
  if (value.includes('stable diffusion')) return 'https://stability.ai/';
  return null;
}

export function normalizeExternalUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const url = new URL(trimmed);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Source URL must use http or https.');
  return url.toString();
}

export async function compressPromptImage(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    throw new Error('Upload a JPG, PNG, or WebP image.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('The original image must be smaller than 10 MB.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('The selected image could not be read.'));
      element.src = objectUrl;
    });

    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
    if (!blob) throw new Error('Image compression failed.');
    if (blob.size > 5 * 1024 * 1024) {
      throw new Error('The optimized image is still larger than 5 MB.');
    }

    return new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
