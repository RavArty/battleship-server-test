const express = require("express");

const PORT = 4000;
const INDEX = "/index.html";

const app = express();

const server = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));

// socket server
const socket = require("socket.io");
const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	socket.on("reqTurn", (data) => {
		const room = JSON.parse(data).room;
		io.to(room).emit("playerTurn", data);
	});

	socket.on("create", (room) => {
		console.log("create");
		socket.join(room);
	});

	socket.on("join", (room) => {
		console.log("join");
		socket.join(room);
		io.to(room).emit("opponent_joined");
	});

	socket.on("reqRestart", (data) => {
		console.log("start");
		const room = JSON.parse(data).room;
		io.to(room).emit("restart");
	});

	socket.on("reqStartGame", (data) => {
		const room = JSON.parse(data).room;
		io.to(room).emit("startGame", data);
	});
	socket.on("reqGameOver", (room) => {
		console.log("game over");
		io.to(room).emit("gameOver");
	});
});

module.exports = app;
