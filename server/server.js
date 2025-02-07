'use strict'

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { APP_CONSTS } from "../config/app-const.js";

const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(_dirname, 'views'));

app.use('/', (req, res) => {
	res.render("index", {title: "Hola"});
});

app.listen(APP_CONSTS.SERVER_PORT, () => console.log('Server running at http://localhost:3000'));
