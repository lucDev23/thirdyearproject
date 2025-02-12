import { Player } from '../models/Player.js';

const players = new Map();

export function setupGameSocket(io) {
    io.on('connection', (socket) => {
        console.log(`Jugador conectado: ${socket.id}`);

        socket.on('join-game', () => {
            console.log(socket.id)
        });

        // Escuchar movimientos y actualizar a todos los jugadores
        socket.on('move', ({ x, y, rotation }) => {
            const player = players.get(socket.id);
            if (player) {
                player.move(x, y, rotation);
                io.emit('update-players', Array.from(players.values()));
            }
        });

        socket.on('disconnect', () => {
            players.delete(socket.id);
            console.log(`Jugador desconectado: ${socket.id}`);
            io.emit('update-players', Array.from(players.values()));
        });
    });
}
