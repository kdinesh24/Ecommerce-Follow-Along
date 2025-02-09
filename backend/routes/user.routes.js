const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/user.controller");

router.post('/signup', signup);
router.post('/login', login);

router.get('/check-auth', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }
    User.findById(req.session.userId)
      .select('-password')
      .then(user => {
        if (!user) {
          return res.status(401).json({ msg: 'User not found' });
        }
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json({ msg: 'Server Error' });
      });
  });
  
  // Update profile
  router.put('/update-profile', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }
    
    try {
      const { name, email } = req.body;
      
      // Check if email is being changed and is already in use
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.session.userId } });
        if (existingUser) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
      }
      
      const user = await User.findByIdAndUpdate(
        req.session.userId,
        { name, email },
        { new: true }
      ).select('-password');
      
      res.json({ msg: 'Profile updated', user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  
  // Logout route (if not already defined)
  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ msg: 'Error logging out' });
      }
      res.json({ msg: 'Logged out successfully' });
    });
  });


  // Optional improvements for your user.routes.js:

// Get current role
router.get('/role', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Not authenticated' });
  }
  User.findById(req.session.userId)
    .select('currentRole')
    .then(user => res.json({ currentRole: user.currentRole }));
});

// Update role
router.put('/role', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Not authenticated' });
  }
  const { role } = req.body;
  User.findByIdAndUpdate(req.session.userId, { currentRole: role }, { new: true })
    .then(user => res.json({ msg: 'Role updated', currentRole: user.currentRole }));
});

module.exports = router;