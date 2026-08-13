export const IMAGEKIT_FOLDERS = {
  GROUP_DP: "/Wispr/DP",
  USER_DP: "/Wispr/DP",
} as const;

export const IMAGE_UPLOAD_CONSTRAINTS = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_LABEL: "5MB",
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
} as const;
