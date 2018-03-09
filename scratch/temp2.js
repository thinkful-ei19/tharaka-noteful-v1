'use strict';
const promise = new Promise((resolve, reject)=>{
  setTimeout(()=>{
    // resolve('data');   
    reject('error'); 
  }, 2000);
});

promise.then(data=>{
  console.log(data);
})
  .catch(err=>{
    console.log(err);
  });
