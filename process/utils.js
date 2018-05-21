/**
 * 判断路径是否存在
 * 遗弃：部分情况判断错误
 * @param {String} path 
 */
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

/**
 * 正则替换 json
 * @param {*} key 
 * @param {*} value 
 */
function newReplace(key, value) {
    if (value instanceof RegExp){
        // console.log(value.toString().slice(1,-1));
        // console.log(value.toString());
        // console.log("@" + value.toString());
        return ("@" + value.toString());
    }
    else
        return value;
}

/**
 * 数组去除空值
 */
function arrayTrim(arr){  
    const temp = [];
    arr.map((item) => {
        const trimStr = item.trim();
        if(trimStr.length > 0) {
            temp.push(trimStr)
        }
    })
    return temp;  
}


module.exports = {
    fsExistsSync: fsExistsSync,
    newReplace: newReplace,
    arrayTrim: arrayTrim,
};

