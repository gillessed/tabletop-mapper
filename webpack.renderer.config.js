var webpack = require("webpack");
var path = require("path");

module.exports = {
  mode: "development",
  target: "electron-renderer",
  devtool: "inline-source-map",
  entry: {
    app: ["./app/App.tsx"],
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.(tsx?)$/, loader: "ts-loader", exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /canvas|jsdom/,
      contextRegExp: /konva/,
    }),
  ],
  externals: ["canvas", "bufferutil", "utf-8-validate"],
};
