var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: path.join(__dirname, 'example'),
	entry: {
		"app": "./app.js",
		"react_app": "./react_app.js"
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].bundle.js"
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
			},
      {
        test: /\.html$/,
        loader: 'html'
      },
    ]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'example/index.html')
		}),
		new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'react_index.html',
      inject: false,
      template: path.join(__dirname, 'example/react_index.html')
    })
	]
}