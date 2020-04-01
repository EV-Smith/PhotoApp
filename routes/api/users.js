const express = require('express');
const UserModel = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  UserModel.findOne({email: req.body.email})
    .then(user => {
      // If email is already assigned to an existing user
      if (user){
        return res.status(400).json({email: 'Email already exists!'});
      } 
      // If email does not exist in DB, add new user
      else {
        const avatar = gravatar.url(req.body.email, {
          s: 200,
          r: 'pg',
          d: 'mm'
        });
        
        const newUser = new UserModel({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // Replace plain text password with hashed password
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
    // FindOne catch
    .catch(err => console.log(err))
})

module.exports = router;