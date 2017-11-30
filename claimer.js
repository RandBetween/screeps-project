module.exports = function (creep) {
    
    var dest = "W74N83";
    var home = "W75N83";
    var target = Game.getObjectById("5873bc4911e3e4361b4d759b");

    if (creep.room.name != dest) {
        creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
    } else if (creep.room.name == dest) {
        if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

};