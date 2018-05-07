const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const baseConfig = require('../config/webpack.config');
const prodConfig = require('../config/webpack.prod');
const config = merge(baseConfig, prodConfig);
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