var harvester = require('harvester');
var harvester2 = require('harvester2');
var upgrader = require('upgrader');
var builder = require('builder');
var hauler = require('hauler');
var hauler2 = require('hauler2');
var invader = require('invader');
var forager = require('forager');
var miner = require('miner');
var claimer = require('claimer');
var replenisher = require('replenisher');

var builders = {};
var upgraders = {};
var harvesters = {};
var harvesters2 = {};
var haulers = {};
var haulers2 = {};
var invaders = {};
var miners = {};
var foragers = {};
var claimers = {};
var replenishers = {};

for (var room_it in Game.rooms) {
    var room = Game.rooms[room_it];
    builders[room.name] = [];
    upgraders[room.name] = [];
    harvesters[room.name] = [];
    harvesters2[room.name] = [];
    haulers[room.name] = [];
    haulers2[room.name] = [];
    invaders[room.name] = [];
    miners[room.name] = [];
    foragers[room.name] = [];
    claimers[room.name] = [];
    replenishers[room.name] = [];   
}

for (var i in Game.creeps) {
    if(Game.creeps[i].memory.role == 'builder') {
        builders[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'upgrader') {
        upgraders[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'harvester') {
        harvesters[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'harvester2') {
        harvesters2[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'hauler') {
        haulers[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'hauler2') {
        haulers2[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'invader') {
        invaders[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'miner') {
        miners[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'forager') {
        foragers[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'claimer') {
        claimers[Game.creeps[i].room.name].push(Game.creeps[i]);
    }
    if(Game.creeps[i].memory.role == 'replenisher') {
        replenishers[Game.creeps[i].room.name].push(Game.creeps[i]);
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
    Memory.controllerLevel = {};
    Memory.extensionsCount = {};
    Memory.spawnEnergy = {};
    Memory.attributeLevel = {};
    Memory.buildingCount = {};
    for (var room_it in Game.rooms) {
        // Determine room
        var room = Game.rooms[room_it];

        // Add Controller Level to memory
        Memory.controllerLevel[room.name] = room.controller.level;

        // Add Extension Counts to memory
        var extensionsCount = room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_EXTENSION}
        });
        Memory.extensionsCount[room.name] = extensionsCount.length;

        // Add Spawn Energy to memory
        var spawnEnergy = 300 + extensionsCount.length * 50;
        Memory.spawnEnergy[room.name] = spawnEnergy;

        // Add Attribute Level to memory
        var attributeLevel = 0;
        if (spawnEnergy < 550) {attributeLevel = 1} else if
        (spawnEnergy < 800) {attributeLevel = 2} else if
        (spawnEnergy < 1300) {attributeLevel = 3} else if
        (spawnEnergy < 1800) {attributeLevel = 4} else if
        (spawnEnergy < 2300) {attributeLevel = 5} else if
        (spawnEnergy < 3100) {attributeLevel = 6} else if
        (spawnEnergy < 3900) {attributeLevel = 7} else if
        (spawnEnergy >= 3900) {attributeLevel = 8};
        Memory.attributeLevel[room.name] = attributeLevel;

        // Add Building Count to memory
        var buildingCount = room.find(FIND_MY_CONSTRUCTION_SITES).length;
        Memory.buildingCount[room.name] = buildingCount;
    }
    
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
    var roomLinks = []
    roomLinks.push(Game.getObjectById("5a1dfd9971050f57ee51a8c3"));
    roomLinks.push(Game.getObjectById("5a231ffa546aad7ee351824a"));
    var targetLink = Game.getObjectById("5a1e0745f8b2a13832ecff45");
    if (targetLink.energy < 600) {
        if (roomLinks[0].cooldown == 0) {
            roomLinks[0].transferEnergy(targetLink);
        } else if (roomLinks[1].cooldown == 0) {
            roomLinks[1].transferEnergy(targetLink);
        }
    };

    var harvesterAttributes = {1 : [WORK, CARRY, CARRY, MOVE, MOVE],
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

    var claimerAttributes = [CLAIM, MOVE]

    for (var room_it in Game.rooms) {
        // Determine room
        var room = Game.rooms[room_it];

        // Determine spawn
        var spawn = room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_SPAWN}
        });

        if (harvesters[room.name].length < 1) {
            Game.spawns[spawn[0].name].createCreep(harvesterAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'harvester', harvestPhase: true, spawnRoom: spawn[0].name});
        } else if(harvesters2[room.name].length < 1) {
            Game.spawns[spawn[0].name].createCreep(harvesterAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'harvester2', harvestPhase: true, spawnRoom: spawn[0].name});
        } else if(haulers[room.name].length < 1) {
            Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'hauler', deliverPhase: false, spawnRoom: spawn[0].name});
        } else if(haulers2[room.name].length < 1 && room.name == "W75N83") {
            Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'hauler2', deliverPhase: false, spawnRoom: spawn[0].name});
        } else if(replenishers[room.name].length < 2 && room.name == "W75N83") {
            Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'replenisher', deliverPhase: false, spawnRoom: spawn[0].name});
        } else if(builders[room.name].length < 1 && Memory.buildingCount[room.name] > 0 && room.name == "W75N83") {
            Game.spawns[spawn[0].name].createCreep(builderAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'builder', harvestPhase: true, spawnRoom: spawn[0].name});
        } else if(upgraders[room.name].length < 1) {
            Game.spawns[spawn[0].name].createCreep(upgraderAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'upgrader', harvestPhase: true, spawnRoom: spawn[0].name});
        } else if(foragers[room.name].length > 999) {
            Game.spawns[spawn[0].name].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'forager', harvestPhase: true, spawnRoom: spawn[0].name});
        } else if(claimers[room.name].length > 999) {
            Game.spawns[spawn[0].name].createCreep(claimerAttributes, undefined, {role: 'claimer', spawnRoom: spawn[0].name});
        } /*else if(invaders.length > 1) {
            Game.spawns[spawn[0].name].createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'invader', spawnRoom: spawn[0].name}); */
        else if(miners[room.name].length < 1) {
            Game.spawns[spawn[0].name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, {role: 'miner', harvestPhase: true, spawnRoom: spawn[0].name});
        }
    }

    var replenisherIndex = 1;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            harvester(creep, creep.room.name);
        } else if(creep.memory.role == 'harvester2') {
            harvester2(creep, creep.room.name);
        } else if(creep.memory.role == 'upgrader') {
            upgrader(creep, creep.room.name);
        } else if(creep.memory.role == 'builder') {
            builder(creep, creep.room.name);
        } else if(creep.memory.role == 'hauler') {
            hauler(creep, creep.room.name);
        } else if(creep.memory.role == 'hauler2') {
            hauler2(creep, creep.room.name);
        } else if(creep.memory.role == 'invader') {
            invader(creep, creep.room.name);
        } else if(creep.memory.role == 'miner') {
            miner(creep, creep.room.name);
        } else if(creep.memory.role == 'forager') {
            forager(creep, creep.room.name);
        } else if(creep.memory.role == 'claimer') {
            claimer(creep, creep.room.name);
        } else if(creep.memory.role == 'replenisher') {
            replenisher(creep, replenisherIndex, creep.room.name);
            replenisherIndex = 2;
        }
    }
}