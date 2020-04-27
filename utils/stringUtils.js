const crypto = require('crypto')

module.exports.stringToHash = function(string) { 
    return crypto.createHash('sha1').update(string).digest('hex'); 
} 