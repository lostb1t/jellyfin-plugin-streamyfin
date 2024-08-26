// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'config.js',
    publicPath: '/web/configurationpage?name='
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['', '.js'],
		// modulesDirectories: [
		//   'node_modules'
		// ]        
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(svg|ttf)$/,
				type: 'asset/resource'
			}
		]
	},
	plugins: [new webpack.optimize.LimitChunkCountPlugin({
		maxChunks: 1,
	}),]
};
