"use strict";

/*global angular:false*/

(function () {
	var controllers = angular.module("mentorTemplateControllers", []),
		selectedIndex = 0,
		templateOffset = 0,
		templatesCount = 0,
		TEMPLATE_SET_SIZE = 4;

	controllers.run(
		function (TemplateCount) {
			TemplateCount.get(function (data) {
				templatesCount = data.count;
			});
		}
	);

	controllers.controller(
		"TemplateSlideshowCtrl",
		function ($scope, $routeParams, $location, TemplateRange) {
			var updateTemplates = function () {
				$scope.templates = TemplateRange.query(
					{start: templateOffset, end: templateOffset + TEMPLATE_SET_SIZE},
					function (templates) {
						var i = 0;

						for (i = 0; i < templates.length; i += 1) {
							if (templates[i].id == $routeParams.templateid) {
								selectedIndex = i;
							}
						}
						
						$scope.selected = templates[selectedIndex];
						$scope.selected.className = "active";
					}
				);
			};

			$scope.getFilename = function (path) {
				path = path ? path.split("/") : "";

				if (path.length > 0) {
					return path[path.length - 1];
				}

				return "";
			};

			$scope.formatPrice = function (price) {
				return "$" + (price || 0.00);
			};

			$scope.nextTemplates = function () {
				templateOffset += TEMPLATE_SET_SIZE;
				if (templateOffset >= templatesCount) {
					templateOffset = 0;
				}
				selectedIndex = 0;
				updateTemplates();
				$location.path("/templates");
			};

			$scope.prevTemplates = function () {
				var delta = (templatesCount % TEMPLATE_SET_SIZE) || TEMPLATE_SET_SIZE;

				templateOffset -= TEMPLATE_SET_SIZE;
				if (templateOffset < 0) {
					templateOffset = templatesCount - delta;
				} 
					
				selectedIndex = delta - 1;
				if (selectedIndex < 0) {
					selectedIndex = TEMPLATE_SET_SIZE - 1;
				}
				updateTemplates();
				$location.path("/templates");
			};

			updateTemplates();
		}
	);

})();
