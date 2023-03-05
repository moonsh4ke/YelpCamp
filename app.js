const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const campgroundRouter = require('./routes/campgrounds');
const rewviewRouter = require('./routes/reviews');
const expressSession = require('express-session');
const flash = require('connect-flash')

const bcrypt = require('bcrypt');
const ExpressError = ('./utils/ExpressError');
const User = require('./models/user');
const {userSchema} = require('./schemas');
const asyncWrapper = require('./utils/asyncWrapper');


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

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

const validateUser = (req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if (error) {
    console.log("error validating user")
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', rewviewRouter);

app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/users', validateUser, asyncWrapper(async (req, res) => {
  const {username, password} = req.body.user
  const hashedPw = await bcrypt.hash(password, 12);
  const user = new User({username, "password": hashedPw});
  await user.save()
  req.flash('success', 'Successfully created user :D');
  res.redirect('/');
}))

app.put('/users/:usr/edit', validateUser, asyncWrapper(async (req, res) => {
}))

app.delete('/users/:usr', asyncWrapper(async (req, res) => {
}))

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body.login;
  const user = await User.findOne({"username": username});
  if(user) {
    const verified = await bcrypt.compare(password, user.password);
    if(verified) {
      req.flash("success", "Successfully logged in");
      res.redirect("/");
    } else {
      req.flash("error", "Incorrect username or password");
      res.redirect("/login");
    }
  } else {
      req.flash("error", "Incorrect username or password");
      res.redirect("/login");
  }
}));

app.get('/', (req, res) => {
  console.log("hello world!");
  res.render('home');
});

app.get('/test', async (req, res) => {
  const campground = await Campground.find({title: "Sea Canyon"});
  res.send(campground);
})

app.use(function(req, res, next) {
  res.status(404).render('notFound');
});

app.use((error, req, res, next) => {
  res.send(error.message);
})

app.listen(3000, ()=> {
  console.log('Serving on port 3000')
})
