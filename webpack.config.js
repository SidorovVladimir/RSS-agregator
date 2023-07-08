import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDev = process.env.NODE_ENV === 'development';

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

const config = {
  entry: './src/index.js',
  output: {
    filename: filename('js'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],

  devServer: {
    port: 5000,
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
export default () => {
  if (isDev) {
    config.mode = 'development';
  } else {
    config.mode = 'production';
  }
  return config;
};
