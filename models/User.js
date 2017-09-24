const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    campaignId: String,
    characterIds: [String],
    admin: Boolean
}, {
    timestamps: true
});

userSchema.methods.setCampaign = function(campaignId) {
    this.campaignId = campaignId;
    this.save();
};

userSchema.methods.addCharacter = function(characterId) {
    this.characterIds.push(characterId);
    this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;