import { upload } from "@vercel/blob/client";

// Uploads a file straight from the browser to Vercel Blob (no 4.5MB serverless
// limit). Returns the public URL. Used by the admin product and settings forms.
export async function uploadImage(file: File, folder: string): Promise<string> {
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "misc";
  const blob = await upload(`${safeFolder}/${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload-token",
  });
  return blob.url;
}
