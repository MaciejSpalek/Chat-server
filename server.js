const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');

const { 
    leaveTheRoom, 
    getAllRooms, 
    getEmptyRooms, 
    joinTheRoom
} = require('./rooms');


app.use(cors());

io.on('connection', socket => {
    const online = Object.keys(io.engine.clients);
    io.emit('users', JSON.stringify(online));
    io.emit('allRooms', getAllRooms());
    io.emit('emptyRooms', getEmptyRooms());
    
    socket.on('disconnect', ()=>{
        const leavingUser = socket.id;
        const online = Object.keys(io.engine.clients);
        const theRoomWhereUserIs = getAllRooms().find(room => room.users.includes(leavingUser))
        io.emit('users', JSON.stringify(online));
        if(theRoomWhereUserIs) {
            socket.leave(theRoomWhereUserIs.id);
            leaveTheRoom(io, theRoomWhereUserIs, leavingUser);
        }
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

    socket.on('sendMessage', message => {
        const { 
            room,
            author, 
            text 
        } = message;
        io.to(room.id).emit("message", {author: author, text: text})
    });
});



http.listen(PORT, () => console.log('Server started'))