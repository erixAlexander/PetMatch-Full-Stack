const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageController');

router.post('/', messageController.handleMessage);

module.exports = router;