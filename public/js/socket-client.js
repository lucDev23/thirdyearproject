const socket = io();
let players = {};

// Escuchar actualización de jugadores
socket.on("updatePlayers", (serverPlayers) => {
	players = serverPlayers;
});
