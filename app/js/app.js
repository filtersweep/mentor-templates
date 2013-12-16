"use strict";

/*global $:false, angular:false*/

(function () {
	var mentorTemplateApp = angular.module("mentorTemplateApp", [
		"ngRoute",
		"mentorTemplateControllers",
		"mentorTemplateServices"
	]);

	/**
	 * Our app has two primary routes:
	 *
	 * /templates
	 * template: templates/slideshow.html
	 * controller: TemplateSlideshowCtrl
	 * This is the default route and shows us the first templates available
	 * via the API.  The first template in this subset is selected.
	 *
	 * /templates/:templateid
	 * template: templates/slideshow.html
	 * controller: TemplateSlideshowCtrl
	 * This route highlights a template other than the first available, as
	 * well as shows the surrounding templates below it.
	 *
	 * The /template/add route is planned, but unimplemented.
	 */

	mentorTemplateApp.config([
		"$routeProvider", 
		function ($routeProvider) {
			$routeProvider.when(
				"/templates", {
					templateUrl: "templates/slideshow.html",
					controller: "TemplateSlideshowCtrl"
				}
			).when(
				"/templates/:templateid", {
					templateUrl: "templates/slideshow.html",
					controller: "TemplateSlideshowCtrl"
				}
			).when(
				"/templates/add", {
					templateUrl: "templates/add.html",
					controller: "TemplateAddCtrl"
				}
			).otherwise({
				redirectTo: "/templates"
			});
		}
	]);
})();
