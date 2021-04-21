module.exports = function (creep, room) {
    
        if (room == "Spawn1") {
            room = "W8N27";
        } else {
            room = "W76N83";
        }

        var sources = [];
        if (room == "W8N27") {

            var targets = [];

            /*
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
            */

            // Add spawn to target array
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN &&
                    structure.energy < structure.energyCapacity);
                }
            });
    
            if (spawns.length > 0) {
                targets.push(spawns[0]);
            }
    
            // Add extensions to target array
            
            var extensions = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION &&
                    structure.energy < structure.energyCapacity);
                }
            });
    
            if (extensions.length > 0) {
                for (i = 0; i < extensions.length; i++) {
                    targets.push(extensions[i])
                }
            };

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
            
            if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy);
            }

            /*
            if (dropenergy && sources[0].store > 1500) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy);
                    }
            } 

            else {
    
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
            */
    
        /** Changes creep to deliver phase **/
        } else if(creep.memory.deliverPhase == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.deliverPhase = true;
    
        /** Moves hauler to various delivery spots **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy > 0) {
    
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
            creep.memory.deliverPhase = false;
        }
        
    }
