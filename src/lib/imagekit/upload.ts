import { upload } from "@imagekit/next";
import {
  IMAGE_UPLOAD_CONSTRAINTS,
  IMAGEKIT_FOLDERS,
} from "@/lib/imagekit/constants";

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

const HEIC_EXTENSIONS = [".heic", ".heif"];

function isHeicByExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isAllowedFile(file: File): boolean {
  const allowedTypes = IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_TYPES as readonly string[];
  if (allowedTypes.includes(file.type)) return true;
  // Fallback: some browsers report empty/generic type for HEIC/HEIF
  if (!file.type && isHeicByExtension(file.name)) return true;
  return false;
}

function getSafeFileName(file: File): string {
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  if (MIME_TO_EXTENSION[file.type]) {
    return `${baseName}.${MIME_TO_EXTENSION[file.type]}`;
  }

  // file.type empty but extension indicates HEIC/HEIF
  if (isHeicByExtension(file.name)) {
    const ext = file.name.toLowerCase().endsWith(".heif") ? "heif" : "heic";
    return `${baseName}.${ext}`;
  }

  return file.name;
}

export async function uploadToImageKit(
  file: File,
  folder: string = IMAGEKIT_FOLDERS.GROUP_DP,
): Promise<{ url: string; fileId: string }> {
  if (!isAllowedFile(file)) {
    throw new Error(
      "Invalid file type. Please upload a JPEG, PNG, WebP, or HEIC/HEIF image.",
    );
  }

  if (file.size > IMAGE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
    throw new Error(
      `File size exceeds the ${IMAGE_UPLOAD_CONSTRAINTS.MAX_SIZE_LABEL} limit.`,
    );
  }

  const authResponse = await fetch("/api/upload-auth");
  if (!authResponse.ok) {
    const errorData = await authResponse.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string })?.error ||
        "Failed to authenticate upload request.",
    );
  }

  const { token, expire, signature, publicKey } = await authResponse.json();

  const response = await upload({
    file,
    fileName: getSafeFileName(file),
    token,
    expire,
    signature,
    publicKey,
    folder,
  });

  if (!response?.url || !response?.fileId) {
    throw new Error("Upload completed without returning an image URL.");
  }

  return { url: response.url, fileId: response.fileId };
}
