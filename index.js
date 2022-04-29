const express = require('express');
const cookieParser = require('cookie-parser');
const home = require('./routes/home');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.use(express.static('public'));
const config = require('./config.json');
app.use(cookieParser(config.cookieSecret));

app.engine('handlebars', handlebars.engine);
app.set('view engine', "handlebars")

app.use(express.urlencoded({ extended: true }))


app.use(session(
    {secret: config.sessionSecret,
        cookie: { maxage: 6000},
        resave: false,
        saveUninitialized: false
    }))


const connectionString = 'mongodb://127.0.0.1:27017/project';
mongoose.connect(connectionString, {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
}).
catch ( error => {
    console.log('Database connection refused' + error);
    process.exit(2);
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log("DB connected")
});


app.use('/', home);



// custom 400 page
app.use((req, res) => {
    res.status(404);
    res.render('404', {FULLSCREEN: true});
});

//custom 500 page
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500', {FULLSCREEN: true});
});
const PORT = process.env.PORT_ITSLIGO ? process.env.PORT_ITSLIGO : 3000
const HOST = process.env.HOST_ITSLIGO ? process.env.HOST_ITSLIGO : 'localhost'
app.listen(PORT, HOST);
console.log(`Listening on ${HOST}:${PORT}`);