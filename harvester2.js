module.exports = function (creep, room) {
    
    var x;
    var y;

    if (room == "Spawn1") {
        x = 40;
        y = 42;

    } else if (room == "Spawn2") {
        x = 29;
        y = 35;
    };
    
    var sources = creep.room.find(FIND_SOURCES);
    
    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(x, y);
    }
    
};
    