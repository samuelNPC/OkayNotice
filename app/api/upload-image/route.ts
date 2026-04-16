import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// This tells Cloudinary WHO you are
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    // 1. Check if keys exist. If they don't, this will tell us exactly which one.
    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Missing API SECRET in .env" }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder: "kabale_blog", 
    };

    // 2. Generate the signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });

  } catch (error: any) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
