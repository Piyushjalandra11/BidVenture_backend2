import multer from 'multer';
import path from 'path';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 'uploads/' folder me save hoga file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename generate karega
  },
});

// File filter (optional)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // File accept
  } else {
    cb(new Error('Invalid file type!'), false); // File reject
  }
};

// Multer instance with storage configuration and file filter
const uploadImage = multer({ storage, fileFilter });

export default uploadImage;
