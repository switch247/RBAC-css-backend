const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middlewares/isAuthenticated');


// Define your routes here

// Create a new user
router.post('/',AuthMiddleware.authorize[ 'Admin'], UserController.createUser);

// Get all users
router.get('/', AuthMiddleware.authorize[ 'Admin'], UserController.getAllUsers);

// Get a single user by ID
router.get('/:id', UserController.getUserById);

// Update a user by ID
router.put('/:id', UserController.updateUser);

// Delete a user by ID
router.delete('/:id', AuthMiddleware, UserController.deleteUser);


// Update user roles by ID
router.put('/:id/roles', AuthMiddleware.authorize[ 'Admin'], UserController.updateUserRoles);

module.exports = router;