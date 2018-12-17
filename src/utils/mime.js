const mime = require('mime');

module.exports = (filePath) => {

    return mime.getType(filePath);
}