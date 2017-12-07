const options = process.env.CONFIG

/**
 * A player of the tournament.
 *
 * @typedef  {Object} player     - A player.
 *
 * @property {number} id         - Player's identifier.
 * @property {string} name       - Player's name.
 * @property {Object} img        - Player's image.
 * @property {string} img.url    - Url of the image.
 * @property {number} img.width  - Width of the image. (in pixel)
 * @property {number} img.height - Height of the image. (in pixel)
 */

/**
 * Mock API that returns the entry.
 *
 * @param   {number}   size - Entry size.
 *
 * @returns {player[]}      - The entry.
 */
const getEntry = (size) => {
	const result = []

	const { width, height } = options.img
	const pixelRatio = window.devicePixelRatio

	for (let i = 0; i < size; i += 1) {
		const id = i + 1

		result.push({
			id,
			name: `Player ${id}`,
			img: {
				url: `https://picsum.photos/${Math.round(width * pixelRatio)}/${Math.round(height * pixelRatio)}/?image=${id}`,
				width,
				height,
			},
		})
	}

	return result
}

export default { getEntry }
