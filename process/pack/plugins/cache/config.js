module.exports.var = {
    OpenBrowserPlugin : "<%require('open-browser-webpack-plugin')%>",
}

// 没考虑ts的情况
module.exports.config = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: "<%path.resolve(ROOT, 'src')%>",
                use: ["cache-loader","babel-loader"],
            },
        ]
    }
}