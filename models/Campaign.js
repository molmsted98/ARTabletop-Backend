const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: String,
    userIds: [String],
    adminId: String,
    characterIds: [String],
    wallIds: [String],
    assets: {
        floor_file: String,
        wall_file: String
    }
}, {
    timestamps: true
});

campaignSchema.methods.addUser = function(userId) {
    this.userIds.push(userId);
    this.save();
};

campaignSchema.methods.addCharacter = function(characterId) {
    this.characterIds.push(characterId);
    this.save();
};

campaignSchema.methods.addWall = function(wallId) {
    this.wallIds.push(wallId);
    this.save();
};

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;