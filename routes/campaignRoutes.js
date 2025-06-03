const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// Define campaign routes
router.post('/', campaignController.createCampaign); // Create a campaign
router.get('/', campaignController.getAllCampaigns); // Get all campaigns
router.put('/:id', campaignController.updateCampaign); // Update a campaign
router.delete('/:id', campaignController.deleteCampaign); // Soft delete a campaign

module.exports = router;