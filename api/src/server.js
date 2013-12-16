var fs = require("fs"),
	restify = require("restify"),
	template = require("./model.js"),
	persist = require("./persist.js"),
	config = require("./config.js");

/**
 * @module
 */

var server = restify.createServer(),
	templates = new template.TemplateCollection(
		persist.getTemplateInput(), 
		persist.getTemplateOutput()
	);

/* reload our data store if it gets modified outside the app.  that way we don't have 
 to read it with every request */
/* this happens whenever we touch the file, too.  I could write something that checks
 for internal edits, but it was really only useful when generating the xml file 
 initially. If it becomes important again, I'll fix this.
fs.watch(
	config.templateStoragePath,
	function () {
		templates = new template.TemplateCollection(
			persist.getTemplateInput(), 
			persist.getTemplateOutput()
		);
	}
);
*/

/**
 * Simple error generating function, useful when the server can't find a template
 * with the supplied ID.
 * @param {number} id - ID for the missing template.
 * @function
 */

function templateNotFoundError(id) {
	return "Can't find template with ID:" + id;
}

/**
 * Set up query parsing and enable CORS. We'll let anyone connect to our API,
 * although this should probably be a config option some day.
 */

server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());
server.use(
	function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		return next();
	}
);

/**
 * GET /templates 
 * This is the default route for our API.  It simply returns a JSON array of all
 * the templates the system knows about.
 */

server.get(
	"/templates",
	function (req, res, next) {
		res.json(templates.templates);
	}
);

/**
 * GET /templates/count
 * Returns a simple JSON object with one attribute "length", which describes
 * how many templates are available.
 */

server.get(
	"/templates/count",
	function (req, res, next) {
		res.json({count: templates.length()});
	}
);

/**
 * GET /templates/from/:offset
 * Returns a subset of the available templates, starting at the :offset argument.
 * If the offset is out of range, then an empty array is returned.
 */

server.get(
	"/templates/from/:offset",
	function (req, res, next) {
		var result = templates.get({
				range: {
					start: req.params.offset
				}
			});

		res.json(result);
	}
);

/**
 * GET /templates/from/:start/to/:end
 * Returns a subset of the available templates, starting at the :start argument and
 * continuing through the :end argument.  If the offset is out of range, then an empty 
 * array is returned.
 */

server.get(
	"/templates/from/:start/to/:end",
	function (req, res, next) {
		var result = templates.get({
				range: {
					start: req.params.start,
					end: req.params.end
				}
			});

		res.json(result);
	}
);

/**
 * POST /templates
 * Adds a new template to the data store. Doesn't actually do any image placement,
 * so files must be uploaded to an image host by hand.  Expects the following arugments.
 * id - ID number for the new template.  *this is currently unchecked. we should verify this value makes sense later*
 * title - Title for the new template.
 * description - Short description for the template.
 * cost - Floating point number describing the price of the template.
 * previewURL - URL pointing to the template's full-size preview.
 * thumbnailURL - URL pointing to the template's thumbnail-size preview.
 * Returns a simple JSON object with one attribute "created". If the creation 
 * succeeds, then the value will be true. If an error occurs, the value will be 
 * false and an error message is included in the result object. */

server.post(
	"/templates",
	function (req, res, next) {
		var response = {created: false},
			newTemplate = new template.Template(req.params);

		try {
			templates.add(newTemplate, {createID: true});
			templates.writeAll();
			response.created = true;

		} catch (err) {
			response.error = err.toString();
		}
		
		res.json(response);
	}
);

/**
 * GET /templates/:templateid
 * Retrieves a single template from the store. If the template doesn't exist, then an
 * error object is returned instead.
 */

server.get(
	"/templates/:templateid",
	function (req, res, next) {
		var id = parseInt(req.params.templateid, 10),
			template = templates.get({id: id});

		if (template) {
			res.json(template);
		} else {
			res.json({error: templateNotFoundError(id)});
		}
	}
);

/**
 * POST /templates/:templateid
 * Updates a single template's values. If the template doesn't exist, then an error
 * object is returned instead. Expects the same arguments describe in the POST /templates
 * route. If an argument isn't supplied, it's value won't be changes. Extraneous arguments
 * will be ignored. Returns a simple JSON object with one attribute "updated". If the 
 * update succeeds, then the value will be true. If an error occurs, the value will be 
 * false and  an error message is included in the result object.
 */

server.post(
	"/templates/:templateid",
	function (req, res, next) {
		var response = {updated: false},
			template = null,
			id = 0;

		try {
			id = parseInt(req.params.templateid, 10);
			template = templates.get({id: id});

			if (template) {
				template.title = req.params.title || template.title;
				template.description = req.params.description || template.description;
				template.cost = req.params.cost ? parseFloat(req.params.cost) : template.cost;
				template.previewURL = req.params.previewURL || template.previewURL;
				template.thumbnailURL = req.params.thumbnailURL || template.thumbnailURL;
				templates.writeAll();

				response.updated = true;

			} else {
				response.error = templateNotFoundError(id);
			}

		} catch (err) {
			response.error = err.toString();
		}

		res.json(response);
	}
);

/**
 * DEL /templates/:templateid
 * Removes the specified template from the store. Returns a simple JSON object 
 * with one attribute "deleted". If the removal succeeds, then the value will
 * be true. If an error occurs, the value will be false and  an error message 
 * is included in the result object.
 */

server.del(
	"/templates/:templateid",
	function (req, res, next) {
		var response = {deleted: false},
			id = parseInt(req.params.templateid, 10),
			result = null;

		try {
			result = templates.removeByID(id);
			
			if (result) {
				templates.writeAll();
				response.deleted = true;

			} else {
				response.error = templateNotFoundError(id);
			}

		} catch (err) {
			response.error = err.toString();
		}

		res.json(response);
	}
);

/** if we're the main module, then start listening. otherwise just export the server. */

if (require.main === module) {
	server.listen(config.listenPort);	
}

module.exports = {
	server: server
};


