'use strict';

// Módulos nativos de Node.js
import path from "path";
import { fileURLToPath } from "url";

// Módulos de terceros
import express from "express";
import { Server } from "socket.io";

// Módulos internos del proyecto
import { APP_CONSTS } from "../config/app-const.js";
import GameRoutes from "./routes/GameRoutes.js";
import GameSocket from "./sockets/GameSocket.js";

// Obtener __dirname en módulos ES
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Crear la aplicación Express
const app = express();

app.use(express.json()); // Para recibir datos en JSON
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios

// Configuración de archivos estáticos
app.use(express.static(path.join(_dirname, "../public")));
app.use("/phaser", express.static(path.join(_dirname, "../node_modules/phaser/dist")));
app.use("/socket.io", express.static(path.join(_dirname, "../node_modules/socket.io/client-dist")));

// Configuración de EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(_dirname, "views"));

// Definición de rutas
app.get("/", (req, res) => res.render("index2"));
app.get("/index", (req, res) => res.render("index3"));
app.use("/game", GameRoutes);

// Iniciar el servidor
const server = app.listen(APP_CONSTS.SERVER_PORT, () => {
	console.log(`Server running at http://localhost:${APP_CONSTS.SERVER_PORT}`);
});

// Configuración de WebSocket
const io = new Server(server);
new GameSocket(io);
// new ServerSocketManager(io);
