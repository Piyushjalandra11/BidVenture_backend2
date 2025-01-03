import { Request } from 'express';

export type SavedFile = {
  fileName: string;
  filePath: string;
};

export function saveFiles(req: Request): SavedFile | SavedFile[] | null {
  const singleFile = req.file;
  const multipleFiles = req.files as Express.Multer.File[];

  if (singleFile) {
    return { fileName: singleFile.filename, filePath: singleFile.path };
  }

  if (multipleFiles && multipleFiles.length > 0) {
    return multipleFiles.map((file) => ({
      fileName: file.filename,
      filePath: file.path,
    }));
  }

  // Return null if no files are uploaded
  return null;
}
