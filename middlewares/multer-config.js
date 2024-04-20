import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
   "video/mp4": "mp4",
   "application/pdf": "pdf",
};

const storage = diskStorage({
   destination: (req, file, callback) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      callback(null, join(__dirname, "../public"));
   },
   filename: (req, file, callback) => {
      const nameWithoutSpaces = file.originalname.split(" ").join("_");
      const [name, originalExtension] = nameWithoutSpaces.split('.');
      const extension = MIME_TYPES[file.mimetype];
      const finalExtension = originalExtension || extension;
      const filename = `${name}.${finalExtension}`;
      callback(null, filename);
   },
});

export default multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
       const isValid = !!MIME_TYPES[file.mimetype];
       if (isValid) {
          callback(null, true);
       } else {
          callback(new Error('Invalid file type. Only PDF files are allowed.'));
       }
    },
 }).single("source");