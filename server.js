var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.post("/new/news", (req, res) => {
    // First, we grab the body of the html with axios
    let z = req.body.z;
    let resArray = [];
    let iteration = 0;
    axios.get(`https://www.thestar.com.my/tech/tech-news/?pgno=${z}`).then(response => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
        $('.list-listing').each((i, element) => {
            // Save an empty result object
            const result = {};
            result.date = $(element).find("label").text();
            result.title = $(element).find(".f18").text();
            result.link = $(element).find(".f18").find("a").attr("href");
            result.story = $(element).find("p").text();
            result.image = $(element).find("img").attr("src");
            result.note = "No note currently.";
            resArray.push(result);
            // iteration += 1;
            // console.log(iteration);
        })
        res.json(resArray);
    });
});

app.get("/saved/news", (req, res) => {
    db.News.find({}).then(results => {
      res.json(results);
    });
});

app.post("/save/news", (req, res) => {
    db.News.create({
        link: req.body.link,
        date: req.body.date,
        title: req.body.title,
        story: req.body.story,
        image: req.body.image,
        note: req.body.note
    }).then(entry => {console.log(entry); res.json(entry);})
        .catch(err => {
            return res.json(err);    
        });
});

app.post("/delete/news", (req, res) => {
    console.log(req.body)
    db.News.deleteOne({"_id": req.body.deleteId}).then(
        entry => {console.log(entry)}
    )
});

app.post("/comment/news", (req, res) => {
    console.log(req.body)
    db.News.update({"_id": req.body.commentId}, {$set: {"note": req.body.note}}).then(
        entry => {console.log(entry)}
    )
});
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
