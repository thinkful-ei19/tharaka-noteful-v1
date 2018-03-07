'use strict';

const { PORT } = require('./config');
const express = require('express');
const logger = require('./middleware/logger');

// const path = require('path');
// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();


// function requestLogger(req, res, next) {
//   const now = new Date();
//   console.log(
//     `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
//   next();
// }

app.use(logger);

app.use(express.static('public'));

app.use(express.json());

// app.get('/', (req, res) => {//How to serve any file
//   console.log('serving index file');
//   res.sendFile(path.join(`${__dirname}/index.html`));
// });

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    if(list.length <= 0) next('Not found');
    res.json(list); // responds with filtered array
  });
});


// app.get('/api/notes', (req, res) => {
//   if (req.query.searchTerm) {
//     const searchTerm = req.query.searchTerm;
//     const filteredData = data.filter(item => item.title.includes(searchTerm));
//     res.json(filteredData);
//   } else {
//     res.json(data);
//   }
// });

app.get('/api/notes/:id', (req, res, next) => {
  //const id = req.params.id;
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err); // goes to error handler
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }   
  });
}); 
  
// app.get('/api/notes/:id', (req, res) => {
//   const id = req.params.id;
//   const note = data.find(item => item.id === parseInt(id));
//   res.json(note);
// }); 


app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});


//TEST
app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});
//TEST


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

