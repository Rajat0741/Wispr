import { getImageKitServer } from "./server";

/**
 * Deletes a file from ImageKit by its fileId.
 *
 * Throws on failure so the caller can abort before writing to the DB,
 * preventing a state where the DB record is updated but the old file
 * still exists in ImageKit (orphan).
 */
export async function deleteImageKitFile(fileId: string): Promise<void> {
  const ik = getImageKitServer();
  await ik.files.delete(fileId);
}
