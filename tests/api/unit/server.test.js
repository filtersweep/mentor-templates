"use strict";

var assert = require("assert"),
	server = require("../../../api/src/server");

describe("Server", function() {
	
	it("has routes", function () {
		assert.ok(server.server);
	});
	
});
