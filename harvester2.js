module.exports = function (creep) {
    
        var x = 40;
        var y = 42;
    
        var sources = creep.room.find(FIND_SOURCES);
    
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }
    }
    