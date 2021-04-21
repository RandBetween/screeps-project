module.exports = function (creep) {
    
        var x = 5;
        var y = 30;
    
        var source = Game.getObjectById("5982fdbab097071b4adbfc30");
    
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y);
        }
    };