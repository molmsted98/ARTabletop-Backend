var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');
var ApiController = require('./controllers/api');

var app = express();

const options = {
  useMongoClient: true,
  keepAlive: 120,
  connectTimeoutMS: 3000
}
mongoose.connect(process.env.MONGODB, options, function(err) {
  if(err) {
    console.log(err);
  }
});
mongoose.connection.on('connected', function(err) {
  console.log('MongoDB connection established!');
});
mongoose.connection.on('error', function(err) {
  console.log(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit(1);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.post('/', HomeController.postInfo);
app.get('/api', ApiController.index);
app.get('/api/campaigns/:campaignId', ApiController.getCampaign);
app.get('/api/campaigns/:campaignId/complete', ApiController.getCampaignComplete);
app.post('/api/campaigns/:campaignId/addUser', ApiController.addUserToCampaign);
app.post('/api/campaigns/:campaignId/addWall', ApiController.addWall);
app.post('/api/campaigns', ApiController.createCampaign);
app.get('/api/users/:userId', ApiController.getUser);
app.post('/api/users', ApiController.createUser);
app.get('/api/characters/:characterId', ApiController.getCharacter);
app.post('/api/characters/:characterId', ApiController.updateCharacter);
app.post('/api/characters', ApiController.createCharacter);


// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
