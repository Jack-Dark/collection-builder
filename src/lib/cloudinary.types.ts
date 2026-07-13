/** Payload returned after a successful Cloudinary upload */
export interface CloudinaryUploadResult {
  /** Processed file size in bytes — returned by Cloudinary upload response */
  bytes: number;
  height: number;
  public_id: string;
  secure_url: string;
  width: number;
}
