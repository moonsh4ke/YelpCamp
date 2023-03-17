const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncWrapper, isLoggedIn} = require('../utils/middlewares/shared');
const {validateReview, userCanCreate, userCanDelete} = require('../utils/middlewares/review');
const review = require('../controllers/review');

router.delete('/:rid', isLoggedIn, userCanDelete, asyncWrapper(review.delete));

router.post('/', isLoggedIn, userCanCreate, validateReview, asyncWrapper(review.create));

module.exports = router;
