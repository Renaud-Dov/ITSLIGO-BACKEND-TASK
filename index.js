const express = require('express');
const cookieParser = require('cookie-parser');
const algoliasearch = require('algoliasearch');
const home = require('./routes/home');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.use(express.static('public'));
app.use(cookieParser("a secret is a secret"));

app.engine('handlebars', handlebars.engine);
app.set('view engine', "handlebars")
app.use(express.urlencoded({ extended: true }))

const client = algoliasearch('RA145A6L8O', '4344303a31c94f8220529b58045196c1');
const index = client.initIndex('new-index-1646933713');

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