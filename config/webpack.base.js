const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    page1: './src/pages/page1/index.jsx',
    page2: './src/pages/page2/index.jsx'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]/index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'page1/index.html',
      chunks: ['page1']
      // chunks: ['page1', 'page1/index.css']
    }),
    new HtmlWebpackPlugin({
      filename: 'page2/index.html',
      chunks: ['page2']
    }),
  ],
}