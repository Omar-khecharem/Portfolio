const express = require('express');
const router = express.Router();
const { UTApi } = require('uploadthing/server');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }])(req, res, async (err) => {
    if (err) {
      const message = err.message || 'Upload failed';
      return res.status(400).json({ message });
    }
    const file = req.files?.image?.[0] || req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    try {
      const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET });
      const uploadFile = new File([file.buffer], file.originalname, { type: file.mimetype });

      const result = await utapi.uploadFiles(uploadFile);

      if (result.error) {
        console.error('[UploadThing error]', result.error);
        return res.status(502).json({ message: 'UploadThing upload failed', detail: result.error.message });
      }

      const url = result.data?.url || result.data?.ufsUrl;
      if (!url) {
        console.error('[UploadThing] no URL in response:', JSON.stringify(result.data));
        return res.status(502).json({ message: 'UploadThing returned no URL' });
      }

      res.json({ url });
    } catch (e) {
      console.error('[UploadThing exception]', e);
      next(e);
    }
  });
});

module.exports = router;
