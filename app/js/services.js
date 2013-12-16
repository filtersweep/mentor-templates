"use strict";

/*global angular:false*/

(function () {
	var services = angular.module("mentorTemplateServices", ["ngResource"]);

	/**
	 * The TemplateList service gets us all the templates available in our API. It's not
	 * recommended to use it unless you're sure your data set is "reasonably" sized. In most
	 * cases, the TemplateRange service is a better choice.
	 */

	services.factory(
		"TemplateList",
		function ($resource) {
			return $resource("//localhost:8080/templates", {}, {
				get: {isArray: true}
			});
		}
	);

	/**
	 * The TemplateList service gets us a subset of the templates available in our API. If
	 * we think of all the templates arranged as an array (which is conveniently how it's 
	 * actually organized on the server) then this service will get us portions of the array
	 * starting at :start and continuing to :end (inclusive).
	 */

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

	/**
	 * The TemplateCount service tells us how many templates are available via the API.
	 */

	services.factory(
		"TemplateCount",
		function ($resource) {
			return $resource("//localhost:8080/templates/count", {}, {});
		}
	);
})();
