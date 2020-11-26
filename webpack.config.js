const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
  const MODE = env.mode || 'development';
  const DEV = MODE === 'development';

  return {
    entry: './src/index.js',

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js'
    },

    resolve: {
      modules: [
        'src',
        'node_modules'
      ]
    },

    mode: MODE,

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(png|webmanifest)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      DEV && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),

    optimization: {
      namedModules: true,
      noEmitOnErrors: true
    },

    target: 'web',

    devtool: DEV ? 'eval' : false,

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      host: '0.0.0.0',
      port: 8124,
      historyApiFallback: true,
      hot: true
    }
  };
};
