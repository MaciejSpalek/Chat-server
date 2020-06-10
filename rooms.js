const allRooms = [];
const emptyRooms = [];


const addRoom = (array, element) => {
    array.push(element);
}

const removeRoom = (array, elementID) => {
    const index = array.findIndex(element => element.id === elementID);
    array.splice(index, 1);
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

module.exports = {  
    getAllRooms, 
    getEmptyRooms
};