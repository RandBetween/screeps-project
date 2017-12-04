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
    
    if (room == "W75N83") {
        var sources = creep.room.find(FIND_SOURCES);
        
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }

    } else if (room == "W76N83") {
        var sources = creep.room.find(FIND_SOURCES);
        var target = Game.getObjectById("5a239349b45ebf5e61484b8f");
        
        if (creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(x, y);
            }
        } else {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }                
        }

    }
    
};
    