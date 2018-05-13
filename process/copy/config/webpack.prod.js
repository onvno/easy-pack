// base
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const CONST = require('./constant.json');

// 生产阶段
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ROOT = path.resolve(__dirname, '../');

module.exports = {
    devtool: false,

    entry: {
        index: "./src/index.js"
    },

    output: {
        path: path.resolve(ROOT, `${CONST.buildDir}`),
        filename: '[name].[chunkhash:5].js',
        publicPath: '/'
    },
    resolve: {
        extensions: [".jsx", ".js", ".tsx", ".ts"],
        alias: {
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
				use: ['babel-loader','ts-loader'],
                exclude: /node_modules/,
			},

            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(ROOT, "src"),
                use: [ "babel-loader"],
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader?minimize"],
            },

            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader?minimize",
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
                        name: "assets/[name].[hash:8].[ext]"
                    }
                }]
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "assets/[name].[hash:8].[ext]"
                    }
                }]
            }
        ]
    },

    plugins: [
		// 最小化
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			// 使用多进程并行运行和文件缓存来提高构建速度
			parallel: true,
			uglifyOptions: {
				output: {
					// 无注释
					comments: false,
					// 不美化
					beautify: false,
				},
				compress: {
					// 删除未引用的函数和变量
					unused: true,
					// 删除无法访问的代码
					dead_code: true,
					// 对if - s和条件表达式应用优化
					conditionals: true,
					// 例如布尔上下文的各种优化
					booleans: true,
					// 优化do，while并for循环，当我们可以静态确定条件
					loops: true,
					// UglifyJS将假定对象属性访问（例如foo.bar或foo["bar"]）没有任何副作用。指定仅当确定不抛出时才"strict"将其foo.bar视为无效的 foo，即不是null或undefined。
					pure_getters: true,
					// 丢弃不可达代码或未使用的声明时显示警告等
					warnings: false,
					drop_console: true
				},
			}
		}),
        new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			filename: 'vendor.[hash:5].js',
			minChunks: ({ resource }) => {
				resource && resource.indexOf('node_modules') && resource.match(/\.js$/);
			},
		}),
        new webpack.DllReferencePlugin({
            context: ROOT,
            manifest: require(`../${CONST.buildDir}/base-manifest.json`),
            sourceType: 'var'
        }),
        new webpack.DllReferencePlugin({
            context: ROOT,
            manifest: require(`../${CONST.buildDir}/frame-manifest.json`),
            sourceType: 'var'
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
            { filepath: require.resolve(`../${CONST.buildDir}/base`), includeSourcemap: false, hash: true },
            { filepath: require.resolve(`../${CONST.buildDir}/frame`), includeSourcemap: false, hash: true },
        ])
    ]
}