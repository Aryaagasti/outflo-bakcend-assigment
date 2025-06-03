const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name:{type: String, required: true},
    description: {type: String, required: true},
   status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
      default: 'ACTIVE',
    },
    leads:[{type: String}],
    accountIDs: [{type: String}]
},{timestamps: true});

module.exports = mongoose.model('Campaign', campaignSchema);