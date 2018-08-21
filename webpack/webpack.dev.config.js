const webpack = require('webpack');
const path = require('path');

const parentDir = path.join(__dirname, '../');

module.exports = {
  // define js entry point i.e. what will be loaded by our base template directly
  watch: true,
  entry: {
    mainBundle: path.join(parentDir, 'js', 'main.js'),
    detailBundle: path.join(parentDir, 'js', 'restaurant_info.js'),
  },
  module: {
    rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader', // turn all .js and jsx files that are not in node_modules into the more compatible es5
    }, {
      test: /\.(css|scss)$/,
      loaders: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader', // compiles Sass to CSS
      ],
    }],
  },
  // defines where all our js will be bundled for use
  output: {
    path: path.join(parentDir, 'js'),
    publicPath: parentDir
  },
  devServer: {
    contentBase: parentDir,
    historyApiFallback: true
  }
};
