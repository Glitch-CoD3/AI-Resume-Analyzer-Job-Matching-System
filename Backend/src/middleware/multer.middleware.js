import multer from 'multer';
import path from 'path';

const upload = multer ({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
})

export {
    upload,
}
