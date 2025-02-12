import AirshipMissile from "./SwordfishMissile.js";

//SOCKET EVENTS
import { sendSwordfishMovement } from "../sockets/client-socket-manager.js";
import { Position } from "./Position.js";

export default class Swordfish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, socket) {
        super(scene, scene.scale.width - x, y, "airship");

        this.scene = scene;
        this.socket = socket;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajustar el punto de origen y tamaño
        this.setOrigin(0.5, 0.5);
        this.setScale(0.8);
        this.setCollideWorldBounds(true);

        // Establecer la forma de colisión como un círculo centrado
        const radius = Math.max(this.width, this.height) / 2;
        this.body.setCircle(radius);

        // Aplicar físicas con inercia
        this.setDamping(true);
        this.setDrag(0.95);
        this.setMaxVelocity(150);

        // Configurar teclas de control
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE // Tecla de disparo
        });

        // Configuración de movimiento
        this.speed = 33;
        this.rotationSpeed = 0.005;
        this.turnVelocity = 0;
        this.turnAcceleration = 0.002;

        // Control de disparo
        this.canShoot = true;
        this.shootDelay = 4000;
    }

    update() {
        // Rotación con inercia
        if (this.cursors.left.isDown) {
            this.turnVelocity = Math.max(this.turnVelocity - this.turnAcceleration, -this.rotationSpeed);
        } else if (this.cursors.right.isDown) {
            this.turnVelocity = Math.min(this.turnVelocity + this.turnAcceleration, this.rotationSpeed);
        } else {
            this.turnVelocity *= 0.95;
        }

        this.rotation += this.turnVelocity;

        // Movimiento hacia adelante
        this.scene.physics.velocityFromRotation(this.rotation - Math.PI, this.speed, this.body.velocity);

        // Disparo del misil cuando se presiona espacio
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.canShoot) {
            this.shootMissile();
        }

        // Enviar posición al servidor
        // if (this.socket) {
        //     this.socket.emit("move", { x: this.x, y: this.y, rotation: this.rotation });
        // }
        sendSwordfishMovement(new Position(this.x, this.y, this.rotation));
    }

    shootMissile() {
        // Calcular la posición de inicio del misil un poco adelante del avión
        const missileOffset = 50;
        const missileX = this.x + Math.cos(this.rotation) * missileOffset;
        const missileY = this.y + Math.sin(this.rotation) * missileOffset;

        // Calcular el ángulo de disparo (invertido)
        const invertedRotation = this.rotation + Math.PI;
        
        // Crear el misil en la posición calculada con la dirección invertida
        const missile = new AirshipMissile(this.scene, missileX, missileY, invertedRotation);
        this.scene.physics.add.existing(missile);

        // Ajustar la velocidad del misil
        const speed = 70;
        this.scene.physics.velocityFromRotation(invertedRotation, speed, missile.body.velocity);

        // Eliminar el misil después de 6 segundos
        this.scene.time.delayedCall(6000, () => {
            missile.destroy();
        });

        // Establecer el cooldown de disparo
        this.canShoot = false;
        this.scene.time.delayedCall(this.shootDelay, () => {
            this.canShoot = true;
        });
    }
}
