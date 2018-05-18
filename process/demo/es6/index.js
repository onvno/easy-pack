// es6 demo
import './index.css';
let root = document.getElementById('root');
const innerDom = new Promise((resolve,reject) => {
    if (true) {
        resolve(
            `
                <h1>Hello, <span>EasyPack!</span></h1>
                <p>有更赞的点子，来EasyPack讨论群聊聊吧</p>
                <img src="./assets/img/qqgroup.png" alt="">
            `
        );
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


