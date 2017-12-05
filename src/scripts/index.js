import Tournament from '~/scripts/Tournament'

const options = {
	rounds: 5,

	image: {
		width: 300,
		height: 200,
	},
}

const getCandidates = (size) => {
	const result = []

	const { width, height } = options.image
	const pixelRatio = window.devicePixelRatio

	for (let i = 0; i < size; i += 1) {
		result.push({
			id: i,
			title: `candidate ${i}`,
			image: {
				url: `https://picsum.photos/${Math.round(width * pixelRatio)}/${Math.round(height * pixelRatio)}/?image=${i}`,
				width,
				height,
			},
		})
	}

	return result
}

const init = () => {
	const container = document.querySelector('#container')
	const candidateTemplate = document.querySelector('#card')

	window.c = candidateTemplate

	const candidates = getCandidates(2 ** options.rounds)

	const tournament = new Tournament({
		container,
		playerTemplate: candidateTemplate,
		players: candidates,
	})

	console.log(tournament)
}

window.addEventListener('load', init)
