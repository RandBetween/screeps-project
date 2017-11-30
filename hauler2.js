module.exports = function (creep) {
    
        var sources = [];
        sources.push(Game.getObjectById("5a16f3f574ff7112607ba108"));
    
        var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
        });
    
        /** Withdraw phase for hauler creep **/
        if (creep.memory.deliverPhase == false && creep.carry.energy < creep.carryCapacity) {
                       
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
            
    
            if (dropenergy && sources[0].store[RESOURCE_ENERGY] < 1500) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy);
                    }
            } else {
    
                var largestContainer = sources[0];
    
                for(var i = 0; i < sources.length; i++) {
    
                    if(sources[i].store[RESOURCE_ENERGY] > largestContainer.store[RESOURCE_ENERGY]) {
                        largestContainer = sources[i];
                    }
    
                }
    
                if (largestContainer.store[RESOURCE_ENERGY] >= 250) {
                  if(creep.withdraw(largestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(largestContainer);
                  }
                }
            }
    
        /** Changes creep to deliver phase **/
        } else if(creep.memory.deliverPhase == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.deliverPhase = true;
    
        /** Moves hauler to various delivery spots **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy > 0) {
    
            if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
            creep.memory.deliverPhase = false;
        }
    }
    