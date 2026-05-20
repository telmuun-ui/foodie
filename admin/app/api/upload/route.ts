import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const saveToSharedServerPublic = async (file: File, apiUrl: string) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".png";
  const fileName = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "..", "server", "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `${apiUrl}/uploads/${fileName}`;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_API_URL is required for image uploads" },
        { status: 500 }
      );
    }

    const localUrl = await saveToSharedServerPublic(file, apiUrl);

    return NextResponse.json({ url: localUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
