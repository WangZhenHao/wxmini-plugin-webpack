let colorCode = {
    black: "\u001b[30m",
    red: "\u001b[31m",
    green: "\u001b[32m",
    orange: "\u001b[33m",
    blue: "\u001b[34m",
    purple: "\u001b[35m",
    cyan: "\u001b[36m",
    white: "\u001b[37m",
    reset: "\u001b[39m",
};
var logType = function(message, colorkey){
    process.stdout.write(colorCode[colorkey]);
    process.stdout.write(message);
    process.stdout.write(colorCode.reset);
};
const typeMap = {
    info: 'green',
    error: 'red',
    warn: 'orange',
    normal: 'white'
}
const log = function(message, type = 'normal') {
    const colorkey = typeMap[type];
    logType(message, colorkey)
}
module.exports = log;