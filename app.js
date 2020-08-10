const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

//method overider middleware
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//passport configuration
require('./config/passport')(passport);

//load keys
const keys = require('./config/keys.js')

//handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helper/hbs')

//mongoose connection
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err));

//set static path
app.use(express.static(path.join(__dirname, "public")))

//use the handlebars
app.set('views', __dirname + '/views');

app.engine(
    'hbs',
    exphbs({
        helpers: {
            truncate: truncate,
            stripTags: stripTags,
            formatDate: formatDate,
            select: select,
            editIcon: editIcon
        },
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        extname: '.hbs',
    })
);
app.set('view engine', 'hbs');


app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}))

//passport seesion
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser());

//gobal variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// app.use((req, res, next) => {
//   res.locals.content = req.content || null
//   next();
// })

//load routes
const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories');
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(process.env.PORT || 5000, () => {
    console.log('Server Running on 5000');
})