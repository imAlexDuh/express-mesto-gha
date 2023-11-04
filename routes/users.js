const usersRouter = require('express').Router();

const {
  getUsers, getUserById, updateUserProfile, patchMeAvatar, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);

usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', patchMeAvatar);
usersRouter.get('/users/me', getCurrentUser);

module.exports = usersRouter;
