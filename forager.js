module.exports = function (creep) {
  
    var dest = 'E59S64';
    var home = 'E58S64';
  
    var source = Game.getObjectById("57ef9e5386f108ae6e60f24c");
    var storage = Game.getObjectById("5805c4ddb5467a4b1f342635");
  
    if(creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {
  
      if(creep.room.name != dest) {
        creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
      } else {
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
  
    } else if(creep.memory.harvestPhase == true && creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvestPhase = false;
  
    } else if(creep.memory.harvestPhase == false && creep.carry.energy >= 50) {
  
      var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
  
      var repairSites = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_ROAD && (structure.hits < 2500 && structure.hits > 0)));
        }
      });
  
      if (repairSites.length && creep.room.name == dest) {
        creep.moveTo(repairSites[0]);
        creep.repair(repairSites[0]);
      } else if (constructionSites.length && creep.room.name == dest) {
        creep.moveTo(constructionSites[0]);
        creep.build(constructionSites[0]);
      } else if(creep.room.name != home) {
        creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(home)));
      } else if(creep.room.name == home){
  
        if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
      }
  
    } else if(creep.memory.harvestPhase == false && creep.carry.energy < 50) {
      creep.memory.harvestPhase = true;
    }
  
  }
  