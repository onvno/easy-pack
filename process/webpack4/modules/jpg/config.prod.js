module.exports.var = {}

module.exports.config = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "assets/[name].[hash:8].[ext]"
                    }
                }]
            },
        ]
    }
}