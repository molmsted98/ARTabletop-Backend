const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema({
    startX: Number,
    startZ: Number,
    endX: Number,
    endZ: Number,
    campaignId: String
}, {
    timestamps: true
});

const Wall = mongoose.model('Wall', wallSchema);

module.exports = Wall;