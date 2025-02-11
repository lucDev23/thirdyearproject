export default class BismarckMissile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, rotation) {
			super(scene, x, y, "missile");

			this.scene = scene;

			// Agregar el misil a la escena y habilitar físicas
			scene.add.existing(this);
			scene.physics.add.existing(this);

			// Configuración del misil
			this.setScale(0.1);
			this.setRotation(rotation);
			scene.physics.velocityFromRotation(rotation, 300, this.body.velocity); // Velocidad fija

			// Eliminar el misil después de un tiempo
			scene.time.delayedCall(3000, () => {
					this.destroy();
			}, [], this);
	}
}
