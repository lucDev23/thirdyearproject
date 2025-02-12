export class Player {
	constructor(id, type) {
		this.id = id;
		this.type = type; // "ship" o "plane"
		this.position = { x: 0, y: 0 };
		this.rotation = 0;
		this.isAlive = true;
	}

	move(x, y, rotation) {
		this.position.x = x;
		this.position.y = y;
		this.rotation = rotation;
	}

	die() {
		this.isAlive = false;
	}
}
