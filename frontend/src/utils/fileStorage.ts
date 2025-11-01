import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const saveFileLocally = async (
  file: File,
  fileName: string
): Promise<string> => {
  // Ensure upload directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Generate unique filename
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const uniqueName = `${baseName}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  // Convert File to Buffer and save
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // Return relative path for DB storage
  return `/uploads/${uniqueName}`;
};

export const deleteFileLocally = async (fileUrl: string): Promise<void> => {
  const filePath = path.join(process.cwd(), "public", fileUrl);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
