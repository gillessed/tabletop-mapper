var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    app: ['webpack/hot/dev-server', './app/App.tsx'],
  },
  output: {
    path: path.join(__dirname, './devServer/built'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:9010/built/'
  },
  devServer: {
    contentBase: './devServer',
    publicPath: 'http://localhost:9010/built/',
    port: 9010,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },
  module: {
    rules: [
      { test: /\.(tsx?)$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.(jsx?)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
