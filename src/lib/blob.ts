import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// Uploads a file to Vercel Blob when BLOB_READ_WRITE_TOKEN is configured.
// Falls back to writing under public/uploads for local development before
// a Blob store has been created, so the app stays testable either way.
export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = path.extname(file.name) || EXT_BY_MIME[file.type] || "";
  const fileName = `${folder}/${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, file, { access: "public" });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const localName = path.basename(fileName);
  await writeFile(path.join(uploadsDir, localName), buffer);
  return `/uploads/${folder}/${localName}`;
}
