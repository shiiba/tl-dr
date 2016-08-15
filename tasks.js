const webpack = require ('webpack'); 
const config = require ('./webpack.config.js');
const webpackMiddleware = require('webpack-dev-middleware');
const compiler = webpack(config);

module.exports = webpackMiddleware(compiler);
