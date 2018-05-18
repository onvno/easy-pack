module.exports.var = {
    ROOT : "<%path.resolve(__dirname, '../')%>",
    AddAssetHtmlPlugin : "<%require('add-asset-html-webpack-plugin')%>",
    CONST : "<%require('./constant.json')%>"
}

module.exports.config = {
    plugins: [
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.devDllDir}/base-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new webpack.DllReferencePlugin({\
            context: ROOT,\
            manifest: require(`../${CONST.devDllDir}/frame-manifest.json`),\
            sourceType: 'var'\
        })%>",
        "<%new AddAssetHtmlPlugin([\
            { filepath: require.resolve(`../${CONST.devDllDir}/base`), includeSourcemap: false, hash: true },\
            { filepath: require.resolve(`../${CONST.devDllDir}/frame`), includeSourcemap: false, hash: true },\
        ])%>",
    ]
}


