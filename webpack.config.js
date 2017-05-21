const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.js',
        'webpack/hot/dev-server'
    ],
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    resolve: ['', 'js', 'jsx', 'less', 'css'],
    modulesDirectories: ['node_modules'],
    devServer: {
        proxy: {
            '/url*': {
                target: 'http://localhost:3000',
                secure: false
            }
        },
        hot: true
    },
    plugins: [new HtmlWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
    module: {
        loaders: [
            {
                test: /\.js|jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.woff(2)?(\?[a-z0-9]+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }
        ]
    }
};