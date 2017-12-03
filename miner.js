module.exports = function (creep) {
    
        var x = 31;
        var y = 31;
    
        var source = Game.getObjectById("5873c16763ad7a7555b7b03b");
        var storage = Game.getObjectById("5a19c44d9bc92518b838df2f");
    
        if (creep.memory.harvestPhase == true && _.sum(creep.carry) < creep.carryCapacity) {
    
          var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
              filter: (d) => {return (d.resourceType == RESOURCE_HYDROGEN)}
          });
    
          if (dropenergy) {
            if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy);
            }
          } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x,y);
          }
    
        } else if (creep.memory.harvestPhase == true && creep.carry[RESOURCE_HYDROGEN] == creep.carryCapacity) {
          creep.memory.harvestPhase = false;
    
        } else if (creep.memory.harvestPhase == false && creep.carry[RESOURCE_HYDROGEN] > 0) {
    
          if(creep.transfer(storage, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
              creep.moveTo(storage);
          }
    
        } else if (creep.memory.harvestPhase == false) {
          creep.memory.harvestPhase = true;
        }
    
    }
    