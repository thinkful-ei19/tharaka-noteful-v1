'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    if(list.length <= 0) next('Not found');
    res.json(list); // responds with filtered array
  });
});


  


router.get('/notes/:id', (req, res, next) => {
  //const id = req.params.id;
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err); // goes to error handler
    }
    if (item) {
      res.json(item);
    } else {
      next();//go to 404 error func
    }   
  });
}); 


   

router.put('/notes/:id', (req, res, next) => {
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


// Post (insert) an item
router.post('/notes', (req, res, next) => {
//   console.log('hello from router');
  console.log(req.body);
  const { title, content } = req.body;
  console.log('title', title);
  const newItem = { title, content };
  //console.log(newItem);
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.delete('/notes/:id', (req, res, next) => {
  //const id = req.params.id;
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err); // goes to error handler
    }
    if (item) {
        
      res.json(item);
    } else {
      next();//go to 404 error func
    }   
  });
}); 
  
   
module.exports = router;
