import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUsername } from "@/lib/session";

// Client-upload flow: the browser uploads the file directly to Vercel Blob,
// which avoids the 4.5MB limit on files that pass through a serverless function.
// This route only issues a short-lived, scoped upload token to logged-in admins.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const username = await getSessionUsername();
        if (!username) {
          throw new Error("Not authenticated.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/heif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB — plenty for phone photos
        };
      },
      onUploadCompleted: async () => {
        // No-op: the client stores the returned URL on the product/setting.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
