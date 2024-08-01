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

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, updateSet, deleteSet, getAllThemes } = require('./modules/legoSets');

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/lego/sets');
});

app.get('/lego/sets', (req, res) => {
  getAllSets()
    .then(sets => res.render('legoSets', { sets }))
    .catch(err => res.status(404).render('404', { message: err }));
});

app.get('/lego/addSet', (req, res) => {
  getAllThemes()
    .then(themes => res.render('addSet', { themes }))
    .catch(err => res.status(404).render('404', { message: err }));
});

app.post('/lego/addSet', (req, res) => {
  addSet(req.body)
    .then(() => res.redirect('/lego/sets'))
    .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
});

app.get('/lego/editSet/:set_num', (req, res) => {
  Promise.all([getSetByNum(req.params.set_num), getAllThemes()])
    .then(results => res.render('editSet', { set: results[0], themes: results[1] }))
    .catch(err => res.status(404).render('404', { message: err }));
});

app.post('/lego/editSet', (req, res) => {
  updateSet(req.body)
    .then(() => res.redirect('/lego/sets'))
    .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
});

app.post('/lego/deleteSet/:set_num', (req, res) => {
  deleteSet(req.params.set_num)
    .then(() => res.redirect('/lego/sets'))
    .catch(err => res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` }));
});

app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found" });
});

initialize()
  .then(() => app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`)))
  .catch(err => console.log(`Unable to start server: ${err}`));
