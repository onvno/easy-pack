const webpack = require('webpack');
const path = require('path');
const ROOT = path.resolve(__dirname, '../');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const Libs = {
    // ui: ['antd'],
    base: [
        'lodash',
        'immutable',
        'moment',
        'axios',
        'qs'
    ],
    frame: [
        'babel-polyfill',
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'react-router-dom'
    ],
}

// const vendor = [
//     'react',
//     'react-dom',
//     'react-router-dom',
//     'redux',
//     'react-redux',
//     'lodash'
// ]

const isProEnv = process.env.NODE_ENV === 'production';
const outputPath = isProEnv ? path.resolve(ROOT, 'dist') : path.resolve(ROOT, 'dev'); 

const DllConfig = {
    entry: {...Libs},
    // entry: {
    //     "lib": vendor
    // },
    output: {
        filename: '[name].js',
        path: outputPath,
        library: '[name]',
        publicPath: '/'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(ROOT, outputPath, '[name]-manifest.json'),
            name: '[name]',
            context: ROOT
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
}

if (isProEnv) {
    DllConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            beautify: false,
            comments: false
        },
        compressor: {
            warnings: false
        }
    }))
}

module.exports = DllConfig;