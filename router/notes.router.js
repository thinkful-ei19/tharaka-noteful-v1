'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  

  notes.filter(searchTerm)//Promise
    .then(list => {
      if(list.length <= 0) next('Not found');
      res.json(list); // responds with filtered array
    })
    .catch(err => {
      return next(err); // goes to error handler
    });
});


  


router.get('/notes/:id', (req, res, next) => {
  //const id = req.params.id;
  const { id } = req.params;


  notes.find(id)//Promise
    .then(item => {
      if (item) {

        res.json(item);
      } else {
        next();//go to 404 error func
      }   
    })
    .catch(err => {
      next();//goes to error handler
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
  
  
  notes.update(id, updateObj)//Promise
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    });
});


// Post (insert) an item
router.post('/notes', (req, res, next) => {

  const { title, content } = req.body;

  const newItem = { title, content };

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }


  notes.create(newItem)//Promise
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    });
});

router.delete('/notes/:id', (req, res, next) => {
  //const id = req.params.id;
  const { id } = req.params;


  notes.find(id)//Promise
    .then(item => {
      if (item) {
        console.log(notes.data.length);
        notes.delete(id, (err, len)=>{
          if(err) {
            return next(err);
          }
          res.json(item);
        });       
      //res.json(item);
      } else {
        next();//go to 404 error func
      }   
    })
    .catch(err => {
      return next(err); // goes to error handler
    });
}); 
  
   
module.exports = router;
