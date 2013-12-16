"use strict";

var assert = require("assert"),
	persist = require("../../../api/src/persist");

describe("module", function () {
	it("has known exports", function () {
		assert.ok(persist.getTemplateInput);
		assert.ok(persist.getTemplateOutput);
	});
});

describe("Input", function () {
	var input = null;
	
	beforeEach(function () {
		input = persist.getTemplateInput();
	});

	it("getTemplateInput() value", function () {
		assert.ok(input);
	});

	it("getTemplateInput() hasMoreTemplates()", function () {
		assert.ok(input.hasMoreTemplates());
	});

	it("getTemplateInput() retrieve()", function () {
		var result = input.retrieve();

		assert.ok(result);
		assert.ok(result.id);
		assert.ok(result.title);
		assert.ok(result.description);
		assert.ok(result.cost);
		assert.ok(result.previewURL);
		assert.ok(result.thumbnailURL);
	});
});

describe("Output", function () {
	var input = null,
		output = null;

	beforeEach(function () {
		output = persist.getTemplateOutput();
	});

	it("getTemplateOutput() value", function () {
		assert.ok(output);
	});

	it("getTemplateOutput() mirrors", function () {
		var i = 0,
			items = [],
			itemTemp = null;

		/* read all */
		input = persist.getTemplateInput();
		while (input.hasMoreTemplates()) {
			items.push(input.retrieve());
		}

		/* write all */
		items.forEach(function (item) {
			output.store(item);
		});
		output.finish();

		/* read again and compare */
		input = persist.getTemplateInput();
		while (input.hasMoreTemplates()) {
			itemTemp = input.retrieve();
			assert.ok(i < items.length);
			assert.notEqual(items[i], itemTemp);
			assert.deepEqual(items[i], itemTemp);
			i += 1;
		}
		assert.ok(!input.hasMoreTemplates());
	});

});
