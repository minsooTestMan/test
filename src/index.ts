import * as http from "http";
import * as path from "path";

const cors = require("cors");
const express = require("express");
const app = express();
const io = require('socket.io');

app.use(express.json())
app.use(cors())
app.get('/', function(req:any, res:any) {
    res.sendFile(path.join(__dirname, 'index.html'))
});
app.get('/route', function(req:any, res:any) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.cookie('refreshToken', 'testan', {
        httpOnly: true,
        sameSite: 'none'
    })
    res.send('Test')
});
const httpServer = http.createServer(app);

const socketServer = io(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// type test = {
//     data:string;
// }

const testArr = []

socketServer.on("connection", (socket:any) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('join', (data:any, callback:(err:string)=>void) => {
        console.log(data)
    })
}); // 연결확인

socketServer.on("disconnect", (socket:any) => {
    console.log(`User Disconnect: ${socket.id}`);
    socket.on('join', (data:any, callback:(err:string)=>void) => {
        console.log(data)
    })
}); // 연결확인

httpServer.listen(9000)