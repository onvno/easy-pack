const path = require('path');
const STATIC = "/";

// exports.test = {
//     path : require('path'),
//     STATIC : "/"
// }

module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        alias: {
                            "img": path.resolve(STATIC, 'img')
                        }
                    }
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    }
}