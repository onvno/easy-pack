// 测试版本号
const latestVersion = require('latest-version');

var baseAry = ['react', 'koa', 'webpack']
var packObj = {};

const getVersion = async (package) => {
    const version = await latestVersion(package)
    packObj[package] = version;
}
let promises = baseAry.map((pack) => getVersion(pack))
Promise.all(promises)
    .then((data) => {
        console.log("data:", data);
        console.log(packObj)
    })
    .catch((err) => {
        cosole.log("err:", err);
    })
