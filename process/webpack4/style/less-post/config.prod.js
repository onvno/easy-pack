module.exports.var = {};

module.exports.config = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader?minimize",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: { javascriptEnabled: true }
                    }
                ],
            },
        ]
    }
};