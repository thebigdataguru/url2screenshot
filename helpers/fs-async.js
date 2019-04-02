const fs = require("fs");

var fsAsync = {};

fsAsync.writeFile = function(file_name_with_path, content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(
            file_name_with_path,
            content,
            (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
};

module.exports = fsAsync;