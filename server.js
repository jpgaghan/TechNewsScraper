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
    //sees if a z has been created from previous run
    
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
            console.log(resArray)
            res.json(resArray);
        });
});

app.get("saved/news", (req, res) => {
    db.News.find({}).then(results => {
      res.json(results);
    });
});

app.post("save/news", (req, res) => {
    db.News.create({
        link: req.body.link,
        date: req.body.date,
        title: req.body.title,
        story: req.body.story,
        image: req.body.image,
        note: req.body.note
    }).then(entry => {res.json(entry);})
        .catch(err => {
            return res.json(err);    
        });
});

// app.



// Route for getting all Articles from the db
// app.get("delete/news", function (req, res) {
//     db.Note.findByIdAndRemove({})
// });

// Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//     // TODO
//     // ====
//     // Finish the route so it finds one article using the req.params.id,
//     // and run the populate method with "note",
//     // then responds with the article with the note included
//     db.Article.find({
//         _id: req.params.id
//     })
//         .populate("note")
//         .then(dbLibrary => {
//             res.json(dbLibrary);
//         })
//         .catch(err => {
//             res.json(err);
//         });
// });
// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function (req, res) {
//     // TODO
//     // ====
//     console.log(req.params.id)
//     db.Note.create(req.body)
//         .then((dbNote) => {
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//         })
//         .then((dbUser) => {
//             res.json(dbUser);
//         })
//         .catch((err) => {
//             res.json(err);
//         })

// });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
