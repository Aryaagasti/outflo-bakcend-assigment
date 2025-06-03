const Campaign =  require('../models/Campaign')

exports.createCampaign =  async (req,res)=>{
    try {
       const campaign = new Campaign(req.body);
         await campaign.save();
         res.status(201).json({
            message: 'Campaign created successfully',
            campaign}) 
    } catch (error) {
        res.status(400).json({ error: 'Failed to create campaign' });
    }
}

//get all campaigns
exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
};

//update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update campaign' });
  }
};

//delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'DELETED' },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};