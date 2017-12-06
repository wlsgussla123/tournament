const options = process.env.CONFIG

const getPlayers = (size) => {
	const result = []

	const { width, height } = options.img
	const pixelRatio = window.devicePixelRatio

	for (let i = 0; i < size; i += 1) {
		const id = i + 1

		result.push({
			id,
			title: `player ${id}`,
			img: {
				url: `https://picsum.photos/${Math.round(width * pixelRatio)}/${Math.round(height * pixelRatio)}/?image=${id}`,
				width,
				height,
			},
		})
	}

	return result
}

export default { getPlayers }
