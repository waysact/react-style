var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: "./index.js",
	output: {
		filename: "bundle.js",
		path: __dirname + "/assets",
		publicPath: "assets/"
	},
	module: {
		loaders: [
      { test: /\.js$/, loaders: ['react-style/lib/webpack', 'jsx-loader'] },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
};
