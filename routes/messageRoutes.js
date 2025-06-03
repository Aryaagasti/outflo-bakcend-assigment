const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Define message generation route
router.post('/', messageController.generateMessage);

module.exports = router;