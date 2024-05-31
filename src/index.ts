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
    origin: 'http://localhost:3001',
    credentials:true,
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
    res.cookie('refresh_token', 'testan',{
        httpOnly:true,
        expires: new Date(Date.now() + 3600000),
        // sameSite: 'none',
        path:'/'
    })
    // res
    //   .writeHead(200, {
    //       "Set-Cookie": "token=encryptedstring; HttpOnly",
    //       "Access-Control-Allow-Credentials": "true"
    //   })
    //   .send();
    res.send('test')
});
app.get('/private', function(req:any, res:any) {
    console.log(req.cookies.refresh_token)
    res.send('private')
});

app.get('/delete', function(req:any, res:any) {
    res.clearCookie('refresh_token', {
        httpOnly:true,
        path:'/'
    })
    res.send('delete')
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