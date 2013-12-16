"use strict";

describe("mentorTemplateServices", function () {

	describe("TemplateCount service", function () {
		beforeEach(module("mentorTemplateServices"));

		it("should be a service", inject (function (TemplateCount) {
			expect(TemplateCount).not.toBeNull();
		}));
	});

	describe("TemplateRange service", function () {
		beforeEach(module("mentorTemplateServices"));

		it("should be a service", inject (function (TemplateRange) {
			expect(TemplateRange).not.toBeNull();
		}));
	});

	describe("TemplateList service", function () {
		beforeEach(module("mentorTemplateServices"));

		it("should be a service", inject (function (TemplateList) {
			expect(TemplateList).not.toBeNull();
		}));
	});

});

