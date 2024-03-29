const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

// sets up the topic routes
router.get('/', (req, res) => {
  const categories = ['general', 'memes', 'random', 'games']
  res.render('homepage', {
    categories,
    loggedIn: req.session.loggedIn,
    username: req.session.username
  });

});

// get single post
router.get('/post/:id', (req, res) => {
  console.log("Single post");
  Post.findAll({
    where: {
      id: req.params.id
      // topic: req.params.topic
    },
    attributes: [
      'id',
      'content',
      'title',
      'created_at',
      'topic',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username', 'admin']
        }
      },
      {
        model: User,
        attributes: ['username', 'admin']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = dbPostData[0].get({ plain: true });
      console.log(post);
      res.render('single-post', {
        ...post,
        loggedIn: req.session.loggedIn,
        username: req.session.username
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
//get single
router.get('/posts/:topic', (req, res) => {
  Post.findAll({
    where: {
      // id: req.params.id,
      topic: req.params.topic
    },
    attributes: [
      'id',
      'content',
      'title',
      'created_at',
      'topic',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username', 'admin']
        }
      },
      {
        model: User,
        attributes: ['username', 'admin']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const posts = dbPostData.map(post => post.get({ plain: true }));
      console.log(posts);
      res.render('topic', {
        posts,
        loggedIn: req.session.loggedIn,
        username: req.session.username
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  console.log("login")
  if (req.session.loggedIn) {
    console.log("redirect")
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
