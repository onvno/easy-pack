const path = require("path");
const webpack = require("webpack");
const prodConfig = require('../config/webpack.config');

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