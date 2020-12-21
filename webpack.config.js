const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './views/alfaview/main.js',
  output: {
    path: './public/',
    filename: 'build/js/alfaview-wb.js',
  },
  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'public/javascripts/vue.js'),
      javascripts: path.resolve(__dirname, 'public/javascripts'),
    },
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel',
      },
    ],
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime', 'transform-object-rest-spread'],
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
} else {
  module.exports.devtool = '#source-map'
}
