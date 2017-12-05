module.exports = function (creep, room) {
    
            if (room == "Spawn1") {
                room = "W75N83";
            } else {
                room = "W76N83";
            }
            
            var source;
            var target;
    
            if (room == "W75N83") {
                source = Game.getObjectById("5a1e0745f8b2a13832ecff45");
                target = Game.getObjectById("5873bc4611e3e4361b4d753d");
            } else if (room == "W76N83") {
                source = Game.getObjectById("5a239349b45ebf5e61484b8f");
                target = Game.getObjectById("5873bc4411e3e4361b4d74e0");
            }  
        
            if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {
    
                if (source.energy >= 0) {
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    };
                } /*else if(source2.store[RESOURCE_ENERGY] > 0) {
                    if(creep.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source2);
                    };
                };*/  
        
            } else if(creep.memory.harvestPhase == true && creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvestPhase = false;
        
            } else if(creep.memory.harvestPhase == false && creep.carry.energy > 0) {
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        
            } else if(creep.memory.harvestPhase == false && creep.carry.energy == 0) {
                creep.memory.harvestPhase = true;
            }
        };
        