const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const PostModel = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/post');

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const newPost = new PostModel({
      postPhoto: req.body.photo,
      postCaption: req.body.postCaption,
      userName: req.body.userName,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save()
      .then(post =>{
        res.json(post)
      })
      .catch(err => console.log(err));
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
    PostModel.find()
    .sort({postDate: -1})
    .then(posts => {
      if(posts){
        return res.json(posts)
      }
      res.status(404).json({nopostfound: 'No posts found.'})
      })
    .catch(err => console.log(err))
  });

// @route   GET api/posts/:postid
// @desc    GET post by post id
// @access  Public
router.get('.:postid', (req, res) => {
  PostModel.findById(req.params.postid)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with ID ${req.params.postid'})
      );
});

// @route   DELETE api/posts/:postid
// @desc    Delete post with given post id
// @access  Private
router.delete(
  '/:postid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    PostModel.findById(req.params.postid)
      .then(post => {
        if(post){
          console.log('inside post..........')
          console.log(post.user)
          // console.log(req.user.id)
          // Check for post owner. Delete post only if user requesting delete is author of post
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'You can only delete your own posts!'});
          }
          // Delete post
          post.remove()
            .then(() => res.json({ successDeletingPost: true }))
            .catch(errDeletingPost => {
              return res.json({ errorDeletingPost: errDeletingPost})
            });
          } 
          else {
            return res.json({postnotfound: 'No post found'});
          }
      })
      .catch(err => res.json({ error: err }));
  }
);

// @route   POST api/posts/unlike/:postId
// @desc    Dislike post for given postId
// @access  Private
router.post(
  '/dislike/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {     
    PostModel.findById(req.params.postId)
      .then(post => {
        if(post){
          // Check if user alreday disliked the post.
          if (post.dislikes.filter(dislike => dislike.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadydisliked: 'You already disliked this post' });
          }
          // Check if used alreday liked the post. If yes, remove user from likes array
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            // Get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            // Splice out of array
            post.likes.splice(removeIndex, 1);
          }  
               
          //Put user in dislikes array
          post.dislikes.unshift({ user: req.user.id });

          // Save
          post.save().then(post => res.json(post));
        }   
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));      
  }
);

// @route   POST api/posts/comment/:postId
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {       
      return res.status(400).json(errors);
    }

    PostModel.findById(req.params.postId)
      .then(post => {
        const newComment = {
          text: req.body.text,
          userName: req.body.userName,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:postId/:commentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      PostModel.findById(req.params.postId)
      .then(post => {
        // Check to see if comment exists
        if (post.comments.filter(comment => comment._id.toString() === req.params.commentId).length === 0) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);  

module.exports = router;