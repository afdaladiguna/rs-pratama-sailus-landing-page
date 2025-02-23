/* eslint-disable global-require */
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

const express = require('express');
const path = require('path');
// const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const User = require('./models/user');

// const userRoutes = require('./routes/users');
// const campgroundRoutes = require('./routes/campgrounds');
// const tentangRoutes = require('./routes/tentang');
// const reviewRoutes = require('./routes/reviews');
const dbUrl = process.env.DB_URL;

// mongoose.connect(dbUrl);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
// console.log('Database connected');
// });

const app = express();

app.engine('ejs', ejsMate); // set ejs as engine for express app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // parse the req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   touchAfter: 24 * 60 * 60,
//   crypto: {
//     secret: 'thisshouldbeabettersecret!',
//   },
// });

// store.on('error', function (e) {
//   console.log('session store error', e);
// });

// const sessionConfig = {
//   store,
//   name: 'session',
//   secret: 'thisshouldbeabettersecret!',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     // secure: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// };
// app.use(session(sessionConfig));
app.use(helmet());

const scriptSrcUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://kit.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net',
];
//This is the array that needs added to
const styleSrcUrls = [
    'https://kit-free.fontawesome.com/',
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/',
    'https://cdn.jsdelivr.net',
];
const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: [
                "'self'",
                'blob:',
                'data:',
                'https://res.cloudinary.com/depkm8h6l/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                'https://images.unsplash.com/',
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use('/', userRoutes);
// app.use('/campgrounds/:id/reviews', reviewRoutes);
// app.use('/tentang-kami', tentangRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/tentang-kami', (req, res) => {
    res.render('tentang-kami')
})
app.get('/layanan', (req, res) => {
    res.render('layanan')
})
app.get('/informasi', (req, res) => {
    res.render('informasi')
})
app.get('/berita', (req, res) => {
    res.render('berita')
})
app.get('/hubungi-kami', (req, res) => {
    res.render('hubungi-kami')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    if (!err.message) {
        err.message = 'Oh no, Something Went Wrong!';
    }
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log('Server run on 3000');
});
