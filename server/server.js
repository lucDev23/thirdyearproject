'use strict';

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { APP_CONSTS } from "../config/app-const.js";

const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(express.static(path.join(_dirname, "../public")));
app.use("/phaser", express.static(path.join(_dirname, "../node_modules/phaser/dist")));

app.set("view engine", "ejs");
app.set("views", path.join(_dirname, "views"));

app.get("/", (req, res) => {
    res.render("index");
});

const players = {}; // Almacenar jugadores

const server = app.listen(APP_CONSTS.SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${APP_CONSTS.SERVER_PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`Jugador conectado: ${socket.id}`);

    // Eliminar cualquier jugador anterior con el mismo ID (caso de reconexión)
    if (players[socket.id]) {
        delete players[socket.id];
    }

    // Asignar nueva posición y rotación
    players[socket.id] = { x: Math.random() * 800, y: Math.random() * 600, rotation: 0 };

    // Enviar lista de jugadores actualizada
    io.emit("updatePlayers", players);

    // Mover jugador
    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].rotation = data.rotation;
            io.emit("updatePlayers", players);
        }
    });

    // Manejar disparos
    socket.on("fireMissile", (missileData) => {
        io.emit("spawnMissile", missileData);
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
		console.log(`Jugador desconectado: ${socket.id}`);
		delete players[socket.id]; // Eliminar del servidor
		io.emit("updatePlayers", players); // Enviar actualización a todos
	});	
});
