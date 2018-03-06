'use strict';

const express = require('express');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();

app.use(express.static('public'));

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

app.get('/api/notes', (req, res) => {
  if (req.query.searchTerm) {
    const searchTerm = req.query.searchTerm;
    const filteredData = data.filter(item => item.title.includes(searchTerm));
    res.json(filteredData);
  } else {
    res.json(data);
  }
});
  
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = data.find(item => item.id === parseInt(id));
  res.json(note);
}); 
