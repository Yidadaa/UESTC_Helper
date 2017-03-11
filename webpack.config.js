const webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output:{
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
        }
    },
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
            }
        ]
    }
};