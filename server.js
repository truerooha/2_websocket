const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const port = 6969;
const app = express(); // Создаем экземпляр Express приложения
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const clients = {};
const messages = []; //массив всех сообщений чата

wss.on("connection", (ws) => {
    const id = uuid();
    clients[id] = ws;

    console.log('new client connection ${id}');

    ws.on("message", (rawMessage) => {
        const {name, message} = JSON.parse(rawMessage);
        messages.push({name, message});
        for (const clientId in clients) {
            clients[clientId].send(JSON.stringify({ name, message })); // Отправляем сообщение всем клиентам
        }
    })

    ws.on("close", () => {
        delete clients[id];
        console.log('client ${id} connection is closed');
    })


})

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})