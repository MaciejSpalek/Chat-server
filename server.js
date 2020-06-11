const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');

app.use(cors());

io.on('connection', socket => {
    const online = Object.keys(io.engine.clients);
    io.emit('users', JSON.stringify(online));
    io.emit('allRooms', getAllRooms());
    io.emit('emptyRooms', getEmptyRooms());
    
    socket.on('disconnect', ()=>{
        const online = Object.keys(io.engine.clients);
        io.emit('users', JSON.stringify(online));
    });

    socket.on('join', object => {
        const { joiningUser, room } = object;
        socket.join(room.id);
        joinTheRoom(io, room, joiningUser);
    });

    socket.on('leave', object => {
        const { leavingUser, room } = object;
        socket.leave(room.id);
        leaveTheRoom(io, room, leavingUser);
    });

});


http.listen(5000, () => console.log('Server started'))