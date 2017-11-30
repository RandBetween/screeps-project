var harvester = require('harvester');
var harvester2 = require('harvester2');
var upgrader = require('upgrader');
var builder = require('builder');
var hauler = require('hauler');
var invader = require('invader');
var forager = require('forager');
var miner = require('miner');

var builders = [];
var upgraders = [];
var harvesters = [];
var harvesters2 = [];
var haulers = [];
var invaders = [];
var miners = [];
var foragers = [];

for (var i in Game.creeps) {
    if(Game.creeps[i].memory.role == 'builder') {
        builders.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'upgrader') {
        upgraders.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'harvester') {
        harvesters.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'harvester2') {
        harvesters2.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'hauler') {
        haulers.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'invader') {
        invaders.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'miner') {
        miners.push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'forager') {
        foragers.push(Game.creeps[i]);
    }
}

/** main loop **/
module.exports.loop = function () {

    /** Garbage collector for deceased creeps **/
    for(var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    /** WRITE INFORMATION TO GAME MEMORY **/
    var controllerObj = Game.getObjectById("5873bc4611e3e4361b4d753d");
    Memory.controllerLevel = controllerObj.level;

    var extensionsCount = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
      filter: {structureType: STRUCTURE_EXTENSION}
    });
    Memory.extensionsCount = extensionsCount.length;

    var spawnEnergy = 300 + Memory.extensionsCount * 50;
    var attributeLevel = 0;

    if (spawnEnergy < 550) {attributeLevel = 1} else if
      (spawnEnergy < 800) {attributeLevel = 2} else if
      (spawnEnergy < 1300) {attributeLevel = 3} else if
      (spawnEnergy < 1800) {attributeLevel = 4} else if
      (spawnEnergy < 2300) {attributeLevel = 5} else if
      (spawnEnergy < 3100) {attributeLevel = 6} else if
      (spawnEnergy < 3900) {attributeLevel = 7} else if
      (spawnEnergy >= 3900) {attributeLevel = 8};

    /** 1: 300, 2: 550, 3: 800, 4: 1300, 5: 1800, 6: 2300, 7: 3100, 8: 3900 **/

    var buildingCount = Game.spawns.Spawn1.room.find(FIND_MY_CONSTRUCTION_SITES).length;
    
    /*

    if (Memory.lastGameTick < Game.time - 180) {
      Memory.storageEnergyLevel.push([Game.time, Game.getObjectById("5805c4ddb5467a4b1f342635").store[RESOURCE_ENERGY]]);
      Memory.storageEnergyLevel = Memory.storageEnergyLevel.slice(1, 41);

      var cumDiff = 0;
      var diff = 0;
      for (i = 0; i < Memory.storageEnergyLevel.length - 1; i++) {
        diff = Memory.storageEnergyLevel[i+1][1] - Memory.storageEnergyLevel[i][1];
        cumDiff += diff;
      }
      Memory.storageEneryPerTwentyTicks = cumDiff / ((Memory.storageEnergyLevel[39][0] - Memory.storageEnergyLevel[0][0]) / 20);
      console.log(Memory.storageEnergyPerTwentyTicks);
      Memory.lastGameTick = Game.time;
    };
    
    */

    /** TOWER FUNCTIONS **/
    var towerArray = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
      filter: {structureType: STRUCTURE_TOWER}
    });

    for (var i = 0; i < towerArray.length; i++) {

        if (towerArray[i]) {

            var closestHostile = towerArray[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            var closestDamagedStructure = towerArray[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 50000) ||
                                        (structure.structureType == STRUCTURE_WALL && structure.hits < 20000) ||
                                        (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 150000) ||
                                        (structure.structureType == STRUCTURE_ROAD && structure.hits < 2500))
            });

            if(closestHostile) {
                towerArray[i].attack(closestHostile);
            } else if(closestDamagedStructure) {
                towerArray[i].repair(closestDamagedStructure);
            }
        }
    }
    
    // LINK FUNCTION
    var roomLink = Game.getObjectById("5a1dfd9971050f57ee51a8c3");
    var targetLink = Game.getObjectById("5a1e0745f8b2a13832ecff45");
    if (targetLink.energy < 600) {
        roomLink.transferEnergy(targetLink);
    };
    

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var invaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'invader');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var foragers = _.filter(Game.creeps, (creep) => creep.memory.role == 'forager');

    var harvesterAttributes = {1 : [WORK, WORK, MOVE],
      2 : [WORK, WORK, WORK, WORK, WORK, MOVE],
      3 : [WORK, WORK, WORK, WORK, WORK, MOVE],
      4: [WORK, WORK, WORK, WORK, WORK, MOVE],
      5: [WORK, WORK, WORK, WORK, WORK, MOVE],
      6: [WORK, WORK, WORK, WORK, WORK, MOVE],
      7: [WORK, WORK, WORK, WORK, WORK, MOVE],
      8: [WORK, WORK, WORK, WORK, WORK, MOVE]
    };

    var haulerAttributes = {1 : [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      2 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      3 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      4 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      5 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      6 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    var builderAttributes = {1 : [WORK, CARRY, CARRY, MOVE, MOVE],
      2 : [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      3 : [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      4 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      5 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      6 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    var upgraderAttributes = {1 : [WORK, CARRY, CARRY, MOVE, MOVE],
      2 : [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
      3 : [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      4 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      5 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      6 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    if(harvesters.length < 1 || (harvesters.length == 1 && harvesters[0].ticksToLive < 40)) {
        Game.spawns['Spawn1'].createCreep(harvesterAttributes[attributeLevel], undefined, {role: 'harvester', harvestPhase: true});
    } else if(harvesters2.length < 1 || (harvesters2.length == 1 && harvesters2[0].ticksToLive < 50)) {
        Game.spawns['Spawn1'].createCreep(harvesterAttributes[attributeLevel], undefined, {role: 'harvester2', harvestPhase: true});
    } else if(haulers.length < 3) {
        Game.spawns['Spawn1'].createCreep(haulerAttributes[attributeLevel], undefined, {role: 'hauler', deliverPhase: false});
    } else if(builders.length < 2 && buildingCount > 0) {
        Game.spawns['Spawn1'].createCreep(builderAttributes[attributeLevel], undefined, {role: 'builder', harvestPhase: true});
    } else if(upgraders.length < 2) {
        Game.spawns['Spawn1'].createCreep(upgraderAttributes[attributeLevel], undefined, {role: 'upgrader', harvestPhase: true});
    } else if(foragers.length < 1) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'forager', harvestPhase: true});
    } /*else if(invaders.length > 1) {
        Game.spawns['Spawn1'].createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'invader'});
    } else if((miners.length < 1 && _.sum(Game.rooms.W75N83.terminal.store) < 200000) || (miners.length == 1 && miners[0].ticksToLive < 75 && _.sum(Game.rooms.W75N83.terminal.store) < 200000)) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'miner', harvestPhase: true});
    } */

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            harvester(creep);
        } else if(creep.memory.role == 'harvester2') {
            harvester2(creep);
        } else if(creep.memory.role == 'upgrader') {
            upgrader(creep);
        } else if(creep.memory.role == 'builder') {
            builder(creep);
        } else if(creep.memory.role == 'hauler') {
            hauler(creep);
        } else if(creep.memory.role == 'invader') {
            invader(creep);
        } else if(creep.memory.role == 'miner') {
            miner(creep);
        } else if(creep.memory.role == 'forager') {
            forager(creep);
        }
    }
}

/**console.log(Game.cpu.getUsed());**/
/** console.log(Game.cpu.bucket); **/
