const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({server});

const clients = {};
wss.on("connection", (ws) => {
    const id = uuid();
    clients[id] = ws;

    console.log('new client connection ${id}');

    ws.on("message", (rawMessage) => {

    })

    ws.on("close", () => {
        delete clients[id];
        console.log('client ${id} connection is closed');
    })


})

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})