// react demo
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

let root = document.getElementById('root');

ReactDOM.render(
    <div>
        <h1>Hello, <span>EasyPack!</span></h1>
        <p>有更赞的点子，来EasyPack讨论群聊聊吧</p>
        <img src={require('./assets/img/qqgroup.png')} />
    </div>,
    root
)

