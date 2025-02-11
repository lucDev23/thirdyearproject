export default class Bismarck extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bismarck");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}
