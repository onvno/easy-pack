module.exports.var = {
    ROOT : "<%path.resolve(__dirname, '../')%>",
    AddAssetHtmlPlugin : "<%require('add-asset-html-webpack-plugin')%>",
    CONST : "<%require('./constant.json')%>"
}

module.exports.config = {
    plugins: [
        "<%new OpenBrowserPlugin({url: 'http://localhost:3333'})%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.devDir}/base-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.devDir}/frame-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new AddAssetHtmlPlugin([\
            { filepath: require.resolve(`../${CONST.devDir}/base`), includeSourcemap: false, hash: true },\
            { filepath: require.resolve(`../${CONST.devDir}/frame`), includeSourcemap: false, hash: true },\
        ])%>",
    ]
}


