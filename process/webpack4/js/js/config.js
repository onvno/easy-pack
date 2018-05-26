module.exports.var = {
    path : "<%require('path')%>",
    ROOT : "<%path.resolve(__dirname, '../')%>"
}

module.exports.config = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: "<%path.resolve(ROOT, 'src')%>",
                use: ["babel-loader"],
            },
        ]
    }
}