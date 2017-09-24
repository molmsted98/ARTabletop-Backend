/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * POST /
 */
exports.postInfo = function(req, res) {
  const action = req.body.action;

  res.body = req.body;
  
  //Create a user
  if(action == 0) {
    res.redirect(307, '/api/users');
  } 
  //Create a campaign
  else if(action == 1) {
    res.redirect(307, '/api/campaigns');  
  }
  //Add a user to a campaign
  else if(action == 2) {
    res.redirect(307, '/api/campaigns/' + req.body.campaignId + '/addUser');
  }
  else if(action == 3) {
    res.redirect(307, '/api/characters');
  }
  else if(action == 4) {
    res.redirect(307, '/api/characters/' + req.body.charId);
  }
  else if(action == 5) {
    res.redirect(307, '/api/campaigns/' + req.body.campaignId + '/addWall');
  }
};