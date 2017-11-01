var webpack = require('webpack');
var path = require('path');

module.exports = {
    target: 'node',
    entry: {
        app: ['webpack/hot/dev-server', './build/app/app.js'],
    },
    output: {
        path: path.join(__dirname, './devServer/built'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/built/'
    },
    devServer: {
        contentBase: './devServer',
        publicPath: 'http://localhost:8080/built/'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}