module.exports = function (creep, room) {
    
    if (room == "Spawn1") {
        room = "W8N27";
    } else {
        room = "W76N83";
    }    

    var sources = [];
    if (room == "W8N27") {
        sources.push(Game.getObjectById("607ed0b65b0acb4d3b7d42ca"));
    } else if (room == "W76N83") {
        sources.push(Game.getObjectById("5a2c65ce38f7774da666b123"));
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

        return ((structure.structureType == STRUCTURE_ROAD && (structure.hits < 1500 && structure.hits > 0)) ||
                (structure.structureType == STRUCTURE_CONTAINER && (structure.hits < 15000 && structure.hits > 0)));
            }
    });
    
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

    if(repairit.length) {
        creep.moveTo(repairit[0]);
        creep.repair(repairit[0]);
    } else if(targets.length) {
        creep.moveTo(targets[0]);
        creep.build(targets[0]);
    }
    
    } else if(creep.memory.harvestPhase == false && creep.carry.energy == 0) {
        creep.memory.harvestPhase = true;
    }
}
    