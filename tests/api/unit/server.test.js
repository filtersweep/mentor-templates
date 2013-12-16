"use strict";

var assert = require("assert"),
	server = require("../../../api/src/server"),
	config = require("../../../api/src/config"),
	restify = require("restify");

describe("Server", function() {
	var client = null;

	function templatesOk(obj) {
		if (Array.isArray(obj)) {
			obj.forEach(function (item) {
				templatesOk(item);
			});

		} else {
			assert.ok(obj);
			assert.ok(obj.id);
			assert.ok(obj.title);
			assert.ok(obj.description);
			assert.ok(obj.cost);
			assert.ok(obj.previewURL);
			assert.ok(obj.thumbnailURL);
		}
	}
	
	beforeEach(function () {
		client = restify.createJsonClient({
			url: "http://localhost:" + config.listenPort
		});
		server.server.listen(config.listenPort);
	});

	afterEach(function () {
		server.server.close();
	});

	it("responds at /templates with default templates", function (done) {
		client.get(
			"/templates",
			function (err, req, res, obj) {
				assert.equal(err, null);
				assert.ok(obj);
				assert.equal(obj.length, 12);
				templatesOk(obj);
				done();
			}
		);
	});
	
	it("responds at /templates/count with 12", function (done) {
		client.get(
			"/templates/count",
			function (err, req, res, obj) {
				assert.equal(err, null);
				assert.equal(obj.count, 12);
				done();
			}
		);
	});

	it("responds at /templates/from/10 with 2 templates", function (done) {
		client.get(
			"/templates/from/10",
			function (err, req, res, obj) {
				assert.equal(err, null);
				assert.ok(obj);
				assert.equal(obj.length, 2);
				templatesOk(obj);
				done();
			}
		);
	});

	it("responds at /templates/from/4/to/8", function (done) {
		client.get(
			"/templates/from/4/to/8",
			function (err, req, res, obj) {
				assert.equal(err, null);
				assert.ok(obj);
				assert.equal(obj.length, 4);
				templatesOk(obj);
				done();
			}
		);
	});

	it("responds at /templates/7111", function (done) {
		client.get(
			"/templates/7111",
			function (err, req, res, obj) {
				assert.equal(err, null);
				assert.ok(obj);
				assert.equal(obj.length, undefined);
				templatesOk(obj);
				done();
			}
		);
	});

	/* we're not going to test the stuff that modfies the data store, because
	 it's not used by the app and we don't yet have a slick way to make sure
	 we don't bork our main data file. */
});
