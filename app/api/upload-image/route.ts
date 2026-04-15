import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    // Generate the signature using your secret key from the environment variables
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
