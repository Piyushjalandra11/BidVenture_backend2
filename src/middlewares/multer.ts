import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from '../config';
import path from 'path'; 


cloudinary.config({
  cloud_name: config.CLOUD_NAME, 
  api_key: config.API_KEY,       
  api_secret: config.API_SECRET, 
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', 
    format: async (req, file) => path.extname(file.originalname).replace('.', ''), 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
  } as {
    folder: string;
    format?: (req: Express.Request, file: Express.Multer.File) => string | Promise<string>;
    public_id?: (req: Express.Request, file: Express.Multer.File) => string;
  },
});

export const upload = multer({ storage });
