module.exports = function (creep, room) {
    
    var x;
    var y;

    if (room == "Spawn1") {
        x = 38;
        y = 16;
        
    } else if (room == "Spawn2") {
        x = 19;
        y = 15;
        
    };
    

    if (room == "Spawn1") {
        var sources = creep.room.find(FIND_SOURCES);

        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }

    } else if (room == "Spawn2") {
        var sources = creep.room.find(FIND_SOURCES);
        var target = Game.getObjectById("5a239349b45ebf5e61484b8f");
        
        if (creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }                
        }

    }
    
};