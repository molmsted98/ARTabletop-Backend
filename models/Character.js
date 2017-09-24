const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    userId: String,
    campaignId: String,
    name: String,
    loc_x: Number,
    loc_z: Number,
    stats: {
        health: Number,
        movement: Number
    }
}, {
    timestamps: true
});

characterSchema.methods.update = function(x, z, health, movement) {
    this.stats.health = health;
    this.stats.movement = movement;
    this.loc_x = x;
    this.loc_z = z;
    this.save();
};

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;