"use strict";

/*global $:false, angular:false*/

(function () {
	var mentorTemplateApp = angular.module("mentorTemplateApp", [
		"ngRoute",
		"mentorTemplateControllers",
		"mentorTemplateServices"
	]);

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
