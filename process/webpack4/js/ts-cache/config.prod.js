module.exports.var = {}

module.exports.config = {
    module: {
        rules: [
            {
				test: /\.tsx?$/,
				use: ['babel-loader','ts-loader'],
				exclude: /node_modules/,
            },
            {
				test: /\.ts?$/,
				use: ['babel-loader','ts-loader'],
				exclude: /node_modules/,
			}
        ]
    }
}