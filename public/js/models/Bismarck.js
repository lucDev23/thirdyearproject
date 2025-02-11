import BismarckMissile from "./BismarckMissile.js";

export default class Bismarck extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, socket) {
		super(scene, x, y, "bismarck");

		this.scene = scene;
		this.socket = socket;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Ajustar el punto de origen y tamaño
		this.setOrigin(0.5, 0.7);
		this.setScale(1);
		this.setCollideWorldBounds(true);

		// Aplicar físicas con inercia
		this.setDamping(true);
		this.setDrag(0.98);
		this.setMaxVelocity(100);

		// Configurar teclas de control
		this.cursors = scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE // Tecla de disparo
		});

		// Configuración de movimiento
		this.speed = 6;
		this.rotationSpeed = 3;
		this.acceleration = 0.02;
		this.currentSpeed = 0;

		// Control de disparo
		this.canShoot = true;
		this.shootDelay = 3000; // 500ms entre disparos

		// Capturar la posición del mouse
		this.pointer = this.scene.input.activePointer;
	}

	update() {
		// Rotación del barco (A y D) con inercia
		if (this.cursors.left.isDown) {
			this.setAngularVelocity(-this.rotationSpeed);
		} else if (this.cursors.right.isDown) {
			this.setAngularVelocity(this.rotationSpeed);
		} else {
			this.setAngularVelocity(0);
		}

		// Aceleración progresiva cuando se presiona W
		if (this.cursors.up.isDown) {
			if (this.currentSpeed < this.speed) {
				this.currentSpeed += this.acceleration;
			}
			this.scene.physics.velocityFromRotation(this.rotation, this.currentSpeed, this.body.velocity);
		} else {
			if (this.currentSpeed > 0) {
				this.currentSpeed -= this.acceleration;
			} else {
				this.currentSpeed = 0;
			}
			this.scene.physics.velocityFromRotation(this.rotation, this.currentSpeed, this.body.velocity);
		}

		// Disparo del misil cuando se presiona espacio
		if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.canShoot) {
			this.shootMissile();
		}

		// Enviar posición al servidor
		if (this.socket) {
			this.socket.emit("move", { x: this.x, y: this.y, rotation: this.rotation });
		}
	}

	shootMissile() {
		// Calcular la posición de inicio del misil un poco adelante del barco
		const missileOffset = 50; // Distancia adelante
		const missileX = this.x + Math.cos(this.rotation) * missileOffset;
		const missileY = this.y + Math.sin(this.rotation) * missileOffset;

		// Calcular el ángulo hacia el mouse
		const targetAngle = Phaser.Math.Angle.Between(missileX, missileY, this.pointer.worldX, this.pointer.worldY);

		// Crear el misil
		new BismarckMissile(this.scene, missileX, missileY, targetAngle);

		// Establecer el delay de disparo
		this.canShoot = false;
		this.scene.time.delayedCall(this.shootDelay, () => {
			this.canShoot = true;
		});
	}
}
