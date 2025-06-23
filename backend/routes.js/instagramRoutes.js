const express = require('express');
const router = express.Router();
const instagramController = require('../controllers.js/instagramController');

router.get('/auth', instagramController.getAuthUrl);
router.get('/callback', instagramController.handleCallback);
router.post('/post', instagramController.postToInstagram);

module.exports = router;