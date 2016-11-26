
module.exports.isLineExisting = function(line) {
    if(line === undefined)
        return false;
    if(line === null)
        return false;
    if(line.length <= 0)
        return false;
    return true;
};

module.exports.trimLine = function( line ) {
    if(!module.exports.isLineExisting(line))
        return '';
    return line.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '');
};
