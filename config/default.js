module.exports = {
	webpack: {
		host: '0.0.0.0',
		port: 3000,
		devtool: 'source-map',
	},

	client: {
		rounds: 4,

		img: {
			width: 400,
			height: 300,
		},
	},
}
