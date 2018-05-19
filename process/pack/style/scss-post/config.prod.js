module.exports.var = {};

module.exports.config = {
    module: {
        rules: [
            {
				test: /\.scss$/,
				use: ['style-loader', 'css-loader?minimize', 'postcss-loader', 'sass-loader']
			}
        ]
    }
};