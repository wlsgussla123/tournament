import model from '~/scripts/model'

const options = process.env.CONFIG

const elements = {}

/**
 * Data of the tournament and current match.
 * The view will be updated automatically when its `match` property is changed. (one-way binding)
 *
 * @property {player[][]} results          - Every winners of each matches.
 * @property {number}     round            - Current round. (start at 0)
 * @property {number}     match            - Current match of the round. (start at 0)
 * @property {player[]}   players          - (getter) Current 2 players.
 * @property {number}     competitorsCount - (getter) Competitors of current round.
 */
const data = new Proxy({
	results: [],
	round: undefined,
	match: undefined,
}, {
	get: (target, property, receiver) => {
		let result

		switch (property) {
			case 'players':
				result = [
					target.results[target.round][(target.match * 2) + 0],
					target.results[target.round][(target.match * 2) + 1],
				]

				break
			case 'competitorsCount':
				result = target.results[target.round].length

				break
			default:
				// The default behavior
				result = target[property]
		}

		return result
	},

	set: (target, property, value, receiver) => {
		// The default behavior
		target[property] = value // eslint-disable-line no-param-reassign

		// Update the view
		if (property === 'match') {
			// Update the title
			const title = receiver.competitorsCount === 2 ?
				'Final' :
				`Round of ${receiver.competitorsCount}, Match ${target.match + 1}`

			elements.title.textContent = title

			// Update the players
			receiver.players.forEach((player, index) => {
				elements.players[index].setAttribute('title', `Choose ${player.name}`)

				elements.playerImgs[index].removeAttribute('src') // TODO: Improve UX

				elements.playerImgs[index].setAttribute('src', player.img.url)
				elements.playerImgs[index].setAttribute('width', player.img.width)
				elements.playerImgs[index].setAttribute('height', player.img.height)
				elements.playerImgs[index].setAttribute('alt', `An image of ${player.name}`)

				elements.playerFigcaptions[index].textContent = player.name
			})

			// Toggle the back button
			elements.backBtn.classList.toggle('hidden', target.round === 0 && target.match === 0)
		}

		// Indicate success
		return true
	},
})

/**
 * Expose some variables for debug.
 * This block will be eliminated from production bundle.
 */
if (process.env.NODE_ENV === 'development') {
	window.t = {
		data,
	}
}

/**
 * Load the next or the previous match.
 *
 * @param {object}  options
 * @param {boolean} options.prev - Load previous match if truthy,
 *                                 load next match if falsy.
 */
const loadMatch = ({ prev = false } = {}) => {
	if (!prev) {
		if (data.match < (data.competitorsCount / 2) - 1) {
			data.match += 1
		} else {
			data.round += 1
			data.match = 0
		}
	} else {
		if (data.match > 0) { // eslint-disable-line no-lonely-if
			data.match -= 1
		} else {
			data.round -= 1
			data.match = (data.competitorsCount / 2) - 1
		}
	}
}

/**
 * Show the champion.
 *
 * @param {player} champion - The champion.
 */
const showChampion = (champion) => {
	console.log(champion)

	const championElement = document.querySelector('#champion-template').content.children[0]

	const imgElement = championElement.querySelector('img')
	const figcaptionElement = championElement.querySelector('figcaption')

	imgElement.setAttribute('src', champion.img.url)
	imgElement.setAttribute('width', champion.img.width)
	imgElement.setAttribute('height', champion.img.height)
	imgElement.setAttribute('alt', `An image of ${champion.name}`)
	imgElement.setAttribute('title', champion.name)

	figcaptionElement.textContent = champion.name

	elements.container.innerHTML = ''
	elements.container.appendChild(championElement)
}

/**
 * Advance the winner to the next round and load the next match.
 *
 * @param {player} winner - The winner of current match.
 */
const advance = (winner) => {
	const { round, match, competitorsCount } = data

	// Champion
	if (competitorsCount === 2) {
		showChampion(winner)

		return
	}

	data.results[round + 1][match] = winner

	loadMatch()
}

/**
 * Go back and load the previous match.
 */
const goBack = () => {
	// TODO: Remove the last winner from `results`

	loadMatch({ prev: true })
}

/**
 * Initiate the tournament.
 */
const init = async () => {
	// Get the entry from API.
	const entry = await model.getEntry(options.entrySize)

	elements.container = document.querySelector('#container')

	const matchElement = document.querySelector('#match-template').content.children[0]

	elements.backBtn = matchElement.querySelector('#back-btn')
	elements.title = matchElement.querySelector('#match-title')
	elements.players = matchElement.querySelectorAll('.player')
	elements.playerImgs = matchElement.querySelectorAll('.player img')
	elements.playerFigcaptions = matchElement.querySelectorAll('.player figcaption')

	// Prepare rounds and register the players
	for (let i = options.entrySize; i > 1; i /= 2) {
		data.results.push([])
	}

	data.results[0].push(...entry)

	// Bind events
	elements.players.forEach((playerElement, index) => {
		playerElement.addEventListener('click', (event) => {
			event.preventDefault()
			event.currentTarget.blur()

			advance(data.players[index])
		})
	})

	elements.backBtn.addEventListener('click', (event) => {
		event.preventDefault()
		event.currentTarget.blur()

		goBack()
	})

	// Start the tournament
	data.round = 0
	data.match = 0

	elements.container.innerHTML = ''
	elements.container.appendChild(matchElement)
}

window.addEventListener('load', () => init())
