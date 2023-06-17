'use strict'
const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
		clean: true,
  },
	devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
	module: {
    rules: [
			{
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
		],
	},
  plugins: [
    new HtmlWebpackPlugin({
        template: 'index.html',
    }),
  ]
};