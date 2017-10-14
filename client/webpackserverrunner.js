const webpack = require('webpack')
    , WebpackDevServer = require('webpack-dev-server')
    , config = require('./makewebpackconfig.js')({ prod: (process.env.NODE_ENV === 'production') });

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true, 
  inline: false,
  historyApiFallback: true,
  quiet: true
}).listen(3002, 'localhost', (err, res) => {
  if (err) return console.log(err);

  console.log('Webpack server listening on localhost:3002');
});