module.exports = function (creep) {
    
        var x = 12;
        var y = 18;
    
        var source = Game.getObjectById("57efa0c1b8c6899106eaedc4");
        var target = Game.getObjectById("5814ed1e13260d76303f62c4");
    
        if (creep.memory.harvestPhase == true && _.sum(creep.carry) < creep.carryCapacity) {
    
          var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
              filter: (d) => {return (d.resourceType == RESOURCE_UTRIUM)}
          });
    
          if (dropenergy) {
            if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy);
            }
          } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x,y);
          }
    
        } else if (creep.memory.harvestPhase == true && creep.carry[RESOURCE_UTRIUM] == creep.carryCapacity) {
          creep.memory.harvestPhase = false;
    
        } else if (creep.memory.harvestPhase == false && creep.carry[RESOURCE_UTRIUM] > 0) {
    
          if(creep.transfer(target, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
          }
    
        } else if (creep.memory.harvestPhase == false) {
          creep.memory.harvestPhase = true;
        }
    
    }
    