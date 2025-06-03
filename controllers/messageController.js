const {generateLinkedInMessage} = require('../utils/geminiService')

exports.generateMessage = async (req, res) => {
    try {
        const {name, job_title, company, location, summary} = req.body;
        if (!name || !job_title || !company || !location || !summary) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const message =  await generateLinkedInMessage({
            name,
            job_title,
            company,
            location,
            summary
        });
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate message' });
        console.error('Error generating message:', error);
    }
}