const ExpressError = require('../utils/expressError');
const express = require('express');
const router = express.Router();
const {asyncWrapper, isLoggedIn} = require('../utils/middlewares/shared');
const campground = require('../controllers/campground');
const {validateUser, validateCreateCampground, validateEditCampground} = require('../utils/middlewares/campground');
const multer  = require('multer')
const { storage } = require('../cloudinary');


const upload = multer({ storage});

router.get('/', asyncWrapper(campground.renderIndex));

router.get('/new', isLoggedIn, asyncWrapper(campground.renderNew))

router.post('/', isLoggedIn, upload.array("images"), validateCreateCampground, asyncWrapper(campground.create))

router.put('/:id', isLoggedIn, validateUser, upload.array("images"), validateEditCampground, asyncWrapper(campground.update))

router.get('/:id', asyncWrapper(campground.renderShow))

router.get('/:id/edit', isLoggedIn, validateUser, asyncWrapper(campground.renderEdit))

router.delete('/:id', isLoggedIn, validateUser, asyncWrapper(campground.delete))

module.exports = router;
