const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: './src/js/app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
            {
                test: /\.hbs/,
                loader: 'handlebars-loader'
            },
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			}
		]
	},
    plugins: [
        new HtmlWebpackPlugin({
            title: 'geo-response',
            template: 'index.hbs',
            filename: '../index.html'
        }),
    ]
};