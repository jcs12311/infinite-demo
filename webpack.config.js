module.exports = {
	entry: "./main.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	resolve: {
    	extensions: ['', '.js', '.jsx']
  	},
	module: {
		loaders: [
		  /* set up jsx */
		  {
		    test: /\.jsx?$/,
		    loaders: ['babel'],
		    include: __dirname
		  }
		]
	},
}