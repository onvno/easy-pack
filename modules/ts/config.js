module.exports.var = {}

module.exports.config = {
    module: {
        rules: [
            {
				test: /\.tsx?$/,
				use: ['cache-loader','babel-loader','ts-loader'],
				exclude: /node_modules/,
            },
            {
				test: /\.ts?$/,
				use: ['cache-loader','babel-loader','ts-loader'],
				exclude: /node_modules/,
			}
        ]
    }
}