const path = require("path");
const WebpackNotifierPlugin = require('webpack-notifier');
const Webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./components/app.js']
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    publicPath: "/assets/",
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    { 
      test: /\.html$/, 
      loader: "underscore-template-loader" 
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new WebpackNotifierPlugin({title: 'Webpack'}),
    new Webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  devServer: {
    contentBase: './public'
  }
};

