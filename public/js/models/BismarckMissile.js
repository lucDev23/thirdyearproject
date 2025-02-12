export default class BismarckMissile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, angle) {
		super(scene, x, y, "bismarck_missile");

		this.scene = scene;

		// Agregar el misil a la escena y habilitar físicas
		scene.add.existing(this);
		scene.physics.add.existing(this);

		if (scene.bismarckMissiles) {
            scene.bismarckMissiles.add(this);
        }

		// Configuración del misil
		this.setScale(0.5);
		this.setRotation(angle);
		
		// Calcular la velocidad basada en el ángulo
		const speed = 50;
		scene.physics.velocityFromRotation(angle, speed, this.body.velocity);

		// Eliminar el misil después de 6 segundos
		scene.time.delayedCall(6000, () => {
			this.destroy();
		}, [], this);
	}
}
