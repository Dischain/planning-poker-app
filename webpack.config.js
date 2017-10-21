const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 8080
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'client/js/app.js')
  ],
  output: {
    path: path.resolve(__dirname, 'client/build'),
    publicPath: '/',
    filename: './js/bundle.js'
  },
  module: {
    loaders: [
      { 
        test: /\.css$/, 
        include: path.resolve(__dirname, 'client/css'), 
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
      { 
        test: /\.js[x]?$/, 
        include: path.resolve(__dirname, 'client/js'), 
        exclude: /node_modules/, loader: 'babel-loader' 
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        loader: "url-loader?limit=10000"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/index.html'), 
      minify: { 
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ],
  postcss: function() {
    return [
      require('postcss-import')({
        onImport: function (files) {
            files.forEach(this.addDependency); 
        }.bind(this)
      }),
      require('postcss-simple-vars')(),
      require('postcss-focus')(),
      require('autoprefixer')({
        browsers: ['last 2 versions', 'IE > 8'] 
      }),
      require('postcss-reporter')({
        clearMessages: true
      })
    ];
  }
};
