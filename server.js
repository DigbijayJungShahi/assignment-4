/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Digbijay Jung Shahi ID: 120180237
*
* Published URL: https://web322-assignment-2-etoe-iy4lpwis9-mat0123s-projects.vercel.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
legoData.Initialize();
legoData.getAllSets();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');  // Set EJS as the view engine
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/lego/sets", (req, res) => {
    const query = req.query.theme;
    const decodedQuery = decodeURIComponent(query);

    if (query) {
        legoData.getSetsByTheme(decodedQuery)
            .then((data) => res.render("sets", { sets: data }))
            .catch((err) => {
                res.status(404);
                res.send(err);
            });
    } else {
        legoData.getAllSets()
            .then((data) => res.render("sets", { sets: data }))
            .catch((err) => {
                res.status(404);
                res.send(err);
            });
    }
});

app.get("/lego/sets/:num", (req, res) => {
    const param = req.params.num;

    legoData.getSetByNum(param)
        .then((data) => res.render("set", { set: data }))
        .catch((err) => {
            res.status(404);
            res.send(err);
        });
});

app.use((req, res, next) => {
    res.status(404);
    res.render("404");
});

app.listen(8888);
