const express = require('express');
const router = express.Router();
const { scrapeLinkedInProfiles } = require('../services/linkedInScraper');

// Route to trigger LinkedIn profile scraping
router.post('/scrape', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const profiles = await scrapeLinkedInProfiles(searchQuery);
    res.json(profiles);
  } catch (error) {
    console.error('Error in scraper route:', error);
    res.status(500).json({ error: 'Failed to scrape profiles' });
  }
});

module.exports = router;