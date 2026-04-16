import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // We define exactly what we want to sign. 
    // This MUST match the folder name used in your frontend uploadToCloudinary function.
    const paramsToSign = {
      timestamp,
      folder: "kabale_blog", 
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
