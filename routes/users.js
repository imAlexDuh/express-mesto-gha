const usersRouter = require('express').Router();

const {
  getUsers, getUserById, postUsers, updateUserProfile, patchMeAvatar, login, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.get('/signup', postUsers);
usersRouter.get('/signin', login);

usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', patchMeAvatar);
usersRouter.get('/users/me', getCurrentUser);

module.exports = usersRouter;
