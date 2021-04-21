module.exports = function (creep) {
    
    var x = 11;
    var y = 34;

    var source = Game.getObjectById("55982fdbab097071b4adbfc31");

    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(x, y);
    }
};