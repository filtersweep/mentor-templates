"use strict";

/*global angular:false*/

(function () {
	var controllers = angular.module("mentorTemplateControllers", []),
		selectedIndex = 0,     /** currently selected template index */
		templateOffset = 0,    /** offset into the total templates available via the API */
		templatesCount = 0,    /** total number of templates available from the API */
		TEMPLATE_SET_SIZE = 4; /** template subset size */

	/** 
	 * Before we do anything, we need to know how many templates are available from
	 * the API. We'll figure that out before our controller runs.
	 */

	controllers.run(
		function (TemplateCount) {
			TemplateCount.get(function (data) {
				templatesCount = data.count;
			});
		}
	);

	/**
	 * TemplateSlideshowCtrl is the default view of our application. It shows a small
	 * strip of available templates, as well as a large view of the seleced template and
	 * its attributes.
	 */

	controllers.controller(
		"TemplateSlideshowCtrl",
		function ($scope, $routeParams, $location, TemplateRange) {

			/** Does the actual work of retrieving templates and choosing the selected template */
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

			/** 
			 * We don't want to show the user the whole image path, so we can use this to extract
			 * the name.
			 */

			$scope.getFilename = function (path) {
				path = path ? path.split("/") : "";

				if (path.length > 0) {
					return path[path.length - 1];
				}

				return "";
			};

			/** 
			 * Utility to show the user a nicely formatted cost.  Doesn't currently support i18n,
			 * but that's why it's here: so we have the option in the future.
			 */

			$scope.formatPrice = function (price) {
				return "$" + (price || 0.00);
			};

			/** 
			 * Advances the template slideshow to the next subset.  When the slideshow is advanced,
			 * then the selected template becomes the first template available in the next subset.
			 */

			$scope.nextTemplates = function () {
				templateOffset += TEMPLATE_SET_SIZE;
				if (templateOffset >= templatesCount) {
					templateOffset = 0;
				}
				selectedIndex = 0;
				updateTemplates();
				$location.path("/templates");
			};

			/** 
			 * Shows the previous subset of templates. After the transition, the selected template 
			 * becomes the last template available in the previous subset.
			 */			

			$scope.prevTemplates = function () {
				var delta = (templatesCount % TEMPLATE_SET_SIZE) || TEMPLATE_SET_SIZE;

				templateOffset -= TEMPLATE_SET_SIZE;
				if (templateOffset < 0) {
					templateOffset = templatesCount - delta;
				} 
				
				if (templateOffset + TEMPLATE_SET_SIZE > templatesCount) {
					selectedIndex = delta - 1;
					if (selectedIndex < 0) {
						selectedIndex = TEMPLATE_SET_SIZE - 1;
					}
				} else {
					selectedIndex = 3;
				}

				updateTemplates();
				$location.path("/templates");
			};

			updateTemplates();
		}
	);

})();
