const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const campgroundRouter = require('./routes/campgrounds');
const rewviewRouter = require('./routes/reviews');
const userRouter = require('./routes/user');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oidc');

const ExpressError = ('./utils/ExpressError');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sessionConfig = {
  secret: 'thisisnotagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressSession(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', rewviewRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/test', (req, res) => {
  res.render('test');
})

// app.post('/test', upload.array("testfile"), (req, res) => {
//   console.log(req.files);
//   res.redirect('/test');
// })

app.use(function(req, res, next) {
  res.status(404).render('notFound');
});

app.use((error, req, res, next) => {
  console.log(error);
  res.send(error.message);
})

app.listen(3000, ()=> {
  console.log('Serving on port 3000')
})
