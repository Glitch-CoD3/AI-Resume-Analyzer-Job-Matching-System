import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // os.tmpdir() points to /tmp on Vercel and C:\Users\...\AppData\Local\Temp on Windows
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });