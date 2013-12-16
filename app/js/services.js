"use strict";

/*global angular:false*/

(function () {
	var services = angular.module("mentorTemplateServices", ["ngResource"]);

	services.factory(
		"TemplateList",
		function ($resource) {
			return $resource("//localhost:8080/templates", {}, {
				get: {isArray: true}
			});
		}
	);

	services.factory(
		"TemplateRange",
		function ($resource) {
			return $resource("//localhost:8080/templates/from/:start/to/:end", {}, {
				query: {
					method: "GET",
					isArray: true
				}
			});
		}
	);

	services.factory(
		"TemplateCount",
		function ($resource) {
			return $resource("//localhost:8080/templates/count", {}, {});
		}
	);
})();
