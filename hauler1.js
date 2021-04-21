module.exports = function (creep, room) {
    
        if (room == "Spawn1") {
            room = "W75N83";
        } else {
            room = "W76N83";
        }

        var sources = [];
        if (room == "W75N83") {
            sources.push(Game.getObjectById("5a17173802a1f81484c1a604"));
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
        } else if (room == "W76N83") {
            sources.push(Game.getObjectById("5a2d5317ff83d80fabc9ee17"));
            var target = [];
            target.push(Game.getObjectById("5a2c65ce38f7774da666b123"));
        }
       
        /** Withdraw phase for hauler creep **/
        if (creep.memory.deliverPhase == false && creep.carry.energy < creep.carryCapacity) {
                       
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
            
    
            if (dropenergy && sources[0].store > 1500) {
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
    
                if (largestContainer.store[RESOURCE_ENERGY] >= 100) {
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
