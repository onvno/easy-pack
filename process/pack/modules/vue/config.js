module.exports.var = {
    VueLoaderPlugin : "<%require('vue-loader').VueLoaderPlugin%>"
}

module.exports.config = {
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    },
    plugins: [
        "<%new VueLoaderPlugin()%>",
    ]
}