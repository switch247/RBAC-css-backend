const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Define your routes here

// Create a new user
router.post('/', AuthMiddleware.authorize(['ADMIN']),UserController.createUser);
//  
// Get all users
// AuthMiddleware.authorize(['ADMIN']),
router.get('/',AuthMiddleware.authorize(['ADMIN']), UserController.getUsers);

// Get a single user by ID
router.get('/:id',AuthMiddleware.authorize(['ADMIN']), UserController.getUserById);

// Update a user by ID
router.put('/:id', UserController.updateUser);

// Delete a user by ID
router.delete('/:id',AuthMiddleware.authorize(['ADMIN']), UserController.deleteUser);

// Update user roles by ID
router.put(
  '/:id/roles',
  AuthMiddleware.authorize(['ADMIN']),
  UserController.updateUserRoles
);

module.exports = router;
