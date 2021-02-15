const { 
    leaveTheRoom, 
    getAllRooms, 
    getEmptyRooms, 
    joinTheRoom
} = require('./rooms');

const socketInstance = (io) => {
    io.on('connection', socket => {
        const leavingUser = socket.id;
        const online = Object.keys(io.engine.clients);
        io.emit('users', JSON.stringify(online));
        io.emit('allRooms', getAllRooms());
        io.emit('emptyRooms', getEmptyRooms());
        
        socket.on('disconnect', ()=>{
            const online = Object.keys(io.engine.clients);
            const theRoomWhereUserIs = getAllRooms().find(room => room.users.includes(leavingUser));
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
    
        socket.on('leave', room => {
            socket.leave(room.id);
            leaveTheRoom(io, room, leavingUser);
        });
    
        socket.on('sendMessage', message => {
            const { 
                room,
                author, 
                text 
            } = message;
            io.to(room.id).emit("message", {author: author, text: text});
        });
    });
}

module.exports = { socketInstance };