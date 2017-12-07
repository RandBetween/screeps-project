module.exports = function (creep, workerNum, spawn_name) {
    
            var room_name;

            if (spawn_name == "Spawn1") {
                room_name = "W75N83";
            } else {
                room_name = "W76N83";
            }
    
            var source;
            var energy_needs = false;
            var mineral_flag = false;
            const creep_carry_sum = _.sum(creep.carry);
        
            if (room_name == "W75N83") {
                source = Game.getObjectById("5a19c44d9bc92518b838df2f");
            } else if (room_name == "W76N83") {
                source = Game.getObjectById("5a239349b45ebf5e61484b8f");
            }   
               
            var targets = [];
            var terminal_targets = [];
            
            // Add spawn to target array
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN &&
                    structure.energy < structure.energyCapacity);
                }
            });
    
            if (spawns.length > 0) {
                targets.push(spawns[0]);
            }
    
            // Add extensions to target array
            
            var extensions = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION &&
                    structure.energy < structure.energyCapacity);
                }
            });
    
            if (extensions.length > 0) {
                for (i = 0; i < extensions.length; i++) {
                    targets.push(extensions[i])
                }
            };
            
            // Add Tower to target array
    
            var tower = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER &&
                    structure.energy < 700);
                }
            });
            
            if (tower.length > 0) {
                targets.push(tower[0])
            };
            
            // Add link to target array
    
            var links = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK &&
                    structure.energy < structure.energyCapacity &&
                    structure.id != "5a1e0745f8b2a13832ecff45");
                }
            });
   
            if (links.length > 0) {
                targets.push(links[0]);
            }

            if (targets.length > 0) {
                energy_needs = true;
            }

            // Add Terminal to target array

            if (room_name == "W75N83") {
                var terminal = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TERMINAL);
                    }
                });
    
                if (RESOURCE_HYDROGEN in Game.rooms["W75N83"].storage.store) {
                    mineral_flag = true;
                    terminal_targets.push(terminal[0]);
                }
            };
               
            /** Withdraw phase for hauler creep **/
            if (creep.memory.deliverPhase == false && creep_carry_sum < creep.carryCapacity) {
                if (energy_needs == true) {
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    };
                } else if (energy_needs == false && mineral_flag == true) {
                    if(creep.withdraw(source, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    };                    
                };

            /** Changes creep to deliver phase **/
            } else if(creep.memory.deliverPhase == false && creep_carry_sum == creep.carryCapacity) {
                creep.memory.deliverPhase = true;
        
            /** Moves hauler to various delivery spots **/
            } else if(creep.memory.deliverPhase == true && creep_carry_sum > 0) {
                if(workerNum == 1) {

                    if (!(targets.length > 0) && (mineral_flag == true && creep.carry[RESOURCE_HYDROGEN] > 0)) {
                            if(creep.transfer(terminal[0], RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(terminal[0]);
                            }   
                    }
  
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    if(creep.transfer(terminal_targets[0], RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal_targets[0]);
                    }
 
                        
                } else if(workerNum == 2) {

                    if (!(targets.length > 0) && (mineral_flag == true && creep.carry[RESOURCE_HYDROGEN] > 0)) {
                        if(creep.transfer(terminal[0], RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal[0]);
                        }   
                    }

                    if(creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targets.length - 1]);
                    }
                    if(creep.transfer(terminal_targets[targets.length - 1], RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal_targets[targets.length - 1]);
                    }
                }
        
            /** changes creep to haul mode **/
            } else if(creep.memory.deliverPhase == true && creep_carry_sum == 0) {
                creep.memory.deliverPhase = false;
            }
        };
        