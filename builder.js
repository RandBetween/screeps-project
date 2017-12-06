module.exports = function (creep, room) {
    
    if (room == "Spawn1") {
        room = "W75N83";
    } else {
        room = "W76N83";
    }    

    var sources = [];
    if (room == "W75N83") {
        sources.push(Game.getObjectById("5a19c44d9bc92518b838df2f"));
    } else if (room == "W76N83") {
        sources.push(Game.getObjectById("5a239349b45ebf5e61484b8f"));
    }
        
    if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {

        for(var i = 0; i < sources.length; i++) {
            if(creep.withdraw(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[i]);
            }
        }

    } else if(creep.memory.harvestPhase == true && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvestPhase = false;
    } else if(creep.memory.harvestPhase == false && creep.carry.energy > 0) {

    var repairit = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {

        return ((structure.structureType == STRUCTURE_ROAD && (structure.hits < 1000 && structure.hits > 0)) ||
                (structure.structureType == STRUCTURE_CONTAINER && (structure.hits < 10000 && structure.hits > 0)));
            }
        });

        if(repairit.length) {
            creep.moveTo(repairit[0]);
            creep.repair(repairit[0]);
        }

    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
        creep.moveTo(targets[0]);
        creep.build(targets[0]);
    }
    
    } else if(creep.memory.harvestPhase == false && creep.carry.energy == 0) {
        creep.memory.harvestPhase = true;
    }
}
    