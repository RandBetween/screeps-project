module.exports = function (creep, room) {

        var sources = [];
        if (room == "W75N83") {
            sources.push(Game.getObjectById("5a16f3f574ff7112607ba108"));
            sources.push(Game.getObjectById("5a23405c2724dd02d7a62ee8"));
        
            var target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
            });
        } else if (room == "W76N83") {
            //sources.push(Game.getObjectById(""));
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });
        }    
        
        const carry_total = _.sum(creep.carry);

        /** Withdraw phase for hauler creep **/
        if (creep.memory.deliverPhase == false && carry_total < creep.carryCapacity) {

            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
            
    
            if (dropenergy && sources[0].store[RESOURCE_ENERGY] < 1500) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy);
                    }
            } else {
                
                var largestContainer;

                if (sources[0].store[RESOURCE_ENERGY] >= sources[1].store[RESOURCE_HYDROGEN]) {

                    largestContainer = sources[0];

                    if (largestContainer.store[RESOURCE_ENERGY] >= 100) {
                        if(creep.withdraw(largestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(largestContainer);
                        }
                      }

                } else {

                    largestContainer = sources[1];

                    if (largestContainer.store[RESOURCE_HYDROGEN] >= 100) {
                        if(creep.withdraw(largestContainer, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(largestContainer);
                        }
                      }

                }
            }

        /** Changes creep to deliver phase **/
        } else if(creep.memory.deliverPhase == false && carry_total == creep.carryCapacity) {
            creep.memory.deliverPhase = true;
    
        /** Moves hauler to various delivery spots **/
        } else if(creep.memory.deliverPhase == true && carry_total > 0) {

            if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }

            if(creep.transfer(target[0], RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
    
        /** changes creep to haul mode **/
        } else if(creep.memory.deliverPhase == true && carry_total == 0) {
            creep.memory.deliverPhase = false;
            
        } else {
            //
        }
    }