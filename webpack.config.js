const webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output:{
        path: './build',
        filename: 'bundle.js'
    },
    resolve: ['', 'js', 'jsx', 'less'],
    modulesDirectories: ['node_modules'],
    module: {
        loaders: [
            {
                test: /\.js|jsx$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader',
                exclude: /node_modules/
            }
        ]
    }
}