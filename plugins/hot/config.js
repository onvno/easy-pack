module.exports.var = {
    hotMiddlewareScript : "webpack-hot-middleware/client?reload=true",
}

module.exports.config = {
    entry: {
        index: ["babel-polyfill", "./src/index.js", "<%hotMiddlewareScript%>"]
    },
    plugins: [
        "<%new webpack.HotModuleReplacementPlugin()%>",
    ]
}