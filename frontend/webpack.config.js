require('babel-polyfill');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, 'src', 'index.jsx')],
  devServer: {
    contentBase: path.join(__dirname, 'src', 'public'),
    disableHostCheck: true,
    compress: true,
    port: 5000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/public/index.html',
      filename: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ENDPOINT_PORT: JSON.stringify(process.env.ENDPOINT_PORT || 9000),
      },
    }),
    new CopyWebpackPlugin([
      { from: 'src/public/img', to: 'img' },
      { from: 'src/public/favicon.ico', to: 'favicon.ico' },
    ]),
  ],
};
