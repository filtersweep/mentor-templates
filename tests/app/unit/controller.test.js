"use strict";

describe("mentorTemplateControllers", function () {

	describe("TemplateSlideshowCtrl controller", function () {
		var scope = null,
			routeParams = null,
			location = null,
			templateRange = null,
			controller = null,
			buildController = null,
			httpBackend = null,
			mockTemplate = {
				id: "123",
				title: "test title",
				description: "test description",
				cost: 1.23,
				previewURL: "/path/to/preview.jpg",
				thumbnailURL: "/path/to/thumbnail.jpg"
			};

		beforeEach(module("mentorTemplateApp"));
		beforeEach(module("mentorTemplateControllers"));
		beforeEach(module("mentorTemplateServices"));

		beforeEach(inject(function ($rootScope, $routeParams, $location, TemplateRange, $controller, $httpBackend) {
			var i = 0,
			mockResponse = [];

			for (i = 0; i < 4; i += 1) {
				mockResponse.push(mockTemplate);
			}

			scope = $rootScope.$new();
			routeParams = $routeParams;
			location = $location;
			templateRange = TemplateRange;
			controller = $controller;
			httpBackend = $httpBackend;

			$httpBackend.when("GET", "//localhost:8080/templates/from/0/to/4").respond(mockResponse);
			$httpBackend.when("GET", "//localhost:8080/templates/from/4/to/8").respond(mockResponse);
			$httpBackend.when("GET", "//localhost:8080/templates/count").respond({length: 8});

			buildController = function () {
				return controller(
					"TemplateSlideshowCtrl", {
						$scope: scope,
						$routeParams: routeParams,
						$location: location,
						TemplateRange: templateRange
					}
				);
			};
		}));

		it("should make a request to /templates/count", function () {
			var ctrl = null;

			httpBackend.expectGET("//localhost:8080/templates/count");
			ctrl = buildController();
			httpBackend.flush();
		});

		it("should make a request to /templates/from/0/to/4", function () {
			var ctrl = null;

			httpBackend.expectGET("//localhost:8080/templates/from/0/to/4");
			ctrl = buildController();
			httpBackend.flush();
		});

		it("should have four templates", function () {
			var ctrl = null;

			ctrl = buildController();
			httpBackend.expectGET("//localhost:8080/templates/from/0/to/4");
			httpBackend.flush();

			expect(scope.templates).not.toBeUndefined();
			expect(scope.templates.length).toBe(4);
		});

		it("should have expected values in each template", function () {
			var ctrl = null;

			ctrl = buildController();
			httpBackend.expectGET("//localhost:8080/templates/from/0/to/4");
			httpBackend.flush();

			scope.templates.forEach(function(template) {
				expect(template.id).toBe(mockTemplate.id);
				expect(template.title).toBe(mockTemplate.title);
				expect(template.description).toBe(mockTemplate.description);
				expect(template.cost).toBe(mockTemplate.cost);
				expect(template.previewURL).toBe(mockTemplate.previewURL);
				expect(template.thumbnailURL).toBe(mockTemplate.thumbnailURL);
			});
		});

		it("should have a selected template", function () {
			var ctrl = null;

			httpBackend.expectGET("//localhost:8080/templates/from/0/to/4");
			ctrl = buildController();
			httpBackend.flush();

			expect(scope.selected).not.toBeUndefined();
		});

		it("selected template should have class 'active'", function () {
			var ctrl = null;

			httpBackend.expectGET("//localhost:8080/templates/from/0/to/4");
			ctrl = buildController();
			httpBackend.flush();

			expect(scope.selected.className).toBe("active");
		});

		it("has a function getFilename, which returns the filename portion of a path", function () {
			var ctrl = buildController();

			expect(scope.getFilename).not.toBeUndefined();
			expect(scope.getFilename("/path/to/filename.jpg")).toBe("filename.jpg");
			expect(scope.getFilename("filename.jpg")).toBe("filename.jpg");
			expect(scope.getFilename("")).toBe("");
			expect(scope.getFilename(null)).toBe("");
		});

		it("has a function formatPrice, which returns a formatted price", function () {
			var ctrl = buildController();

			expect(scope.formatPrice).not.toBeUndefined();
			expect(scope.formatPrice(1.23)).toBe("$1.23");
			expect(scope.formatPrice(1)).toBe("$1");
			expect(scope.formatPrice(null)).toBe("$0");
			expect(scope.formatPrice("200")).toBe("$200");
		});

		it("has a function nextTemplates, which advances the slideshow", function () {
			var ctrl = buildController();

			expect(scope.nextTemplates).not.toBeUndefined();
			httpBackend.expectGET("//localhost:8080/templates/from/4/to/8");
			scope.nextTemplates();
			httpBackend.flush();
			expect(location.path()).toBe("/templates");
		});

		it("has a function prevTemplates, which reverses the slideshow", function () {
			var ctrl = buildController();

			expect(scope.prevTemplates).not.toBeUndefined();
			httpBackend.expectGET("//localhost:8080/templates/from/4/to/8");
			scope.prevTemplates();
			httpBackend.flush();
			expect(location.path()).toBe("/templates");
		});
	});
});
