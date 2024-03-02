import multer from 'multer';
import { diskStorage } from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// MIME types for supported image formats
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Get the current directory using fileURLToPath and dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Multer configuration for handling file uploads
const storage = diskStorage({
    // Setting the destination for uploaded files
    destination: (req, file, callback) => {
        callback(null, join(__dirname, "../public/images"));
    },
    // Setting the filename for uploaded files
    filename: (req, file, callback) => {
        // Generating a unique filename with a timestamp and extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${uniqueSuffix}.${extension}`);
    }
});

// Middleware function to handle file uploads
const upload = multer({
    storage: storage,
    // Setting size limits for uploaded files (512 KB in this case)
    limits: { fileSize: 512 * 1024 }
}).single("image");

export default upload;
