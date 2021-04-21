var harvester = require('harvester');
var harvester2 = require('harvester2');
var upgrader = require('upgrader');
var builder = require('builder');
var hauler1 = require('hauler1');
var hauler2 = require('hauler2');
var invader = require('invader');
var forager = require('forager');
var miner1 = require('miner1');
var miner2 = require('miner2');
var claimer = require('claimer');
var replenisher = require('replenisher');

function calc_num_of_creeps(role, room) {
    if (room == "W8N27") {
        room = "Spawn1";
    } else {
        room = "Spawn2";
    }
    
    var count = 0;
    for (var i in Game.creeps) {
        if (Game.creeps[i].memory.role == role && Game.creeps[i].memory.spawnRoom == room) {
            count += 1;
        };
    };
    return count;
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
        if (spawnEnergy <= 350) {attributeLevel = 0} else if
        (spawnEnergy <= 550) {attributeLevel = 1} else if
        (spawnEnergy <= 800) {attributeLevel = 2} else if
        (spawnEnergy <= 1300) {attributeLevel = 3} else if
        (spawnEnergy <= 1800) {attributeLevel = 4} else if
        (spawnEnergy <= 2300) {attributeLevel = 5} else if
        (spawnEnergy <= 3100) {attributeLevel = 6} else if
        (spawnEnergy <= 3900) {attributeLevel = 7} else if
        (spawnEnergy > 3900) {attributeLevel = 8};
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
    
    /*
    var towerArray2 = Game.spawns.Spawn2.room.find(FIND_MY_STRUCTURES, {
      filter: {structureType: STRUCTURE_TOWER}
    });

    for (var i = 0; i < towerArray2.length; i++) {

        if (towerArray2[i]) {

            var closestHostile = towerArray2[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            var closestDamagedStructure = towerArray2[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 50000) ||
                                        (structure.structureType == STRUCTURE_WALL && structure.hits < 20000) ||
                                        (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 150000) ||
                                        (structure.structureType == STRUCTURE_ROAD && structure.hits < 2500))
            });

            if(closestHostile) {
                towerArray2[i].attack(closestHostile);
            } else if(closestDamagedStructure) {
                towerArray2[i].repair(closestDamagedStructure);
            }
        }
    }
    */
    
    // LINK FUNCTION
    var roomLinks = []
    /*
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
    */

    var harvesterAttributes = {0 : [WORK, CARRY, CARRY, MOVE, MOVE],
    1 : [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    2 : [WORK, WORK, WORK, WORK, WORK, MOVE],
    3 : [WORK, WORK, WORK, WORK, WORK, MOVE],
    4: [WORK, WORK, WORK, WORK, WORK, MOVE],
    5: [WORK, WORK, WORK, WORK, WORK, MOVE],
    6: [WORK, WORK, WORK, WORK, WORK, MOVE],
    7: [WORK, WORK, WORK, WORK, WORK, MOVE],
    8: [WORK, WORK, WORK, WORK, WORK, MOVE]
    };

    var haulerAttributes = {0 : [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    1 : [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    2 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    3 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    4 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    5 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    6 : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    var builderAttributes = {0 : [WORK, CARRY, CARRY, MOVE, MOVE],
    1 : [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    2 : [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    3 : [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    4 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    5 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    6 : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    var upgraderAttributes = {0 : [WORK, CARRY, CARRY, MOVE, MOVE],
    1 : [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    2 : [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
    3 : [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    4 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    5 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    6 : [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    var minerAttributes = {0 : [WORK, WORK, MOVE, MOVE],
    1 : [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
    2 : [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    3 : [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    4 : [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    5 : [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    6 : [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
    };

    var claimerAttributes = [CLAIM, MOVE]

    for (var room_it in Game.rooms) {
        // Determine room
        var room = Game.rooms[room_it];

        // Determine spawn
        var spawn = room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_SPAWN}
        });

        if (Memory.attributeLevel[room.name] == 0) {
            // Priority is to ensure that miners exist
            if (calc_num_of_creeps("miner1", room.name) < 1) {
                Game.spawns[spawn[0].name].createCreep(minerAttributes[Memory.attributeLevel[room.name]], undefined, {role: "miner1", harvestPhase: true, spawnRoom: spawn[0].name});
            } else if (calc_num_of_creeps("hauler1", room.name) < 1) {
                Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: "hauler1", deliverPhase: false, spawnRoom: spawn[0].name});
            } else if (calc_num_of_creeps("miner2", room.name) < 1) {
                Game.spawns[spawn[0].name].createCreep(minerAttributes[Memory.attributeLevel[room.name]], undefined, {role: "miner2", harvestPhase: true, spawnRoom: spawn[0].name});
            } else if (calc_num_of_creeps("hauler1", room.name) < 2) {
                Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: "hauler1", deliverPhase: false, spawnRoom: spawn[0].name});
            }
        } else if (Memory.attributeLevel[room.name] == 6) {
            if ((calc_num_of_creeps("replenisher", room.name) < 2 && !(room.name == "W76N83")) || (calc_num_of_creeps("replenisher", room.name) < 2 && room.name == "W76N83")) {
                if (room.name == "W75N83") {
                    Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'replenisher', deliverPhase: false, spawnRoom: spawn[0].name});
                } else {
                    Game.spawns[spawn[0].name].createCreep([CARRY, MOVE], undefined, {role: 'replenisher', deliverPhase: false, spawnRoom: spawn[0].name});
                }
            } else if (((calc_num_of_creeps("harvester", room.name) < 1) && !(room.name == "W76N83")) || ((calc_num_of_creeps("harvester", room.name) < 1) && (room.name == "W76N83"))) {
                Game.spawns[spawn[0].name].createCreep(harvesterAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'harvester', harvestPhase: true, spawnRoom: spawn[0].name});    
            } else if((calc_num_of_creeps("harvester2", room.name) < 1) || (calc_num_of_creeps("harvester2", room.name) > 999 && room.name == "W76N83")) {
                Game.spawns[spawn[0].name].createCreep(harvesterAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'harvester2', harvestPhase: true, spawnRoom: spawn[0].name});    
            } else if(calc_num_of_creeps("hauler", room.name) < 1) {
                Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'hauler', deliverPhase: false, spawnRoom: spawn[0].name});
            } else if(calc_num_of_creeps("hauler2", room.name) < 1) {
                Game.spawns[spawn[0].name].createCreep(haulerAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'hauler2', deliverPhase: false, spawnRoom: spawn[0].name});
            } else if (((calc_num_of_creeps("builder", room.name) < 1) && (Memory.buildingCount[room.name] > 0)) || ((calc_num_of_creeps("builder", room.name) < 2) && room.name == "W76N83")) {
                Game.spawns[spawn[0].name].createCreep(builderAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'builder', harvestPhase: true, spawnRoom: spawn[0].name});    
            } else if(((calc_num_of_creeps("upgrader", room.name) < 2) && !(room.name == "W76N83")) || (calc_num_of_creeps("upgrader", room.name) < 1)) {
                Game.spawns[spawn[0].name].createCreep(upgraderAttributes[Memory.attributeLevel[room.name]], undefined, {role: 'upgrader', harvestPhase: true, spawnRoom: spawn[0].name});
            } else if(calc_num_of_creeps("forager", room.name) > 999) {
                Game.spawns[spawn[0].name].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: 'forager', harvestPhase: true, spawnRoom: spawn[0].name});
            } else if(calc_num_of_creeps("claimer", room.name) > 999) {
                Game.spawns[spawn[0].name].createCreep(claimerAttributes, undefined, {role: 'claimer', spawnRoom: spawn[0].name});
            } else if(calc_num_of_creeps("invader", room.name) > 999) {
                Game.spawns[spawn[0].name].createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], undefined, {role: 'invader', spawnRoom: spawn[0].name});
            } else if(calc_num_of_creeps("miner", room.name) > 999) {
                Game.spawns[spawn[0].name].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, {role: 'miner', harvestPhase: true, spawnRoom: spawn[0].name});
            }
        }
    }

    var replenisherIndex = {
        "W8N27": 1,
    };

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            harvester(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'harvester2') {
            harvester2(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'upgrader') {
            upgrader(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'builder') {
            builder(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'hauler1') {
            hauler1(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'hauler2') {
            hauler2(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'invader') {
            invader(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'miner1') {
            miner1(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'miner2') {
            miner2(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'forager') {
            forager(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'claimer') {
            claimer(creep, creep.memory.spawnRoom);
        } else if(creep.memory.role == 'replenisher') {
            replenisher(creep, replenisherIndex[creep.room.name], creep.memory.spawnRoom);
            replenisherIndex[creep.room.name] = 2;
        }
    }
}