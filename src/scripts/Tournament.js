class Tournament {
	constructor(containerElement, players) {
		this.container = containerElement
		this.players = players

		this.container.textContent = JSON.stringify(players)
	}
}

export default Tournament
