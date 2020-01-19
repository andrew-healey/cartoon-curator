const moment=require("moment");
module.exports = {
    extensions: [{
        regex: /\$\{([^{}]+)\}/g,
        edit: (inputInfo, [_, key]) => inputInfo[key],
    }, {
        regex: /\$convert\{\"([^\"]+)\",\"([^\"]+)\",\"([^\"]+)\"\}/g,
        edit: (inputInfo, [_, str, fromFormat, toFormat]) => moment(str, fromFormat).format(toFormat),
    }]
};
