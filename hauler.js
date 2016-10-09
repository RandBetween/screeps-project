module.exports = function (creep) {

    var sources = [];
    sources.push(Game.getObjectById("57f9bf28bc29b4e61fa03c2d"));
    sources.push(Game.getObjectById("57f9c179b50dd6e315c32351"));
    sources.push(Game.getObjectById("57f9c9268cac83432da48e73"));
    /**sources.push(Game.getObjectById("57f3b6147c2a512e2cf2533d"));**/

    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {

            return (((structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_TOWER && structure.energy < 700) ||
                    (structure.id == "57f9c6e0f79ce6f10e39044b" && structure.store[RESOURCE_ENERGY] < 1500));
        }
    });

    if(targets.length == 0) {
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
    }

    /**console.log(targets.length);**/

    /** Withdraw phase for hauler creep **/
    if (creep.memory.deliverPhase == false && creep.carry.energy < creep.carryCapacity) {

        var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
        });

        /**
        for(var i = 0; i < dropenergy.length; i++) {
            sources.push(dropenergy[i]);
        }
        **/

       /**var dropenergy = false;**/

        if (dropenergy) {
            if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy)
                }
        } else {

            var largestContainer = sources[0];

            for(var i = 0; i < sources.length; i++) {

                if(sources[i].store[RESOURCE_ENERGY] > largestContainer.store[RESOURCE_ENERGY]) {
                    largestContainer = sources[i];
                }

            }

            if(creep.withdraw(largestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(largestContainer);
            }

        }

    /** Changes creep to deliver phase **/
    } else if(creep.memory.deliverPhase == false && creep.carry.energy == creep.carryCapacity) {
        creep.memory.deliverPhase = true;

    /** Moves hauler to various delivery spots **/
    } else if(creep.memory.deliverPhase == true && creep.carry.energy > 0) {
        if(targets.length > 0) {

            for (var i = 0; i < targets.length; i++) {

                if(creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[i]);
                }
            }
        }

    /** changes creep to haul mode **/
    } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
        creep.memory.deliverPhase = false;
    }
}
