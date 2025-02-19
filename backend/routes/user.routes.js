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
    updateUserRole,
    getProfile 
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
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/check-auth', authMiddleware, checkAuth);
router.put('/update-profile', [authMiddleware, upload.single('profilePhoto')], updateProfile);
router.get('/role', authMiddleware, getUserRole);
router.put('/role', authMiddleware, updateUserRole);

// Address routes should be in a separate router
const addressRouter = express.Router();
const addressController = require('../controllers/addressController');
const authenticateToken = require('../middleware/addressMiddleware');

addressRouter.post('/', authenticateToken, addressController.addAddress);
addressRouter.get('/', authenticateToken, addressController.getAddresses);
addressRouter.put('/:addressId', authenticateToken, addressController.updateAddress);
addressRouter.delete('/:addressId', authenticateToken, addressController.deleteAddress);

router.use('/addresses', addressRouter);

module.exports = router;