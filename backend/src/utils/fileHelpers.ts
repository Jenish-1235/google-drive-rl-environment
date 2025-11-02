import path from "path";

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeTypes: { [key: string]: string } = {
    // Documents
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".rtf": "application/rtf",

    // Spreadsheets
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv",

    // Presentations
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Images
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",

    // Videos
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".mkv": "video/x-matroska",
    ".webm": "video/webm",

    // Audio
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".m4a": "audio/mp4",

    // Archives
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".7z": "application/x-7z-compressed",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",

    // Code
    ".js": "text/javascript",
    ".json": "application/json",
    ".html": "text/html",
    ".css": "text/css",
    ".xml": "application/xml",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("document") || mimeType.includes("word"))
    return "document";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return "archive";
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
