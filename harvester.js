module.exports = function (creep) {
    
        var x = 38;
        var y = 16;
    
        var sources = creep.room.find(FIND_SOURCES);
    
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }
    }
    