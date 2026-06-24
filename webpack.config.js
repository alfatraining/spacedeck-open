const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    'alfaview-wb': './views/alfaview/main.js',
    scripts: './views/alfaview/scripts.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'build/js/[name].js',
  },
  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'public/javascripts/vue.js'),
      javascripts: path.resolve(__dirname, 'public/javascripts'),
      common: path.resolve(__dirname, 'common'),
    },
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [],
  optimization:
    process.env.NODE_ENV === 'production'
      ? {
          minimize: true,
          minimizer: [new TerserPlugin()],
        }
      : undefined,
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};
