"use strict";

var assert = require("assert"),
	fs = require("fs"),
	config = require("../../../api/src/config");

describe("module", function () {
	
	it("has values", function () {
		assert.ok(config.listenPort);
		assert.ok(config.templateStoragePath);
	});

	it("has a valid port", function () {
		var intRegex = /^\d+$/;

		assert.ok(intRegex.test(config.listenPort.toString()));
	});

	it("has a valide template storage path", function () {
		assert.ok(fs.existsSync(config.templateStoragePath));
	});
});
