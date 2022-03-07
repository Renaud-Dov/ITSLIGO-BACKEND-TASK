const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const MarkdownIt = require('markdown-it');


const news = require('../news.json');

router.get("/", (req, res) => {
    res.render("home", {news:news});
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
        md_it = new MarkdownIt();
        const html = md_it.render(md);

        res.render("blog", {newsItem:newsItem, md:html});
    });
});

module.exports = router;