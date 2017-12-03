module.exports = function (creep) {
    
        var x = 31;
        var y = 31;
    
        var source = Game.getObjectById("5873c16763ad7a7555b7b03b");
    
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }
    };
    