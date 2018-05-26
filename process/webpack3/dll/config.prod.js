module.exports.var = {
    ROOT : "<%path.resolve(__dirname, '../')%>",
    AddAssetHtmlPlugin : "<%require('add-asset-html-webpack-plugin')%>",
    CONST : "<%require('./constant.json')%>"
}

module.exports.config = {
    plugins: [
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.buildDir}/base-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.buildDir}/frame-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new AddAssetHtmlPlugin([\
            { filepath: require.resolve(`../${CONST.buildDir}/base`), includeSourcemap: false, hash: true },\
            { filepath: require.resolve(`../${CONST.buildDir}/frame`), includeSourcemap: false, hash: true },\
        ])%>"
    ]
}


