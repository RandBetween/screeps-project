module.exports = function (creep) {
    
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
        
        var link = Game.getObjectById("5a1dfd9971050f57ee51a8c3");
        if (link.energy < link.energyCapacity) {
            targets.push(link);
        };
    
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
            if(targets.length > 0) {
    
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                    
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && creep.carry.energy == 0) {
            creep.memory.deliverPhase = false;
        }
    };
    