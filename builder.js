module.exports = function (creep) {

    sources = [];
    sources.push(Game.getObjectById("57f3b6147c2a512e2cf2533d"));

    if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {

        for(var i = 0; i < sources.length; i++) {
            if(sources[i].store[RESOURCE_ENERGY] > 0) {
                if(creep.withdraw(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[i]);
                }
            }
        }

    } else if(creep.memory.harvestPhase == true && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvestPhase = false;
    } else if(creep.memory.harvestPhase == false && creep.carry.energy > 0) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			creep.moveTo(targets[0]);
			creep.build(targets[0]);
		}

        var repairit = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {

                return ((structure.structureType == STRUCTURE_ROAD && (structure.hits < 2500 && structure.hits > 0)) ||
                        (structure.structureType == STRUCTURE_CONTAINER && (structure.hits < 10000 && structure.hits > 0)));
            }
        });
		if(repairit.length) {
		    creep.moveTo(repairit[0]);
		    creep.repair(repairit[0]);
		}
    } else if(creep.memory.harvestPhase == false && creep.carry.energy == 0) {
        creep.memory.harvestPhase = true;
    }
}
