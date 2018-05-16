module.exports.var = {
    path : "<%require('path')%>",
    webpack : "<%require('webpack')%>"  ,  
    CommonsChunkPlugin : "<%require('webpack/lib/optimize/CommonsChunkPlugin')%>",
    CONST : "<%require('./constant.json')%>",
    ROOT : "<%path.resolve(__dirname, '../')%>",
}


module.exports.config = {
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
        extensions: [".jsx", ".js", ".tsx", ".ts"],
        alias: {
            src: "<%path.resolve(ROOT, 'src')%>",
            components: "<%path.resolve(ROOT, 'src/components')%>",
            containers: "<%path.resolve(ROOT, 'src/containers')%>",
            assets: "<%path.resolve(ROOT, 'src/assets')%>",
            routers: "<%path.resolve(ROOT, 'src/routers')%>",
        }
    },
    externals: {},

    plugins: [
        "<%new webpack.optimize.UglifyJsPlugin({\
            sourceMap: true,\
            parallel: true,\
            uglifyOptions: {\
                output: {\
                    comments: false,\
                    beautify: false,\
                },\
                compress: {\
                    unused: true,\
                    dead_code: true,\
                    conditionals: true,\
                    booleans: true,\
                    loops: true,\
                    pure_getters: true,\
                    warnings: false,\
                    drop_console: true\
                },\
            }\
        })%>",
        "<%new webpack.optimize.CommonsChunkPlugin({\
            names: ['vendor'],\
            filename: 'vendor.[hash:5].js',\
            minChunks: ({ resource }) => {\
                resource && resource.indexOf('node_modules') && resource.match(/\.js$/);\
            },\
        })%>",
    ]
}