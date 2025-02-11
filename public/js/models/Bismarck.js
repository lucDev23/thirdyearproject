export default class Bismarck extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, socket) {
        super(scene, x, y, "bismarck");

        this.scene = scene;
        this.socket = socket;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajustar el punto de origen para girar más desde adelante
        this.setOrigin(0.5, 0.85);
        this.setScale(0.2);
        this.setCollideWorldBounds(true);

        // Aplicar físicas ajustadas
        this.setDamping(true);
        this.setDrag(0.99); // Menos inercia, pero aún con efecto de deslizamiento
        this.setMaxVelocity(80); // Velocidad máxima reducida

        // Configurar teclas de control
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Configuración de movimiento ajustado
        this.acceleration = 2; // Aceleración lenta
        this.maxSpeed = 80; // Velocidad máxima reducida
        this.rotationSpeed = 0.03; // Gira más suavemente
    }

    update() {
        // Rotación del barco (A y D) → Sin angular velocity
        if (this.cursors.left.isDown) {
            this.rotation -= this.rotationSpeed;
        } else if (this.cursors.right.isDown) {
            this.rotation += this.rotationSpeed;
        }

        // Movimiento hacia adelante con aceleración progresiva
        if (this.cursors.up.isDown) {
            let velocityX = Math.cos(this.rotation) * this.acceleration;
            let velocityY = Math.sin(this.rotation) * this.acceleration;
            this.setVelocity(this.body.velocity.x + velocityX, this.body.velocity.y + velocityY);
        } 
        // Movimiento hacia atrás con menor aceleración
        else if (this.cursors.down.isDown) {
            let velocityX = Math.cos(this.rotation) * -this.acceleration / 2;
            let velocityY = Math.sin(this.rotation) * -this.acceleration / 2;
            this.setVelocity(this.body.velocity.x + velocityX, this.body.velocity.y + velocityY);
        } 
        // Si no hay aceleración, permite que la inercia actúe
        else {
            this.setAcceleration(0);
        }

        // Enviar posición al servidor
        if (this.socket) {
            this.socket.emit("move", { x: this.x, y: this.y, rotation: this.rotation });
        }
    }
}
