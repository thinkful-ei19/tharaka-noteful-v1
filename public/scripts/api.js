/* global $ */
'use strict';

const api = {


  search: function (query) {//Promise
    return $.ajax({
      type: 'GET',
      url: '/v1/notes/',
      dataType: 'json',
      data: query
    });
  },

  details: function (id) {//Promise
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/v1/notes/${id}`
    });
  },


  update: function(id, obj) {//Promise
    return $.ajax({
      type: 'PUT',
      url: `/v1/notes/${id}`,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(obj)
    });
  },


  create: function (obj) {//Promise
    return $.ajax({
      type: 'POST',
      url: '/v1/notes',
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(obj)
    });
  },


  delete: function (id) {//Promise
    return $.ajax({
      type: 'DElETE',
      url: `/v1/notes/${id}`,
      contentType: 'application/json',
      dataType: 'json',
      processData: false
    });
  }

//Test
  // api.search(1005)
  // .then(response => {
  //   console.log(response)
  // });

  // api.details(1005)
  // .then(response => {
  //   console.log(response)
  // });

  // api.update(1005)
  // .then(response => {
  //   console.log(response)
  // }); 

  // api.create(1005)
  // .then(response => {
  //   console.log(response)
  // });

  // api.delete(1005)
  // .then(response => {
  //   console.log(response)
  // });

}; 
