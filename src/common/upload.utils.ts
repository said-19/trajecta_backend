import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { diskStorage } from 'multer';
import type { Request } from 'express';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
export const GALLERY_DIR = join(UPLOADS_ROOT, 'gallery');
export const FORMATIONS_DIR = join(UPLOADS_ROOT, 'formations');

export function ensureUploadDirs() {
  for (const dir of [UPLOADS_ROOT, GALLERY_DIR, FORMATIONS_DIR]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!IMAGE_MIME.has(file.mimetype)) {
    return cb(new Error('Type de fichier non autorisé (jpeg, png, webp, gif)'), false);
  }
  cb(null, true);
}

export function createImageStorage(subdir: 'gallery' | 'formations') {
  const destination = subdir === 'gallery' ? GALLERY_DIR : FORMATIONS_DIR;
  return diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadDirs();
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${unique}${ext}`);
    },
  });
}

export function toPublicUploadPath(
  filename: string,
  subdir: 'gallery' | 'formations',
) {
  return `/uploads/${subdir}/${filename}`;
}

export function deleteUploadFile(publicPath?: string | null) {
  if (!publicPath) return;
  const relative = publicPath.replace(/^\//, '');
  if (!relative.startsWith('uploads/')) return;
  const absolute = join(process.cwd(), relative);
  if (existsSync(absolute)) {
    unlinkSync(absolute);
  }
}

/** Max image size: 5 MB */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
