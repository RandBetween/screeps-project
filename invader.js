module.exports = function (creep) {
  
    var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      creep.moveTo(closestHostile);
      creep.attack(closestHostile);
    }
    
    if(!closestHostile) {
        creep.moveTo(new RoomPosition(5, 33, "W47S2"));
    }
    
  }