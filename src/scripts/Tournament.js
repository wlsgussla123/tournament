class Tournament {
	constructor({ container, playerTemplate, players }) {
		// this.container = container
		// this.players = players

		// this.container.innerHTML = JSON.stringify(players)

		players.forEach((player) => {
			const documentFragment = document.importNode(playerTemplate.content, true)

			const img = documentFragment.querySelector('img')
			const figcaption = documentFragment.querySelector('figcaption')

			img.setAttribute('src', player.image.url)
			img.setAttribute('width', player.image.width)
			img.setAttribute('height', player.image.height)
			img.setAttribute('alt', `An image of ${player.title}`)
			img.setAttribute('title', player.title)

			figcaption.textContent = player.title

			container.appendChild(documentFragment)
		})
	}
}

export default Tournament
