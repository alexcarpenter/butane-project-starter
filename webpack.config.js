const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: [
      'lazysizes'
    ],
    main: './src/scripts/main'
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

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourcemap: true,
            compress: {
                warnings: false
            }
        })
    );

    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    );
}
