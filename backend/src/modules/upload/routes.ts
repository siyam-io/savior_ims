import express from 'express';
import { upload } from '../../middleware/upload.js';
import { isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.post('/image', isAuthenticated, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: req.file.path });
  });
});

export default router;
