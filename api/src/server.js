var fs = require("fs"),
	restify = require("restify"),
	template = require("./model.js"),
	persist = require("./persist.js"),
	config = require("./config.js");

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

function templateNotFoundError(id) {
	return "Can't find template with ID:" + id;
}

server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());
server.use(
	function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "http://localhost");
		return next();
	}
);

server.get(
	"/templates",
	function (req, res, next) {
		res.json(templates.templates);
	}
);

server.get(
	"/templates/count",
	function (req, res, next) {
		res.json({count: templates.length()});
	}
);

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

if (require.main === module) {
	server.listen(config.listenPort);	
}

module.exports = {
	server: server
};


