const express = require('express');
const router = express.Router();
const {asyncWrapper, isLoggedIn} = require('../utils/middlewares/shared');
const {validateUser} = require('../utils/middlewares/user');
const passport = require('passport');
const user = require('../controllers/user');

router.post('/logout', user.logout);

router.get('/register', user.renderRegister);

router.put(':usr/edit', validateUser, asyncWrapper(user.update))

router.delete('/:usr', asyncWrapper(user.delete))

router.get('/login', user.renderLogin);

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true, keepSessionInfo: true }), user.auth);

router.post('/', validateUser, asyncWrapper(user.create));

module.exports = router;
