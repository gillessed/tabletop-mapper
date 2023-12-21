var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: {
    app: ['./app/app.tsx'],
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: './devServer/built',
      publicPath: 'http://localhost:8080/built/'
    },
    port: 8080,
    liveReload: false,
    hot: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },
  module: {
    rules: [
      { test: /\.(tsx?)$/, loader: 'ts-loader', exclude: /node_modules/ },
      // { test: /\.(jsx?)$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader'},
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader'},
          { loader: 'less-loader'},
        ]
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /canvas|jsdom/, contextRegExp: /konva/ }),
  ],
  externals: [
    'canvas',
    'bufferutil',
    'utf-8-validate',
  ],
}