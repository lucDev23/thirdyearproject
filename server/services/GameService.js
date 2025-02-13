class GameService {
	constructor() {
		if (GameService._instance) {
			return GameService._instance;
		}
		
		this.games = [];
		GameService._instance = this;
	}
}