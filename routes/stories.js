const express = require('express');
const { ensureAuthenticated } = require('../helper/authHelper');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/Story');
const User = require('../models/User');

//stories index
router.get('/', (req, res) => {
  Story.find({ status: "public" })
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.render("stories/index", {
       stories: stories
     })
  })
})

//show single Story 
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    if(story.status == 'public'){
      res.render('stories/show', {
        story:story
      });
    } else {
      if(req.user){
        if(req.user.id == story.user._id){
          res.render('stories/show', {
            story:story
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    }
  });
});


//list all the story of one spesific user

router.get('/user/:userId', (req, res) => {
  Story.find({
    user: req.params.userId,
    status:"public"
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
      stories: stories
    })
  })
})

// my stories
router.get('/my', ensureAuthenticated,(req, res) => {
  Story.find({
    user: req.user.id
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
      stories: stories
    })
  })
})


//add Stories
router.get('/add',ensureAuthenticated, (req, res) => {
  res.render("stories/add");
})

// edit stories 
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      if (story.user != req.user.id) {
        res.redirect('/stories');
      }else{
      res.render("stories/edit", {
        story: story
        })
      }
    })
  .catch((err) => console.log(err))
})

//add stories to db
router.post('/', ensureAuthenticated, (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments =true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id,
  }

  new Story(newStory)
    .save()
    .then((story) => {
      res.redirect(`/stories/show/${story.id}`)
    })
  .catch((err) => console.log(err))
})

//edit post process
router.put('/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      let allowComments;
      if (req.body.allowComments) {
      allowComments =true;
      } else {   
      allowComments = false;
      }
      
      //set new values
      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComments = allowComments;

      story.save()
        .then(story => {
          res.redirect('/dashboard')
        })
      .catch((err) => console.log(err))
    })
})

//delete story

router.delete('/:id', (req, res) => {
  Story.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard');
    })
  .catch((err) => console.log(err))
})

//add comments

router.post('/comment/:id', (req, res) => {
  Story.findOne({_id: req.params.id })
    .then((story) => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser : req.user.id
      }
      //push comments array
      story.comments.unshift(newComment)
      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`)
        })
    })
})

module.exports = router