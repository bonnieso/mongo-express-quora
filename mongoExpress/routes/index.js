var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MD5 = require("MD5");
var slug = require("slug");

mongoose.connect(process.env.MONGO_URL);

// var User = mongoose.model("users", { name: String });
// var user1 = new User({name: 'from Mongoos'});
// user1.save();
//
// User.find({}, function(err, data) {
//   console.log(data);
// });

var Question = mongoose.model("Question", {
  slug: { type: String, required: true, unique: true },
  body: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  gravatarUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// temp500Qs = Array.apply(null, Array(500)).map(function(n, i) { return { body: "Q" + i, email: 'test@test.com' } });
// Question.create(temp500Qs);

Question.on('index', function(err) {
  if (err) {
    console.error(err);
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mongo API' });
});

router.get('/test', function(req, res, next) {
  res.send("just testing");
});

router.post('/test', function(req, res, next) {
  var response = req.body;
  response.serverTime = new Date();
  res.json(response);
});

//
router.get('/questions/:slug', function(req, res, next) {
  var slugParam = req.params.slug;
  
  Question.find({slug: slugParam}).exec(function(err, questions) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read questions data" });
    }
      console.log(questions);
    res.json(questions);
  });
  
});

//

router.post("/questions", function(req, res) {
  var question = new Question(req.body);

  question.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(req.body.email);
  
  question.slug = slug(req.body.body);
  
  question.save(function(err, savedQuestion) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedQuestion:", savedQuestion);
    res.json(savedQuestion);
  });
});

router.get("/questions", function(req, res) {
  Question.find({}).sort({ createdAt: 'desc' }).limit(10).exec(function(err, questions) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read questions data" });
    }
    res.json(questions);
  });
});

module.exports = router;
