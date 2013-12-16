"use strict";

/**
 * @module config
 */

var path = require("path");

module.exports = {
	/** Port which the API server will attempt to bind to. */
	listenPort: 8080,

	/** Path to the XML file where template data with persist. */
	templateStoragePath: path.join(path.dirname(module.filename), "..", "templatedata.xml")
};
