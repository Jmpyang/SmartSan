import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { config } from '../config';
import { ValidationError } from './errors';

// Ensure upload directories exist
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists(path.join(__dirname, '../../uploads/reports'));
ensureDirectoryExists(path.join(__dirname, '../../uploads/avatars'));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.path.includes('avatar') ? 'avatars' : 'reports';
    const dest = path.join(__dirname, `../../uploads/${uploadType}`);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (config.upload.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Invalid file type. Allowed types: ${config.upload.allowedFileTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// Compress and optimize images
export const compressImage = async (filePath: string): Promise<void> => {
  try {
    const buffer = await sharp(filePath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    await fs.promises.writeFile(filePath, buffer);
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, keep original file
  }
};

// Delete file utility
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File deletion error:', error);
  }
};

// Get file URL
export const getFileUrl = (req: any, filename: string, type: 'report' | 'avatar' = 'report'): string => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${type}s/${filename}`;
};
