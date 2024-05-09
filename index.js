const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require("./routes");
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require('socket.io')(server , {
    cors:{
        origin:'*'
    }
});

//Middelware

app.use(express.json());
app.use(cors());
app.use("/routes" , routes);

var clients = {};

 // open connection

io.on("connection" , (socket)=>{
    console.log("Connected");
    console.log(socket.id , "has joined");
    socket.on("signin" , (id)=>{
        console.log(id);
        clients[id] = socket;
        console.log(clients);
    })
    socket.on("message" , (msg)=>{
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId]) {
            clients[targetId].emit("message" , msg);
        };
    })
    app.route("/check").get((req , res)=>{
        return res.json("Working");
    });
});

server.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
});