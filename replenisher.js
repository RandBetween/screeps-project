module.exports = function (creep, workerNum) {
    
        var source = Game.getObjectById("5a19c44d9bc92518b838df2f");
    
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

        var links = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK &&
                structure.energy < structure.energyCapacity &&
                structure.id != "5a1e0745f8b2a13832ecff45");
            }
        });

        if (links.length > 0) {
            targets.push(links[0]);
        }
           
        /** Withdraw phase for hauler creep **/
        if (creep.memory.deliverPhase == false && creep.carry.energy < creep.carryCapacity) {
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            };
    
        /** Changes creep to deliver phase **/
        } else if(creep.memory.deliverPhase == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.deliverPhase = true;
    
        /** Moves hauler to various delivery spots **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy > 0) {
            if(workerNum == 1) {
    
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                    
            } else if(workerNum == 2) {
                if(creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length - 1]);
                }
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
            creep.memory.deliverPhase = false;
        }
    };
    