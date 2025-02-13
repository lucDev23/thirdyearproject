export default class SwordfishMissile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, angle) {
		super(scene, x, y, "airship_missile");

		this.scene = scene;

		// Agregar el misil a la escena y habilitar físicas
		scene.add.existing(this);
		scene.physics.add.existing(this);

		if (scene.swordfishMissile) {
            scene.swordfishMissile.add(this);
        }

		// Invertir la rotación para disparar en el lado opuesto
		const invertedAngle = angle + Math.PI; // Invertir la dirección

		// Configuración del misil
		this.setScale(0.5);  // Ajustar el tamaño del misil si es necesario
		this.setRotation(invertedAngle);  // Asegura que el misil tenga la rotación correcta

		// Calcular la velocidad basada en el ángulo
		const speed = 50;  // Puedes ajustar la velocidad según sea necesario
		scene.physics.velocityFromRotation(invertedAngle, speed, this.body.velocity);

		// Eliminar el misil después de 6 segundos
		scene.time.delayedCall(6000, () => {
			this.destroy();
		}, [], this);

        
	}
}
