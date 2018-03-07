// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function(){

  const updateNote = function(note) {
    const id = note.id;
    this.notes.forEach((cur, i)=>{
      if(cur.id === id) {
        this.notes[i] = note;
      }
    });
  };

  const findAndDelete = function(id) {
    // store.notes = store.notes.filter(item => item.id !== id);
    store.notes.splice(id-1000, 1);
  };

  return {
    notes: [],
    currentNote: false,
    currentSearchTerm: '',
    updateNote: updateNote,
    findAndDelete
  };
  
}());
