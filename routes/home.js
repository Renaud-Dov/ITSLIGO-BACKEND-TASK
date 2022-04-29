const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const MarkdownIt = require('markdown-it');
const { v4: uuidv4 } = require('uuid');const mongoose = require('mongoose');

const sendMail = require("../lib/mail");


const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    id: Number,
    image: String,
    content: String,
})

const newsModel = mongoose.model('News', newsSchema)

router.get("/", async (req, res) => {
    let lastViewed = undefined;
    let news;
    // get news from db

    news = await newsModel.find().sort({ id: 1 }).limit(5);
    for (let i = 0; i < news.length; i++) {
        news[i] = {
            title: news[i].title,
            description: news[i].description,
            id: news[i].id,
            image: news[i].image,
            content: news[i].content,
        }
    }

    console.log(news);

    if (req.signedCookies.lastViewed) {
        lastViewed = [];
        req.signedCookies.lastViewed.forEach(function (item) {
            lastViewed.push(news[item]);
        });
    }
    res.render("home", {news: news, lastViewed: lastViewed});
});

router.get("/blog/:idPost",async (req, res) => {
    const id = req.params.idPost;
    let newsItem = await newsModel.findOne({id: id});
    newsItem = {
        title: newsItem.title,
        description: newsItem.description,
        id: newsItem.id,
        image: newsItem.image,
        content: newsItem.content,
    }

    // if (newsItem === undefined) {
    //     res.redirect("/");
    // } else {
    //     res.render("blog", {newsItem:newsItem});
    // }
    fetch(newsItem.content).then(response => response.text()).then(md => {
        let md_it = new MarkdownIt();
        const html = md_it.render(md);
        let lastViewed = [];
        if (req.signedCookies.lastViewed) {
            lastViewed = req.signedCookies.lastViewed.slice(-2);
        }
        lastViewed.push(id);
        res.cookie('lastViewed', lastViewed, {signed: true});

        res.render("blog", {newsItem: newsItem, md: html});
    });
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/contact", (req, res) => {
    // reset error and success messages
    res.render("contact");
});

router.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    req.session.staffdata = {name: name, email: email, message: message};
    console.table(req.session.staffdata);

    let error = null;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(email).toLowerCase())) error = "Please enter a valid email address";
    else if (name.length === 0) error = "Please enter your name";
    else if (message.length === 0) error = "Please enter your message";

    if (error) res.render("contact", {staffdata: req.session.staffdata, error: error});
    else sendMail(name, email, message, function (err, data) {
            let option = {};
            if (err) option.error = "There was an error sending your message. Please try again later.";
            else option.success = "Your message has been sent. We will get back to you as soon as possible.";
            res.render("contact", option);
        }
    );
});

router.get("/newArticle", (req, res) => {
    res.render("newArticle");
});

router.post("/newArticle", (req,res) => {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const markdown = req.body.md;
    req.session.article = {title: title, description: description, image: image, markdown: markdown};
    console.table(req.session.article);

    let error = null;
    // add new article to database
    const newArticle = new newsModel({
        title: title,
        description: description,
        id: uuidv4(),
        image: image,
        content: markdown,
    });


    res.render("newArticle");

})

module.exports = router;