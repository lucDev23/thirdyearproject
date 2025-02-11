export default class Bismarck extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, socket) {
        super(scene, x, y, "bismarck");

        this.scene = scene;
        this.socket = socket;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajustar el punto de origen y tamaño
        this.setOrigin(0.5, 0.7);
        this.setScale(0.5)
        this.setCollideWorldBounds(true);

        // Aplicar físicas con inercia
        this.setDamping(true);
        this.setDrag(0.98); // Mantiene la inercia pero evita que se deslice demasiado
        this.setMaxVelocity(100); // Límite de velocidad máxima

        // Configurar teclas de control
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Configuración de movimiento
        this.speed = 10; // Velocidad máxima de movimiento
        this.rotationSpeed = 5; // Velocidad de giro
        this.acceleration = 0.05; // Valor inicial de aceleración
        this.currentSpeed = 0; // Velocidad actual del barco
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
                this.currentSpeed += this.acceleration; // Aumenta progresivamente hasta `this.speed`
            }
            this.scene.physics.velocityFromRotation(this.rotation, this.currentSpeed, this.body.velocity);
        } 

        // Si no se presiona W, la velocidad disminuye gradualmente (desaceleración suave)
        else {
            if (this.currentSpeed > 0) {
                this.currentSpeed -= this.acceleration; // Resta aceleración hasta llegar a 0
            } else {
                this.currentSpeed = 0;
            }
            this.scene.physics.velocityFromRotation(this.rotation, this.currentSpeed, this.body.velocity);
        }

        // Enviar posición al servidor
        if (this.socket) {
            this.socket.emit("move", { x: this.x, y: this.y, rotation: this.rotation });
        }
    }
}
