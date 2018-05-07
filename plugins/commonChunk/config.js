module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			filename: 'vendor.[hash:5].js',
			minChunks: ({ resource }) => {
				resource && resource.indexOf('node_modules') && resource.match(/\.js$/);
			},
		})
    ]
}