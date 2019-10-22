var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    name: user.name,
    username: user.username
  }, secretKey, {

  });

  return token;
}


module.exports = function(app,express, io){
  var api = express.Router();

  api.get('/all_stories', function(req,res){
    Story.find({},function(err, stories){
      if(err){
        res.send(err);
        return;
      }
      //console.log(stories);
      res.json(stories);
    });
  });

  api.post('/signup', function(req, res){

    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });
    var token = createToken(user);
    user.save(function(err){
      if(err){
        res.send(err);
        return;
      }else{
        res.json({
          success:true,
          message: 'User has been created',
          token: token
        });
      }
    });
  });


  api.get('/users', function(req,res){

    User.find({}, function(err, users){
      if(err){
        res.send(err);
        return;
      }
      res.json(users);
    });
  });

api.post('/login', function(req,res){

  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user){
    if(err) throw err;

    if(!user){
      res.send({ message: "User does not exist"});
    }else if(user){



      var validPassword = user.comparePassword(req.body.password);
      console.log('status:', validPassword)


      if(!validPassword){
        res.send({ message: "invalid password"} );
      }else{

        var token = createToken(user);
        res.json({
          success: true,
          message: "Successsfuly login",
          token: token,

        });
      }
    }
  });
});


//A middleware to check whether user is logged in in our system or not

api.use(function(req,res,next){

  console.log("Somebody just come to our app!");
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  //check if token exist
  if(token){
    jsonwebtoken.verify(token, secretKey, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: "Failed to authenticating user"});
      }else{
        req.decoded = decoded;
        console.log("He is verified person");
        next();
      }
    });
  }else{
    res.status(403).send({ success: false,message: "No Token Provided"});
  }
});

//After loggin came to Destination B
//we want that if a user login and come to home page he can write story which will be savd on database
//lets create storySchema
// app.get('/',function(req,res){
//   res.json("Hello World!");
// });

api.route('/')
    .post(function(req,res){

      var story = new Story({
        creator: req.decoded.id,
        content: req.body.content,
      });
      story.save(function(err, newStory){
        if(err){
          res.send(err)
          return
        }
        io.emit('story', newStory)
        res.json({message: "New Story has been created"});
      });
    })

    .get(function(req,res){
      Story.find({ creator: req.decoded.id }, function(err,stories){
        if(err){
          res.send(err);
          return;
        }
        res.json(stories);
      });
    });

    api.get('/me',function(req,res){
      res.json(req.decoded);
    })


  return api
}

/*
user authentication  first is the cookie based approach whisch is the common approaach and the second is token-based authentication approach which is modern approaach
cookie base is all the way authenticating a user and not scalable way when it comes to fetching users data
Because every time we want user log in the server and that will create a seperate session in a server just for that users and thus wasting spaces on the server

while token based on authentication will be assinged along in the http requests
so when we are doing token based authentication it will create a token for you and it will be sent in every HTTP request without creating a seperate session that is more scalable
facebook,github,instagram has been using this approaach

*/
