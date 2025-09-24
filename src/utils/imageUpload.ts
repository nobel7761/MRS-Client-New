// Image upload utility functions

export interface ImageUploadValidation {
  isValid: boolean;
  error?: string;
}

export interface FileSizeLimits {
  maxSizeInMB: number;
  maxSizeInBytes: number;
}

// Supported file types
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/ico",
];

export const SUPPORTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/flv",
  "video/webm",
  "video/3gp",
  "video/mkv",
  "video/m4v",
  "video/mpg",
  "video/mpeg",
  "video/ogv",
  "video/ogg",
];

export const SUPPORTED_FILE_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
];

// File size limits (in MB)
export const FILE_SIZE_LIMITS: FileSizeLimits = {
  maxSizeInMB: 10, // Free plan limit
  maxSizeInBytes: 10 * 1024 * 1024, // 10MB in bytes
};

/**
 * Validates if a file is a supported image or video type
 */
export const validateFileType = (file: File): ImageUploadValidation => {
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Only images and videos are allowed. Received: ${file.type}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates if a file size is within the allowed limits
 */
export const validateFileSize = (file: File): ImageUploadValidation => {
  if (file.size > FILE_SIZE_LIMITS.maxSizeInBytes) {
    return {
      isValid: false,
      error: `File too large. Maximum size allowed is ${FILE_SIZE_LIMITS.maxSizeInMB}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Validates both file type and size
 */
export const validateFile = (file: File): ImageUploadValidation => {
  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true };
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Creates a preview URL for an image file
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free up memory
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Checks if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Checks if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Gets file type category for display
 */
export const getFileTypeCategory = (
  file: File
): "image" | "video" | "unknown" => {
  if (isImageFile(file)) return "image";
  if (isVideoFile(file)) return "video";
  return "unknown";
};

/**
 * Converts file size to MB
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

/**
 * Validates file before upload and returns detailed validation result
 */
export const validateFileForUpload = (
  file: File
): {
  isValid: boolean;
  error?: string;
  fileType: "image" | "video" | "unknown";
  fileSize: string;
  fileSizeMB: number;
} => {
  const validation = validateFile(file);
  const fileType = getFileTypeCategory(file);
  const fileSize = formatFileSize(file.size);
  const fileSizeMB = bytesToMB(file.size);

  return {
    isValid: validation.isValid,
    error: validation.error,
    fileType,
    fileSize,
    fileSizeMB,
  };
};


