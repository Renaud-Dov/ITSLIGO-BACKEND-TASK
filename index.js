const express = require('express');

const home = require('./routes/home');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', "handlebars")


app.use('/', home);

// custom 400 page
app.use((req, res) => {
    res.status(404);
    res.render('404',{FULLSCREEN:true});
});

//custom 500 page
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500',{FULLSCREEN:true});
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('http://localhost:3000');
});