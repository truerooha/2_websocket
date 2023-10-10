const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const {v4: uuid} = require('uuid');
const {writeFile, readFileSync, existsSync} = require('fs'); //TODO попробовать асинхронно

const port = 6969;
const app = express(); // Создаем экземпляр Express приложения
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const clients = {};
const log = existsSync('log') && readFileSync('log')
const messages = JSON.parse(log) || []; //массив всех сообщений чата

wss.on("connection", (ws) => {
    const id = uuid();
    clients[id] = ws;

    console.log('new client connection ${id}');
    ws.send(JSON.stringify(messages));

    ws.on("message", (rawMessage) => {
        const {name, message} = JSON.parse(rawMessage);
        messages.push({name, message});
        for (const clientId in clients) {
            clients[clientId].send(JSON.stringify([{ name, message }]));
        }
    })

    ws.on("close", () => {
        delete clients[id];
        console.log('client ${id} connection is closed');
    })


})

process.on('SIGINT', () => {
    wss.close();
    writeFile('log', JSON.stringify(messages), err => {
        if (err) {
            console.log(err);
        }
        process.exit();
    })
    
})

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})