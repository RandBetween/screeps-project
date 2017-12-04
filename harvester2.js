module.exports = function (creep, room) {

    var x;
    var y;

    if (room == "W75N83") {
        x = 40;
        y = 42;
    } else if (room == "W76N83") {
        x = 29;
        y = 35;
    }
    
    var sources = creep.room.find(FIND_SOURCES);

    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(x, y);
    }
    
};
    