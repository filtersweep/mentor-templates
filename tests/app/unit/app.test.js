"use strict";

describe("mentorTemplateApp", function () {
	var route = null;

	beforeEach(module("mentorTemplateApp"));
	beforeEach(inject(function ($route) {
		route = $route;
	}));

	it("should have routes", function () {
		expect(route.routes).not.toBeUndefined();
		expect(route.routes).not.toBeNull();
	});

	if("should have a /templates route", function () {
		expect(route.routes["/templates"]).not.toBeUndefined();
		expect(route.routes["/templates"].templateUrl).toBe("templates/slideshow.html");
		expect(route.routes["/templates"].controller).toBe("TemplateSlideshowCtrl");
	});

	if("should have a /templates/:templateid route", function () {
		expect(route.routes["/templates/:templateid"]).not.toBeUndefined();
		expect(route.routes["/templates/:templateid"].templateUrl).toBe("templates/slideshow.html");
		expect(route.routes["/templates/:templateid"].controller).toBe("TemplateSlideshowCtrl");
	});

	if("should have a /templates/add route", function () {
		expect(route.routes["/templates/add"]).not.toBeUndefined();
		expect(route.routes["/templates/add"].templateUrl).toBe("templates/add.html");
		expect(route.routes["/templates/add"].controller).toBe("TemplateAddCtrl");
	});
});
