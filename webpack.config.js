var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: path.join(__dirname, 'example'),
	entry: "./app.js",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "./bundle.js"
	},
	resolve: {
  		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
		  /* set up jsx */
		  {
		    test: /\.jsx?$/,
		    exclude: /node_modules/,
		    loaders: ['babel']
		  },
		   //less
			{
			    test: /\.less$/,
			    loader: 'style!css?sourceMap!postcss!less?sourceMap'
			},
			//sass
			{
				test: /\.scss$/,
				loader: 'style!css?sourceMap!postcss!sass?sourceMap'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin()
	]
}