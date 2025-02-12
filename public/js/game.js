// MODELS
import Bismarck from "./models/Bismarck.js";
import Swordfish from "./models/Swordfish.js";

// HELPERS
import { setupTerrain } from "./helpers/terrain.js";

// SOCKETS
import { joinGame, sendBismarckHitSwordfish, sendSwordfishHitBismarck, setupBismarckSocketListeners, setupSwordfishSocketListeners, socket } from "./sockets/client-socket-manager.js";

const parentDiv = document.getElementById("phaser-game");

const config = {
	type: Phaser.AUTO,
	width: parentDiv.clientWidth,
	height: parentDiv.clientHeight,
	parent: "phaser-game",
	transparent: true,
	physics: {
		default: "arcade",
		arcade: { debug: false }
	},
	scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let bismarck = null;
let airship = null;
let playerRole = null;

function preload() {
	this.load.image("bismarck", "/assets/bismarck.png");
	this.load.image("bismarck_missile", "/assets/bismarck_missile.png");
	this.load.image("airship", "/assets/airship.png");
	this.load.image("airship_missile", "/assets/airship_missile.png");
}

async function create() {
	setupTerrain(this);

	this.bismarckMissiles = this.physics.add.group();
	this.swordfishMissiles = this.physics.add.group();

	playerRole = await joinGame();

	socket.on("create-bismarck", (position) => {
		if (!bismarck) {
			console.log("Creando Bismarck...");
			bismarck = new Bismarck(this, position.x, position.y, socket);
			setupBismarckSocketListeners(bismarck, this);
		}

		this.physics.add.overlap(bismarck, this.swordfishMissiles, (bismarck, missile) => {
			console.log("¡Colisión detectada!");
			missile.destroy();

			sendSwordfishHitBismarck();
		});
	});

	socket.on("create-swordfish", (position) => {
		if (!airship) {
			console.log("Creando Swordfish...");
			airship = new Swordfish(this, position.x, position.y, socket);
			setupSwordfishSocketListeners(airship, this);
		}

		this.physics.add.overlap(airship, this.bismarckMissiles, (airship, missile) => {
			console.log("¡Colisión detectada!");
			missile.destroy();

			sendBismarckHitSwordfish();
		});
	});

	// **Eliminar el Bismarck cuando el servidor lo indique**
	socket.on("remove-bismarck", () => {
		if (bismarck) {
			// console.log("Eliminando Bismarck...");
			bismarck.destroy();
			bismarck = null;
		}
	});

	// **Eliminar el Swordfish cuando el servidor lo indique**
	socket.on("remove-swordfish", () => {
		if (airship) {
			// console.log("Eliminando Swordfish...");
			airship.destroy();
			airship = null;
		}
	});

	socket.on("bismarck-winner", () => {
		const popup = document.getElementById("popup");
		popup.style.display = "block";
	});
	
	// Agregar el listener para cerrar el popup
	document.getElementById("closePopup").addEventListener("click", () => {
		document.getElementById("popup").style.display = "none";
	});
}

function update() {
	if (bismarck && playerRole === "bismarck") {
		bismarck.update();
	}

	if (airship && playerRole === "swordfish") {
		airship.update();
	}
}
