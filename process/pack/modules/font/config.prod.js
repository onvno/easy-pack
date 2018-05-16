module.exports.var = {}

module.exports.config = {
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "assets/[name].[hash:8].[ext]"
                    }
                }]
            }
        ]
    }
}