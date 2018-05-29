module.exports.var = {
    HtmlWebpackPlugin : "<%require('html-webpack-plugin')%>",
}

module.exports.config = {
    plugins: [
        "<%new HtmlWebpackPlugin({\
            filename: 'index.html',\
            template: './src/index.html',\
            inject: 'body',\
            favicon: './src/assets/img/favicon.png'})%>"
    ]
}