const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: [
      'lazysizes'
    ],
    main: './src/javascripts/main'
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
