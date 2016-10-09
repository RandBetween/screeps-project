var harvester = require('harvester');
var harvester2 = require('harvester2');
var upgrader = require('upgrader');
var builder = require('builder');
var hauler = require('hauler');

var builders = [];
var upgraders = [];
var harvesters = [];
var harvesters2 = [];
var haulers = [];

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
}

module.exports.loop = function () {

    /** Garbage collector for deceased creeps **/
    for(var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    var towerArray = [];
    towerArray.push(Game.getObjectById('57f1d48702493c1064d1b136'));
    towerArray.push(Game.getObjectById("57f92785904e9c5270bdd648"));

    for (var i = 0; i < towerArray.length; i++) {

        if (towerArray[i]) {

            var closestHostile = towerArray[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                towerArray[i].attack(closestHostile);
            }

            var closestDamagedStructure = towerArray[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 500000) ||
                                        (structure.structureType == STRUCTURE_WALL && structure.hits < 60000) ||
                                        (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 15000) ||
                                        (structure.structureType == STRUCTURE_ROAD && structure.hits < 2500))
            });

            if(closestDamagedStructure) {
                towerArray[i].repair(closestDamagedStructure);
            }

        }

    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');

    if(harvesters.length < 1) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, {role: 'harvester', harvestPhase: true});
    } else if(harvesters2.length < 1) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, {role: 'harvester2', harvestPhase: true});
    } else if(haulers.length < 2) {
        Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'hauler', deliverPhase: false});
    } else if(builders.length < 1) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'builder', harvestPhase: true});
    } else if(upgraders.length < 1) {
        Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'upgrader', harvestPhase: true});
    }

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
        }
    }
}

/**console.log(Game.cpu.getUsed());**/
/** console.log(Game.cpu.bucket); **/
