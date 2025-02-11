export default class Swordfish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, socket) {
        // Definir un margen de seguridad desde los bordes superior e inferior
        const margin = 50; // Margen de 50 píxeles desde los bordes
        const safeHeight = scene.scale.height - margin; // Altura segura de la pantalla

        // Generar una posición aleatoria en el eje vertical dentro del rango seguro
        const randomY = Phaser.Math.Between(margin, safeHeight); // Ahora no puede estar demasiado cerca de los bordes

        super(scene, scene.scale.width - x, randomY, "airship"); // Posición espejada con Y aleatorio

        this.scene = scene;
        this.socket = socket;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajustar el punto de origen y tamaño
        this.setOrigin(0.5, 0.5); // Centrar el origen en el medio del sprite
        this.setScale(0.8);
        this.setCollideWorldBounds(true);

        // Establecer la forma de colisión como un círculo centrado
        const radius = Math.max(this.width, this.height) / 2;
        // Ahora usamos el offset (0,0) para que la colisión esté centrada
        this.body.setCircle(radius); // Establecer círculo con el radio adecuado

        // Aplicar físicas con inercia
        this.setDamping(true);
        this.setDrag(0.95);
        this.setMaxVelocity(150);

        // Configurar teclas de control
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Configuración de movimiento
        this.speed = 33; // Velocidad máxima de movimiento
        this.rotationSpeed = 0.005; // Velocidad de giro más suave
        this.turnVelocity = 0; // Velocidad de giro actual
        this.turnAcceleration = 0.002; // Aceleración de giro
    }

    update() {
        // Aplicar inercia a la rotación
        if (this.cursors.left.isDown) {
            this.turnVelocity = Math.max(this.turnVelocity - this.turnAcceleration, -this.rotationSpeed);
        } else if (this.cursors.right.isDown) {
            this.turnVelocity = Math.min(this.turnVelocity + this.turnAcceleration, this.rotationSpeed);
        } else {
            this.turnVelocity *= 0.95; // Suavizar el giro cuando no se presionan teclas
        }

        this.rotation += this.turnVelocity;

        // Movimiento hacia adelante automáticamente desde el inicio
        this.scene.physics.velocityFromRotation(this.rotation - Math.PI, this.speed, this.body.velocity);

        // Enviar posición al servidor
        if (this.socket) {
            this.socket.emit("move", { x: this.x, y: this.y, rotation: this.rotation });
        }
    }
}
