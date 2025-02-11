const express = require("express");
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const { 
    signup, 
    login, 
    logout, 
    checkAuth, 
    updateProfile, 
    getUserRole, 
    updateUserRole 
} = require("../controllers/user.controller");

// Multer configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes - require authentication
router.get('/check-auth', authMiddleware, checkAuth);
router.put('/update-profile', authMiddleware, upload.single('profilePhoto'), updateProfile);
router.get('/role', authMiddleware, getUserRole);
router.put('/role', authMiddleware, updateUserRole);

module.exports = router;