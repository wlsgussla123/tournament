import Tournament from '~/scripts/Tournament'

const containerElement = document.querySelector('#container')

const options = {
	rounds: 5,

	image: {
		width: 200,
		height: 300,
	},
}

const getCandidates = (size) => {
	const result = []

	for (let i = 0; i < size; i += 1) {
		result.push({
			id: i,
			image: {
				url: `https://picsum.photos/${options.image.width}/${options.image.height}/?random`,
				width: options.image.width,
				height: options.image.height,
			},
		})
	}

	return result
}

const init = () => {
	const candidates = getCandidates(2 ** options.rounds)

	const tournament = new Tournament(containerElement, candidates)

	console.log(tournament)
}

window.addEventListener('load', init)
