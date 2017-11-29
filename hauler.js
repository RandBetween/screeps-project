module.exports = function (creep) {
    
        var sources = [];
        sources.push(Game.getObjectById("5a16f3f574ff7112607ba108"));
        sources.push(Game.getObjectById("5a17173802a1f81484c1a604"));
    
        var targets = [];
        
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
        
        // Add Tower to target array

        var tower = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER &&
                structure.energy < 700);
            }
        });
        
        if (tower.length > 0) {
            targets.push(tower[0])
        };
        
        // Add link to target array
        
        var link = Game.getObjectById("5a1dfd9971050f57ee51a8c3");
        if (link.energy < link.energyCapacity) {
            targets.push(link);
        };

        /* Add upgrade container to target array
        
        var upgrade_container = Game.getObjectById("5a1790beb85730575a24902f");
        if (upgrade_container.store[RESOURCE_ENERGY] < upgrade_container.storeCapacity - 500) {
            targets.push(upgrade_container);
        };
        
        */

        // If no structures require energy, add surplus energy to storage structure
        
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
            
            
            /*
    
            var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
            
            var index = 0
            largest_dropped_resource = 0
            for (i = 0; i < dropenergy.length; i++) {
                if (dropenergy[i].amount > largest_dropped_resource) {
                    index = i
                }
            }
            
            if(creep.pickup(dropenergy[index]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy[index])
            }
            
            */
            
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
            
    
            if (dropenergy && sources[0].store[RESOURCE_ENERGY] < 1500 && sources[1].store[RESOURCE_ENERGY]) {
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
            if(targets.length > 0) {
    
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                    
            } else if (targets2.length > 0) {
                if(creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets2[0]);
                }
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
            creep.memory.deliverPhase = false;
        }
    }
    