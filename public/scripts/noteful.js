/* global $ store api */
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */

  function searchApiCreate(currentSearch) {
    console.log('no DRY search');

    api.search(currentSearch)
      .then(updateResponse => {
        store.notes = updateResponse;
        render();
      });
      
  }

  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId)//Promise
        .then(detailsResponse => {
          store.currentNote = detailsResponse;
          render();
        });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      searchApiCreate(store.currentSearchTerm);

    });
  }

  // function handleNoteFormSubmit() {//Another way
  //   $('.js-note-edit-form').on('submit', function (event) {
  //     event.preventDefault();

  //     const editForm = $(event.currentTarget);

  //     const noteObj = {
  //       title: editForm.find('.js-note-title-entry').val(),
  //       content: editForm.find('.js-note-content-entry').val()
  //     };

  //     noteObj.id = store.currentNote.id;

  //     api.update(noteObj.id, noteObj, updateResponse => {
  //       store.currentNote = updateResponse;
  //       store.updateNote(updateResponse);

  //       render();
  //     });

  //   });
  // }


  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();
  
      const editForm = $(event.currentTarget);
  
      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };
  
      if (store.currentNote.id) {


        api.update(store.currentNote.id, noteObj)//Promise
          .then(updateResponse => {
            store.currentNote = updateResponse;
          });
        
        searchApiCreate(store.currentSearchTerm);
  
       
  
      } else {
  

        api.create(noteObj)//Promise
          .then(updateResponse => {
            store.currentNote = updateResponse;
        
          });
  
        searchApiCreate(store.currentSearchTerm);
        
      }
  
    });
  }




  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();
      store.currentNote = false;
      render();
    });
  }

  function handleNoteDeleteClick() {
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      event.preventDefault();
      const id = $(event.currentTarget).closest('li').attr('data-id');

      
      api.delete(id)//Promise
        .then(function() {
          store.findAndDelete(id);
      
          render();
        });

    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDeleteClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
    searchApiCreate
  };

}());
