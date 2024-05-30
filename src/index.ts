import * as http from "http";
import * as path from "path";

const cors = require("cors");
const express = require("express");
const app = express();
const io = require('socket.io');
const cookieParser = require("cookie-parser");

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3002',
    credentials:true
}))

app.get('/', function(req:any, res:any) {
    res.sendFile(path.join(__dirname, 'index.html'))
});
app.get('/route', function(req:any, res:any) {
    // res.cookie('refreshToken', 'testan')
    res.send('Test')
});
app.post('/cookie', function(req:any, res:any) {
    // res.writeHead(200,{
    //     "Access-Control-Allow-Credentials": true,
    //     origin: 'http://localhost:3002'
    // })
    res.cookie('refreshToken', 'testan',{
        httpOnly:true,
        expires: new Date(Date.now() + 3600000)
    })
    console.log(req.cookies.refreshToken)
    res.send('Cookie')
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