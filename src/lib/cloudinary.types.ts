/** Moderation status for a community photo submission */
export type PhotoStatus = 'pending' | 'approved' | 'rejected';

/** A single photo submission from the community */
export interface Photo {
  /** ISO 8601 timestamp of when the photo was uploaded */
  createdAt: string;
  height: number;
  id: string;
  /** Original file size (bytes) before upload — supplied by the browser */
  originalSize?: number;
  /** File size (bytes) of the processed image stored by Cloudinary */
  processedSize: number;
  /** Cloudinary public_id — used to build additional delivery URLs */
  publicId: string;
  /** Moderation status — only "approved" photos appear in the gallery */
  status: PhotoStatus;
  /** Human-readable title or caption */
  title: string;
  /** Cloudinary secure URL after incoming transformations */
  url: string;
  /** Processed dimensions returned by Cloudinary after incoming transformations */
  width: number;
}

/** Payload returned after a successful Cloudinary upload */
export interface CloudinaryUploadResult {
  /** Processed file size in bytes — returned by Cloudinary upload response */
  bytes: number;
  height: number;
  public_id: string;
  secure_url: string;
  width: number;
}
