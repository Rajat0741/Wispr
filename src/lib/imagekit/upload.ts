import { upload } from "@imagekit/next";
import {
  IMAGE_UPLOAD_CONSTRAINTS,
  IMAGEKIT_FOLDERS,
} from "@/lib/imagekit/constants";

export async function uploadToImageKit(
  file: File,
  folder: string = IMAGEKIT_FOLDERS.GROUP_DP,
): Promise<{ url: string; fileId: string }> {
  const isAllowed = (
    IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_TYPES as readonly string[]
  ).includes(file.type);

  if (!isAllowed) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
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
    fileName: file.name,
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
