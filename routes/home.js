const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const MarkdownIt = require('markdown-it');


const news = require('../news.json');

router.get("/", (req, res) => {
    let lastViewed = undefined;
    if (req.signedCookies.lastViewed) {
        lastViewed = [];
        req.signedCookies.lastViewed.forEach(function(item) {
            lastViewed.push(news[item]);
        });
    }
    res.render("home", {news: news, lastViewed: lastViewed});
});

router.get("/blog/:idPost", (req, res) => {
    const id = req.params.idPost;
    const newsItem = news.find(item => item.id == id);
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
    res.render("contact");
});

router.post("/contact", (req, res) => {
    console.log("test");
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    res.render("contact", {name: name, email: email, message: message});
});

module.exports = router;