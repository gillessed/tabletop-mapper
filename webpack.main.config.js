var webpack = require('webpack');
var path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  target: 'electron-main',
  devtool: 'inline-source-map',
  entry: {
    app: ['./electron/main.ts'],
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/, loader: 'ts-loader', exclude: /node_modules/, options: {
          transpileOnly: true,
        },
      },
      { test: /\.(jsx?)$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ]
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /canvas|jsdom/, contextRegExp: /konva/ }),
    new CopyPlugin({
      patterns: [
        { from: 'electron/preload.js' }
      ]
    })
  ],
  externals: [
    { 'sharp': 'commonjs sharp' },
    'canvas',
    'bufferutil',
    'utf-8-validate',
  ],
}