export function setupTerrain(scene, horizontalPadding = 25, verticalPadding = 40) {
	// Dibujar los límites visibles
	const graphics = scene.add.graphics();
	graphics.lineStyle(4, 0xff0000, 1); // Color rojo para el borde
	graphics.strokeRect(
		horizontalPadding, 
		verticalPadding, 
		scene.scale.width - horizontalPadding * 2, 
		scene.scale.height - verticalPadding * 2
	);

	// Definir los límites físicos del mundo
	scene.physics.world.setBounds(
		horizontalPadding, 
		verticalPadding, 
		scene.scale.width - horizontalPadding * 2, 
		scene.scale.height - verticalPadding * 2
	);
}
