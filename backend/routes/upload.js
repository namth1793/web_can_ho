const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

const ADMIN_KEY = 'oanhomes2024';

// Memory storage — stream buffer to Cloudinary, no temp files on disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ chấp nhận file ảnh'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('file'), async (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.file) return res.status(400).json({ message: 'Không có file' });

  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
    return res.status(500).json({ message: 'Cloudinary chưa được cấu hình. Hãy điền thông tin vào file .env' });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'chungcugiarehn', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (err, result) => { if (err) reject(err); else resolve(result); }
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ message: 'Upload thất bại: ' + err.message });
  }
});

module.exports = router;
