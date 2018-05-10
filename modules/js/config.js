module.exports.var = {}

module.exports.config = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: "<%path.resolve(ROOT, 'src')%>",
                use: ["cache-loader", "babel-loader"],
            },
        ]
    }
}