const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const prodConfig = require('../config/webpack.prod');
// console.dir(config);

webpack(prodConfig, function (err, stats) {
    if (!err) {
      console.log('\n' + stats.toString({
        hash: false,
        chunks: false,
        children: false,
        colors: true
      }));
    } else {
      cconsole.log("err:", err);
    }
});