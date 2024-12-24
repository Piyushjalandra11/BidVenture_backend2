import { Router } from 'express';
import { PromiseHandler } from '../common/middlewares';
import { uploadFile } from './controllers';
const router = Router();

router.post('/upload', PromiseHandler(uploadFile));

export default router;




// import multer from "multer";
// import path from "path";

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Folder to store the uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
//   },
// });

// // File filter to accept only images (JPG, PNG, JPEG)
// const fileFilter = (req: any, file: any, cb: any) => {
//   const filetypes = /jpeg|jpg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// // Set up upload middleware
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5 MB
// });

// export default upload;
