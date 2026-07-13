/** Allowed MIME types for community photo uploads */
export const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

/** Maximum allowed file size in bytes (5 MB) */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Convert an ArrayBuffer to a base64 string without hitting the call-stack limit.
 *
 * The naive `btoa(String.fromCharCode(...new Uint8Array(buf)))` pattern spreads
 * potentially millions of arguments onto String.fromCharCode and blows the stack
 * for files larger than ~1 MB. This version processes 32 KB at a time instead.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000; // 32 KB — safe call-stack size
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
  }

  return btoa(parts.join(''));
}
