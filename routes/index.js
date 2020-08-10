const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helper/authHelper');
const Story = require('../models/Story');
const mongoose = require('mongoose');
// const User = require('../models/User');


router.get('/',ensureGuest, (req, res) => {
  const title = "WelcomePage";
  // res.send("DipakGhuge")
  res.render('index/welcome', {
    title: title
  });
})
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .then(stories => {
      res.render("index/dashboard", {
        stories: stories
      });
    })
  .catch((err) => console.log(err))
})
router.get('/about', (req, res) => {
  res.render("index/about")
})

module.exports = router