module.exports = function (creep) {

    var source = Game.getObjectById("57f9c6e0f79ce6f10e39044b");

    if (creep.memory.harvestPhase == true && creep.carry.energy < creep.carryCapacity) {
        if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }

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
