const express = require('express');
const router = express.Router();
const {
  getAllSocialContent,
  getSocialContentById,
  getSocialContentByPlatform,
  searchSocialContent
} = require('../controllers/socialController');

// GET /api/social-content - Get all social content
router.get('/', getAllSocialContent);

// GET /api/social-content/:id - Get social content by ID
router.get('/:id', getSocialContentById);

// GET /api/social-content/platform/:platform - Get social content by platform
router.get('/platform/:platform', getSocialContentByPlatform);

// GET /api/social-content/search - Search social content
router.get('/search', searchSocialContent);

module.exports = router;