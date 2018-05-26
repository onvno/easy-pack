module.exports.var = {
    hotMiddlewareScript : "webpack-hot-middleware/client?reload=true",
    path : "<%require('path')%>",
    ROOT : "<%path.resolve(__dirname, '../')%>",
    HtmlWebpackPlugin : "<%require('html-webpack-plugin')%>",
}


module.exports.config = {
    mode: 'development',
    
    devtool: 'cheap-module-eval-source-map',

    entry: {
        index: ["babel-polyfill", "./src/index.js"]
    },
    output: {
        path: "<%path.resolve(ROOT, 'dev')%>",
        filename: '[name].[hash:5].js',
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
    plugins: []
}