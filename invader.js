module.exports = function (creep) {
  
    var closestHostile = Game.getObjectById("5a2c16aec5fa366736efbe53");
    if(closestHostile) {
      creep.moveTo(closestHostile);
      creep.attack(closestHostile);
    }
    
    if(!closestHostile) {
        creep.moveTo(new RoomPosition(20, 25, "W76N83"));
    }
    
};