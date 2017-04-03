let webpack = require('webpack')
let path = require('path')

module.exports = {
  entry: {
    vendor: [
      'lazysizes'
    ],
    common: './src/javascripts/common.js',
    index: './src/javascripts/pages/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: [ 'vendor' ]
    })
  ]
}
