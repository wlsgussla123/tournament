import Tournament from '~/scripts/Tournament'

const containerElement = document.querySelector('#container')

const init = () => {
	const candidates = [1, 2, 3, 4]

	const tournament = new Tournament(containerElement, candidates)

	console.log(tournament)
}

window.addEventListener('load', init)
