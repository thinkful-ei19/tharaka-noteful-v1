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

  return {
    notes: [],
    currentNote: false,
    currentSearchTerm: '',
    updateNote: updateNote
  };
  
}());
