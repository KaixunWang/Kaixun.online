import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Content-Type must be multipart/form-data." },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const mime = file.type;
  const size = file.size;

  const isImage = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";

  if (!isImage && !isPdf) {
    return NextResponse.json(
      { message: "Only images and PDF files are allowed." },
      { status: 400 },
    );
  }

  if (isImage && size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { message: "Image is too large (max 5MB)." },
      { status: 400 },
    );
  }

  if (isPdf && size > MAX_PDF_SIZE) {
    return NextResponse.json(
      { message: "PDF is too large (max 20MB)." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = isPdf ? ".pdf" : getExtensionFromMime(mime);
  const fileName = `${randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${fileName}`;

  return NextResponse.json({ url });
}

function getExtensionFromMime(mime: string): string {
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  return "";
}

