const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /auth/google
router.get('/google', (req, res, next) => {
  console.log('Starting Google authentication');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'  // This forces Google to show the account selection
  })(req, res, next);
});

// @route   GET /auth/google/callback
router.get('/google/callback', (req, res, next) => {
  console.log('Received callback from Google');
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/ecommerce-follow-along',
    successRedirect: 'http://localhost:5173/ecommerce-follow-along/home',
    failureMessage: true
  })(req, res, next);
});

// Debug route to check session
router.get('/check-session', (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  res.json({ 
    authenticated: req.isAuthenticated(),
    user: req.user 
  });
});

module.exports = router;