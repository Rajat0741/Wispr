import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";
import { handleRouteError } from "@/utils/handle-error";

export async function GET(request: Request): Promise<Response> {
  try {
    await getUserSession(request.headers);

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey =
      process.env.IMAGEKIT_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      throw new AppError("ImageKit is not properly configured on server", 500);
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    return handleRouteError(error, "Upload auth API error:");
  }
}
