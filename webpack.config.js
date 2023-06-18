const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

const isProd = !isDev;

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssloaders = (extra) => {
  const loaders = [
    { loader: MiniCssExtractPlugin.loader },
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: () => [
            autoprefixer,
          ],
        },
      },
    },
  ];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],

  devServer: {
    port: 8080,
    hot: isDev,
  },
  module: {
    rules: [
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: cssloaders(),
      },
      {
        test: /\.(scss)$/,
        use: cssloaders({ loader: 'sass-loader' }),
      },
    ],
  },
};
