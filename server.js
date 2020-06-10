const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');

app.use(cors());

io.on('connection', socket => {
    console.log("user has already logged in")
    const online = Object.keys(io.engine.clients);
    io.emit('users', JSON.stringify(online));
    
    socket.on('disconnect', ()=>{
        console.log("user has already logged out");
        const online = Object.keys(io.engine.clients);
        io.emit('users', JSON.stringify(online));
    });

});


http.listen(5000, () => console.log('Server started'))