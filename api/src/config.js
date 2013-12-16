"use strict";

var path = require("path");

module.exports = {
	listenPort: 8080,
	templateStoragePath: path.join(path.dirname(module.filename), "..", "templatedata.xml")
};
