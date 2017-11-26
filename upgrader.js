module.exports = function (creep) {
    
        var source = Game.getObjectById("5a1790beb85730575a24902f");
        var source2 = Game.getObjectById("5a19c44d9bc92518b838df2f");
    
        if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {

            if (source.store[RESOURCE_ENERGY] > 0) {
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                };
            } else if(source2.store[RESOURCE_ENERGY] > 0) {
                if(creep.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source2);
                };
            };  
    
        } else if(creep.memory.harvestPhase == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvestPhase = false;
    
        } else if(creep.memory.harvestPhase == false && creep.carry.energy > 0) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
    
        } else if(creep.memory.harvestPhase == false && creep.carry.energy == 0) {
            creep.memory.harvestPhase = true;
        }
    }
    