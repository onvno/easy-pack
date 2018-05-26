module.exports.var = {};

module.exports.config = {
    module: {
        rules: [
            {
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			}
        ]
    }
};