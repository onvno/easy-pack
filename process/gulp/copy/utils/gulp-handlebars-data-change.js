const through = require('through2');
const fs = require('fs');
const path = require('path');

const templateDataChange = () => {
    return through.obj(function(file, encoding, callback) {
        const fileName = path.basename(file.path);
        let dataPath;

        if(fileName.lastIndexOf('.')) {
            const fileNameOnly = fileName.slice(0, fileName.lastIndexOf('.'));
            dataPath = path.resolve(path.dirname(file.path), `${fileNameOnly}.data.json`)
        } else {
            dataPath = path.resolve(path.dirname(file.path), 'data.json');
        }

        templateData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // console.log("templateData:", templateData);
        callback(null, file);
    });
}

module.exports = templateDataChange;