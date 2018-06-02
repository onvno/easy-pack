module.exports.var = {
    path : "<%require('path')%>",
    webpack : "<%require('webpack')%>"  ,  
    CONST : "<%require('./constant.json')%>",
    ROOT : "<%path.resolve(__dirname, '../')%>",
}


module.exports.config = {
    mode: 'production',

    devtool: false,

    entry: {
        index: "./src/index.js"
    },

    output: {
        path: "<%path.resolve(ROOT, `${CONST.buildDir}`)%>",
        filename: '[name].[chunkhash:5].js',
        publicPath: '/'
    },

    resolve: {
        extensions: [".jsx", ".js", ".tsx", ".ts", ".vue"],
        alias: {
            src: "<%path.resolve(ROOT, 'src')%>",
            components: "<%path.resolve(ROOT, 'src/components')%>",
            containers: "<%path.resolve(ROOT, 'src/containers')%>",
            assets: "<%path.resolve(ROOT, 'src/assets')%>",
            routers: "<%path.resolve(ROOT, 'src/routers')%>",
        }
    },
    externals: {},

    plugins: [],
}