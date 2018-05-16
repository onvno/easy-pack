// react demo
// import React from 'react';
// import ReactDOM from 'react-dom';

// import './index.css'

// let root = document.getElementById('root');

// ReactDOM.render(
//     <div>Hello EasyPack!</div>,
//     root
// )

// es6 demo
import './index.css';
let root = document.getElementById('root');
const innerDom = new Promise((resolve,reject) => {
    if (true) {
        resolve("<div>Hello EasyPack!</div>");
    } else {
        reject(err);
    }   
})
innerDom
    .then((data)=> {
        root.innerHTML = data;
    })
    .catch((err) => {
        console.log(err);
    })
root.innerHTML = '<div>Hello EasyPack!</div>';
