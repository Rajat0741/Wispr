import ImageKit from "@imagekit/nodejs";

let imagekitInstance: ImageKit | null = null;

export function getImageKitServer(): ImageKit {
  if (imagekitInstance) return imagekitInstance;

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
  }

  imagekitInstance = new ImageKit({
    privateKey,
  });

  return imagekitInstance;
}
