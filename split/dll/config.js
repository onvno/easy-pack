module.exports.var = {
    ROOT : "<%path.resolve(__dirname, '../')%>",
    AddAssetHtmlPlugin : "<%require('add-asset-html-webpack-plugin')%>"
}

module.exports.config = {
    plugins: [
        "<%new OpenBrowserPlugin({url: 'http://localhost:3333'})%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require('../dev/base-manifest.json'),\
            sourceType: 'var'\
        })%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require('../dev/frame-manifest.json'),\
            sourceType: 'var'\
        })%>",
        "<%new AddAssetHtmlPlugin([\
            { filepath: require.resolve('../dev/base'), includeSourcemap: false, hash: true },\
            { filepath: require.resolve('../dev/frame'), includeSourcemap: false, hash: true },\
        ])%>",
    ]
}


