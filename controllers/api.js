const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Character = require('../models/Character');
const Wall = require('../models/Wall');

/**
 * GET /api
 */
exports.index = function(req, res) {
    res.render('api', {
        title: 'API'
    });
};

/** API Routes for Campaigns */
  
exports.getCampaign = function(req, res) {
    let campaignId = req.params.campaignId;

    Campaign.findOne({
        _id: campaignId
    }).lean().exec((err, campaign) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            campaign: campaign
        }, null, 4))
    });
};

exports.getCampaignComplete = function(req, res) {
    let campaignId = req.params.campaignId;
    
    Campaign.findOne({
        _id: campaignId
    }).exec((err, campaign) => {
        User.find({
            _id: {$in: campaign.userIds}
        }).exec((err, users) => {
            Character.find({
                _id: {$in: campaign.characterIds}
            }).exec((err, characters) => {
                Wall.find({
                    _id: {$in: campaign.wallIds}
                }).exec((err, walls) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        campaign: campaign,
                        users: users,
                        characters: characters,
                        walls: walls
                    }, null, 4))
                });
            })
        })
    });
};

exports.createCampaign = function(req, res, next) {
    let name = req.body.name;
    let admin = req.body.admin;

    User.findOne({
        username: admin
    }).exec((err, user) => {
        if(!user.admin) {
            req.flash('failure', {
                msg: 'Must be admin to make campaign.'
            });
            return next(err);
        }

        let adminId = user._id;

        const newCampaign = new Campaign({
            name: name,
            adminId: adminId
        });

        newCampaign.save((err, campaign) => {
            if(err) {
                req.flash('failure', {
                    msg: 'Campaign creation failed.'
                });
                return next(err);
            }
            campaign.addUser(user._id);
            user.setCampaign(campaign._id);
            return res.redirect('/');         
        });
    });
};

exports.addUserToCampaign = function(req, res, next) {
    let campaignId = req.body.campaignId;
    let username = req.body.name;

    User.findOne({
        username: username
    }).exec((err, user) => {
        if(err) {
            req.flash('failure', {
                msg: 'Couldn\'t find User.'
            });
            return next(err);
        }

        Campaign.findOne({
            _id: campaignId
        }).exec((err, campaign) => {
            if(err) {
                req.flash('failure', {
                    msg: 'Couldn\t find Campaign.'
                });
                return next(err);
            }

            campaign.addUser(user._id);
            user.setCampaign(campaign._id);
            return res.redirect('/');
        });
    });
};

/** API Routes for Users */

exports.getUser = function(req, res) {
    let userId = req.params.userId;

    User.findOne({
        _id: userID
    }).lean().exec((err, user) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            user: user
        }, null, 4))
    });
};

exports.createUser = function(req, res, next) {
    let username = req.body.name;

    const newUser = new User({
        username: username,
        admin: false
    });

    if(req.body.admin) {
        newUser.admin = true;
    }

    newUser.save((err, user) => {
        if(err) {
            req.flash('failure', {
                msg: 'User creation failed.'
            })
            return next(err);
        }
        return res.redirect('/')        
    });
};

/** API Routes for Characters */

exports.getCharacter = function(req, res) {
    let characterId = req.params.characterId;

    Character.findOne({
        _id: characterId
    }).lean().exec((err, character) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            character: character
        }, null, 4));
    });
};

exports.updateCharacter = function(req, res) {
    let characterId = req.params.characterId;
    let loc_x = req.body.x;
    let loc_z = req.body.z;
    let health = req.body.health;
    let movement = req.body.movement;

    Character.findOne({
        _id: characterId
    }).exec((err, character) => {
        character.update(loc_x, loc_z, health, movement);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            character: character
        }, null, 4));
    });
};

exports.createCharacter = function(req, res) {
    let username = req.body.name;
    let charName = req.body.charName;

    User.findOne({
        username: username
    }).exec((err, user) => {
        if(err) {
            req.flash('failure', {
                msg: 'Couldn\'t find user.'
            })
            return next(err);
        }

        Campaign.findOne({
            _id: user.campaignId
        }).exec((err, campaign) => {
            if(err) {
                req.flash('failure', {
                    msg: 'Couldn\'t find campaign.'
                })
                return next(err);
            }

            const newCharacter = new Character({
                userId: user._id,
                campaignId: campaign._id,
                name: charName,
                loc_x: 0,
                loc_y: 0,
                loc_z: 0,
                stats: {
                    health: 10,
                    movement: 20
                }
            });

            newCharacter.save((err, character) => {
                if(err) {
                    req.flash('failure', {
                        msg: 'Couldn\'t save character.'
                    })
                    return next(err);
                }

                user.addCharacter(character._id);
                campaign.addCharacter(character._id);

                return res.redirect('/')                        
            });
        })
    });
};

/** API Routes for Walls */
exports.addWall = function(req, res) {
    let campaignId = req.params.campaignId;
    let startX = req.body.startX;
    let startZ = req.body.startZ;
    let endX = req.body.endX;
    let endZ = req.body.endZ;

    Campaign.findOne({
        _id: campaignId
    }).exec((err, campaign) => {
        if(err) {
            req.flash('failure', {
                msg: 'Couldn\'t find campaign.'
            })
            return next(err);
        }

        const newWall = new Wall({
            campaignId: campaignId,
            startX: startX,
            startZ: startZ,
            endX: endX,
            endZ: endZ
        });

        newWall.save((err, wall) => {
            if(err) {
                req.flash('failure', {
                    msg: 'Couldn\'t save wall.'
                })
                return next(err);
            }

            campaign.addWall(wall._id);

            return res.redirect('/');
        });
    });
};