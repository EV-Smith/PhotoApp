const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const passport = require('passport');
const ProfileModel = require('../../models/Profile');
const UserModel = require('../../models/User');
const validateProfileInput = require('../../validation/profile');

// @route   POST api/profile
// @desc    Update user profile
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);
        // Check Validation
        if (!isValid) {        
          return res.status(400).json(errors);
        }

        // Get fields
        const profileFields = {};
        const userFields = {};

        profileFields.user = req.user.id;
        userFields.fullName = req.body.name;
        userFields.userName = req.body.userName;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.bio) profileFields.bio = req.body.bio;
        userFields.email = req.body.email;      
        if (req.body.phoneNumber) profileFields.phoneNumber = req.body.phoneNumber;
        if (req.body.gender) profileFields.gender = req.body.gender;
        if (req.body.location) profileFields.location = req.body.location;    
        
        ProfileModel.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
        ). then(profile => {
            res.json(profile);

            // Update users model also if name/username/email is updated here      
            UserModel.findByIdAndUpdate(
                req.user.id, 
                {$set: userFields}
                // Another way to write above 
                //   {$set: {
                //     fullName:  req.body.name,
                //     userName: req.body.userName,
                //     email: req.body.email
                //   }}
                ).then()
                .catch(err => console.log(err))
                }
            )           
        .catch(errUpdatingProfileModel=> console.log(errUpdatingProfileModel));
    }
);

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
  
      ProfileModel.findOne({ user: req.user.id })
        .populate('user', ['fullName', 'userName', 'email', 'avatar'])
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err => res.status(404).json(err));
    }
  );

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
    const errors = {};
  
    ProfileModel.find()
      .populate('user', ['userName', 'email', 'avatar'])
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }  
        res.json(profiles);
      })
      .catch(err => res.status(404).json({ profile: "There are no profiles" }));
  });

// @route   GET api/profile/email/:emailParam
// @desc    Get profile by email
// @access  Public
router.get("/email/:emailParam", (req, res) => {
    const errors = {};
  
    UserModel.findOne({ email: req.params.emailParam })      
      .then(userFound => {
        if (!userFound) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }         
        // res.json(userFound);

        ProfileModel.findOne({user: userFound.id})
         .populate('user', ['userName', 'email', 'avatar'])
         .then(profileFound => {
             if(!profileFound){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
             }
             res.json(profileFound);
         })

      })
      .catch(err => res.status(404).json(err));
  });

// @route   GET api/profile/username/:userNameParam
// @desc    Get profile by username
// @access  Public
router.get("/userName/:userNameParam", (req, res) => {
    const errors = {};
  
    UserModel.findOne({ userName: req.params.userNameParam })      
      .then(userFound => {
        if (!userFound) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }              

        ProfileModel.findOne({user: userFound.id})
         .populate('user', ['userName', 'email', 'avatar'])
         .then(profileFound => {
             if(!profileFound){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
             }
             res.json(profileFound);
         })

      })
      .catch(err => res.status(404).json(err));
  });

// @route   GET api/profile/user/:useridParam
// @desc    Get profile by user ID
// @access  Public
router.get("/userId/:userIdParam", (req, res) => {
    const errors = {};
  
    ProfileModel.findOne({ user: req.params.userIdParam })
      .populate('user', ['userName', 'email', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }  
        res.json(profile);
      })
      .catch(err => res.status(404).json({ profile: "There is no profile for this user" }));
  });  

// @route   DELETE api/profile
// @desc    Delete profile and also user
// @access  Private
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        ProfileModel.findOneAndRemove({ user: req.user.id })
            .then(() => {
                    UserModel.findOneAndRemove({ _id: req.user.id })
                        .then(() =>
                                res.json({ success: true })
                             )
                        .catch(errDeletingUser => console.log(errDeletingUser)
                    )
            .catch(errDeletingProfile => console.log(errDeletingProfile));                             
      });
    }
  );

module.exports = router;