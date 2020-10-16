const allRooms = [];
const emptyRooms = [];

const addRoom = (array, element) => {
    array.push(element);
}

const removeRoom = (array, elementID) => {
    const index = array.findIndex(element => element.id === elementID);
    array.splice(index, 1);
}

const removeUserFromRoom = (array, room, leavingUser) => {
    const foundRoom = array.find(element => element.id === room.id); 
    const roomUsers = foundRoom.users;
    const index = roomUsers.findIndex(element => element === leavingUser);
    roomUsers.splice(index, 1);
}

const addUserToTheRoom = (array, room, joiningUser) => {
    const foundRoom = array.find(element => element.id === room.id); 
    if(foundRoom) {
        const roomUsers = foundRoom.users;
        roomUsers.push(joiningUser);
    }
}

const getAllRooms = () => {
    return allRooms;
}

const getEmptyRooms = () => {
    return emptyRooms;
}

const getGivenRoom = (roomID) => {
    const index = allRooms.findIndex(room => room.id === roomID)
    return allRooms[index];
}

const muliplyEmitting = (io, roomID) => {
    io.emit('allRooms', getAllRooms());
    io.emit('emptyRooms', getEmptyRooms());
    io.emit('room', getGivenRoom(roomID))
}

const getStayingUser = (room, leavingUser) => {
    const users = room.users;
    return users.find(user => user !== leavingUser)
}

const leaveTheRoom = (io, room, leavingUser) => {
    const { id } = room;
    const tempObject = {
        roomID: id,
        stayingUser: getStayingUser(room, leavingUser)
    }
    removeRoom(emptyRooms, id);
    removeRoom(allRooms, id);
    muliplyEmitting(io, id)
    io.emit('removingRoom', tempObject);
}

const joinTheRoom = (io, room, joiningUser) => {
    const { id } = room;
    if(room.users.length === 1) {
        addUserToTheRoom(allRooms, room, joiningUser);
        removeRoom(emptyRooms, id);
        muliplyEmitting(io, id)
    } else { 
        const tempRoom = {
            id,
            users: [joiningUser]
        }
        addRoom(emptyRooms, tempRoom);     
        addRoom(allRooms, tempRoom);
        muliplyEmitting(io, tempRoom.id)
    }
}


module.exports = {  
    getAllRooms, 
    getEmptyRooms, 
    removeUserFromRoom,
    joinTheRoom,
    leaveTheRoom
};