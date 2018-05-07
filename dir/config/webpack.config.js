// base
const path = require('path');
const webpack = require('webpack');
const hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

// 生产阶段
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ROOT = path.resolve(__dirname, '../');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: {
        // utils: ["./src/utils/index.js"],
        index: ["babel-polyfill", "./src/index.js", hotMiddlewareScript]
    },
    output: {
        path: path.resolve(ROOT, 'dev'),
        filename: '[name].[chunkhash:5].js',
        publicPath: '/'
    },
    resolve: {
        extensions: [".jsx", ".js", ".tsx", ".ts"],
        alias: {
            src: path.resolve(ROOT, "src"),
            components: path.resolve(ROOT, "src/components"),
            containers: path.resolve(ROOT, "src/containers"),
            assets: path.resolve(ROOT, "src/assets"),
            routers: path.resolve(ROOT, "src/routers"),
        }
    },
    externals: {},

    module: {
        rules: [
            {
				test: /\.tsx?$|\.ts?$/,
				use: ['cache-loader','babel-loader','ts-loader'],
				exclude: /node_modules/,
			},

            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(ROOT, "src"),
                use: ["cache-loader", "babel-loader"],
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader?minimize", "postcss-loader"],
            },

            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: { javascriptEnabled: true }
                    }
                ],
            },

            {
                test: /\.(png|jpg|gif|svg)/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "[name].[hash:8].[ext]"
                    }
                }]
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash:8].[ext]"
                    }
                }]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
			IS_PRODUCTION: JSON.stringify(false),
			IS_LOCAL: JSON.stringify(JSON.parse(process.env.NODE_ENV || 'false')),
        }),
        new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			filename: 'vendor.[hash:5].js',
			minChunks: ({ resource }) => {
				resource && resource.indexOf('node_modules') && resource.match(/\.js$/);
			},
		}),
        // new webpack.DllReferencePlugin({
        //     manifest: require('../dev/ui-manifest.json'),
        //     sourceType: 'var',
        //     context: ROOT
        // }),
        new webpack.DllReferencePlugin({
            context: ROOT,
            manifest: require('../dev/base-manifest.json'),
            sourceType: 'var'
        }),
        new webpack.DllReferencePlugin({
            context: ROOT,
            manifest: require('../dev/frame-manifest.json'),
            sourceType: 'var'
        }),
        new webpack.NamedModulesPlugin(),
        new OpenBrowserPlugin({
            url: `http://localhost:3333`
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            copmress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            inject: "body",
            // hash: false,
            favicon: "./src/assets/img/favicon.png",
            chunks: ["vendor","index"]
        }),
        new AddAssetHtmlPlugin([
            { filepath: require.resolve('../dev/base'), includeSourcemap: false, hash: true },
            { filepath: require.resolve('../dev/frame'), includeSourcemap: false, hash: true },
        ]),
        new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"development"'
			}
		})
    ]
}