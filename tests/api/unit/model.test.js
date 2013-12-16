"use strict";

var assert = require("assert"),
	model = require("../../../api/src/model");

var testHash = {
	id: 123456,
	title: "hash title",
	description: "hash description",
	cost: 1.23,
	previewURL: "hash previewURL",
	thumbnailURL: "hash thumbnailURL"
};

describe("module", function() {
	it("has known members", function () {
		assert.ok(model.Template);
		assert.ok(model.TemplateCollection);
	});
});

describe("Template", function () {

	it("has known defaults", function () {
		var template = new model.Template();

		assert.equal(template.id, 0);
		assert.equal(template.title, "Default title");
		assert.equal(template.description, "A default template description");
		assert.equal(template.cost, 0.00);
		assert.equal(template.previewURL, "#");
		assert.equal(template.thumbnailURL, "#");
	});

	it("fromHash() inserts values correctly", function () {
		var template = new model.Template();

		template.fromHash(testHash);
		assert.equal(template.id, testHash.id);
		assert.equal(template.title, testHash.title);
		assert.equal(template.description, testHash.description);
		assert.equal(template.cost, testHash.cost);
		assert.equal(template.previewURL, testHash.previewURL);
		assert.equal(template.thumbnailURL, testHash.thumbnailURL);
	});


	it("fromHash() ignores extra attributes", function () {
		var template = new model.Template(),
			hash = {
				WORTHLESS_ATTR: "unused"
			};

		template.fromHash(hash);
	});
});

describe("TemplateCollection", function () {
	var collection = null;

	function InputMock() {
		this.returned = 0;

		this.hasMoreTemplates = function () {
			return this.returned < 1;
		};

		this.retrieve = function () {
			this.returned += 1;
			return testHash;
		};
	}

	function OutputMock() {
		this.stored = 0;
		this.queue = [];

		this.store = function (item) {
			this.stored += 1; 
			this.queue.push(item);
		};

		this.finish = function () {
			this.queue = [];
		};
	}

	function testTemplate(t) {
		assert.equal(t.id, testHash.id);
		assert.equal(t.title, testHash.title);
		assert.equal(t.description, testHash.description);
		assert.equal(t.cost, testHash.cost);
		assert.equal(t.previewURL, testHash.previewURL);
		assert.equal(t.thumbnailURL, testHash.thumbnailURL);
	}

	beforeEach(function () {
		collection = new model.TemplateCollection(new InputMock(), new OutputMock());
	});

	it("reads all on construct", function () {
		assert.equal(collection.templates.length, 1);
		testTemplate(collection.templates[0]);
	});

	it("generateNextID() gets a new ID", function () {
		assert.equal(collection.generateNextID(), testHash.id + 1);
	});

	it("readAll() gets one mocked template", function () {
		var input = new InputMock(),
			collection = new model.TemplateCollection(input, {});

		input.returned = 0;
		collection.readAll();
		assert.equal(collection.templates.length, 1);
		testTemplate(collection.templates[0]);
	});

	it("writeAll() writes one mocked template and resets output", function () {
		var input = new InputMock(),
			output = new OutputMock(),
			collection = new model.TemplateCollection(input, output);

		collection.writeAll();
		assert.equal(output.stored, 1);
		assert.equal(output.queue.length, 0);
	});

	it("add()", function () {
		collection.add(testHash);
		assert.equal(collection.templates.length, 2);
	});

	it("insert()", function () {
		var clone = JSON.parse(JSON.stringify(testHash));

		clone.id = 23;

		assert.notEqual(clone.id, testHash.id);

		collection.insert(clone, 0);
		assert.equal(collection.templates[0].id, clone.id);
		assert.equal(collection.templates[1].id, testHash.id);
	});

	it("purge()", function () {
		collection.purge();

		assert.equal(collection.templates.length, 0);		
	});

	it("remove() by ID", function () {
		var id = 0,
			result = null;

		assert.equal(collection.templates.length, 1);
		id = collection.templates[0].id;

		result = collection.remove({id: id + 1});
		assert.equal(result, null);
		assert.equal(collection.templates.length, 1);

		result = collection.remove({id: id});
		assert.equal(result, testHash);
		assert.equal(collection.templates.length, 0);
	});

	it("remove() by index", function () {
		var result = null;

		assert.equal(collection.templates.length, 1);

		result = collection.remove({index: 3});
		assert.equal(result, null);
		assert.equal(collection.templates.length, 1);

		result = collection.remove({index: 0});
		assert.equal(result, testHash);
		assert.equal(collection.templates.length, 0);
	});

	it("get() by ID", function () {
		var result = null;

		assert.equal(collection.templates.length, 1);

		result = collection.get({id: testHash.id + 1});
		assert.equal(result, null);
		assert.equal(collection.templates.length, 1);

		result = collection.get({id: testHash.id});
		assert.equal(result, testHash);
		assert.equal(collection.templates.length, 1);
	});

	it("get() by index", function () {
		var result = null;

		assert.equal(collection.templates.length, 1);

		result = collection.get({index: 23});
		assert.equal(result, null);
		assert.equal(collection.templates.length, 1);

		result = collection.get({index: 0});
		assert.equal(result, testHash);
		assert.equal(collection.templates.length, 1);
	});

	it("get() by range", function () {
		var result = null;

		assert.equal(collection.templates.length, 1);

		result = collection.get({range: {
			start: 10,
			end: 100
		}});
		assert.ok(result);
		assert.equal(result.length, 0);
		assert.equal(collection.templates.length, 1);

		result = collection.get({range: {
			start: 0,
			end: 1
		}});
		assert.ok(result);
		assert.equal(result.length, 1);
		assert.equal(result[0], testHash);
		assert.equal(collection.templates.length, 1);
	});

	it("length", function () {
		assert.equal(collection.length(), 1);
	});

	it("stringify", function () {
		assert.equal(collection.stringify(), JSON.stringify(collection.templates));
	});
});
