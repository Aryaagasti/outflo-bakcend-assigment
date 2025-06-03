const mongoose = require('mongoose');

// Define the Profile schema for scraped LinkedIn profiles
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    job_title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the Profile model
module.exports = mongoose.model('Profile', profileSchema);