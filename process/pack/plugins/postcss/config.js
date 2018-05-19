module.exports.var = {
    path : "<%require('path')%>",
    STATIC : "/"
};

module.exports.config.css = {
    module: {
        rules: [
            {
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			}
        ]
    }
};

module.exports.config.scss = {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "postcss-loader",
                "sass-loader" // compiles Sass to CSS
            ]
        }]
    }
}

module.exports.config.less = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        alias: {
                            "img": "<%path.resolve(STATIC, 'img')%>"
                        }
                    }
                }, {
                    loader: "postcss-loader"
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    }
}