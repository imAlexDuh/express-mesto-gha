const usersRouter = require('express').Router();

const {
  getUsers, getUserById, postUsers, updateUserProfile, patchMeAvatar,
} = require('../controllers/users.js');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.post('/users', postUsers);

usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', patchMeAvatar);

module.exports = usersRouter;
