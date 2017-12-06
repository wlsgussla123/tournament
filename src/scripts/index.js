import model from '~/scripts/model'

const options = process.env.CONFIG

const elements = {}

// A store contains every match results
const results = []

// Current match's information
const current = new Proxy({}, {
	get: (target, property, receiver) => {
		if (property === 'players') {
			return [
				results[target.round][(target.match * 2) + 0],
				results[target.round][(target.match * 2) + 1],
			]
		}

		// The default behavior
		return target[property]
	},

	set: (target, property, value, receiver) => {
		// The default behavior
		target[property] = value // eslint-disable-line no-param-reassign

		// Update the view
		if (property === 'match') {
			// Update the players
			receiver.players.forEach((player, index) => {
				elements.players[index].setAttribute('title', `Choose ${player.title}`)

				elements.playerImgs[index].removeAttribute('src')

				elements.playerImgs[index].setAttribute('src', player.img.url)
				elements.playerImgs[index].setAttribute('width', player.img.width)
				elements.playerImgs[index].setAttribute('height', player.img.height)
				elements.playerImgs[index].setAttribute('alt', `An image of ${player.title}`)

				elements.playerFigcaptions[index].textContent = player.title
			})

			// Update the title
			const playersLength = results[target.round].length

			const title = playersLength === 2 ?
				'Final' :
				`Round of ${playersLength}, Match ${target.match + 1}`

			elements.title.textContent = title

			// Toggle the back button
			elements.backBtn.classList.toggle('hidden', target.round === 0 && target.match === 0)
		}

		// Indicate success
		return true
	},
})

/**
 * Expose the chart for debug.
 * This code will be eliminated from production bundle.
 */
if (process.env.NODE_ENV === 'development') {
	window.t = {
		results,
		current,
	}
}

const changeMatch = (forward = true) => {
	if (forward) {
		if (current.match < (results[current.round].length / 2) - 1) {
			current.match += 1
		} else {
			current.round += 1
			current.match = 0
		}
	} else {
		if (current.match > 0) { // eslint-disable-line no-lonely-if
			current.match -= 1
		} else {
			current.round -= 1
			current.match = (results[current.round].length / 2) - 1
		}
	}
}

const showChampion = (winner) => {
	const championElement = document.querySelector('#champion-template').content.querySelector('.champion')

	const imgElement = championElement.querySelector('img')
	const figcaptionElement = championElement.querySelector('figcaption')

	imgElement.setAttribute('src', winner.img.url)
	imgElement.setAttribute('width', winner.img.width)
	imgElement.setAttribute('height', winner.img.height)
	imgElement.setAttribute('alt', `An image of ${winner.title}`)
	imgElement.setAttribute('title', winner.title)

	figcaptionElement.textContent = winner.title

	elements.container.innerHTML = ''
	elements.container.appendChild(championElement)
}

const advance = (index) => {
	const winner = current.players[index]

	const { round, match } = current

	// Champion
	if (results[current.round].length === 2) {
		console.log(winner)

		showChampion(winner)

		return
	}

	results[round + 1][match] = winner

	changeMatch()
}

const goBack = () => {
	// TODO: Remove last winner from `results`

	changeMatch(false)
}

const init = async () => {
	const entries = await model.getPlayers(2 ** options.rounds)

	elements.container = document.querySelector('#container')
	elements.backBtn = elements.container.querySelector('#back-btn')
	elements.title = elements.container.querySelector('#match-title')
	elements.players = elements.container.querySelectorAll('.player')
	elements.playerImgs = elements.container.querySelectorAll('.player img')
	elements.playerFigcaptions = elements.container.querySelectorAll('.player figcaption')

	// Prepare rounds and register players
	for (let i = 0; i < options.rounds; i += 1) {
		results.push([])
	}

	results[0].push(...entries)

	// Bind events
	elements.players.forEach((playerElement, index) => {
		playerElement.addEventListener('click', (event) => {
			event.preventDefault()
			event.currentTarget.blur()

			advance(index)
		})
	})

	elements.backBtn.addEventListener('click', (event) => {
		event.preventDefault()
		event.currentTarget.blur()

		goBack()
	})

	// Start the tournament
	current.round = 0
	current.match = 0
}

window.addEventListener('load', () => init())
