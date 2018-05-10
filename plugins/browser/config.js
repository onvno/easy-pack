module.exports.var = {
    OpenBrowserPlugin : "<%require('open-browser-webpack-plugin')%>",
}

module.exports.config = {
    plugins: [
        "<%new OpenBrowserPlugin({url: 'http://localhost:3333'})%>"
    ]
}