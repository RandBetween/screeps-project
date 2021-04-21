module.exports = function (creep, room) {
    
            if (room == "Spawn1") {
                room = "W8N27";
            } else {
                room = "W76N83";
            }
            
            var source;
            var target;
    
            if (room == "W8N27") {
                source = Game.getObjectById("607ed0b65b0acb4d3b7d42ca");
                target = Game.getObjectById("5982fdbab097071b4adbfc32");
            } else if (room == "W76N83") {
                source = Game.getObjectById("5a2c65ce38f7774da666b123");
                target = Game.getObjectById("5873bc4411e3e4361b4d74e0");
            }  
        
            if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {
    
                if (source.energy >= 0 || room == "W76N83") {
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
        