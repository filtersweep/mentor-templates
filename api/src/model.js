"use strict";

/**
 * @module
 */

var xml2js = require("xml2js"),
	config = require("./config");

/**
 * This is our most basic representation of a Template.  It doesn't do much, aside
 * from know how to build itself from an existing hash.
 * @class
 */

function Template(values) {
	this.fromHash(values);
}

/**
 * This method will attempt to find attributes in the hash parameter that share names
 * with it's own member.  For each it finds, the parameter value is copied to the internal
 * value.
 * @param Object hash - Object from which to pull attribute information from.
 * @method
 */

Template.prototype.fromHash = function (hash) {
	hash = hash || {};

	this.id = hash.id ? parseInt(hash.id, 10) : 0;
	this.title = hash.title || "Default title";
	this.description = hash.description || "A default template description";
	this.cost = hash.cost ? parseFloat(hash.cost) : 0.00;
	this.previewURL = hash.previewURL || "#";
	this.thumbnailURL = hash.thumbnailURL || "#";
};

/**
 * A collection of Template objects.
 * @param TemplateInput templateIn - Used to read templates from some data store.
 * @param TemplateOutput templateOut - Used to write templates to some data store.
 * @class
 */

function TemplateCollection(templateIn, templateOut) {
	this.templateIn = templateIn;
	this.templateOut = templateOut;
	this.readAll();
}

/**
 * Will look at all the templates in the collection and then generate an ID which is
 * unique.
 * @returns {string} - Unique template ID.
 * @method
 */

TemplateCollection.prototype.generateNextID = function () {
	var i = 0,
		self = this;

	if (!this.lastID) {
		this.lastID = 0;
		this.templates.forEach(function (template) {
			if (template.id > self.lastID) {
				self.lastID = template.id;
			}
		});
	}

	this.lastID += 1;

	return this.lastID;
};

/**
 * Reads all templates from the input data store supplied at construct time.
 * @method
 */

TemplateCollection.prototype.readAll = function () {
	this.templates = [];
	while(this.templateIn.hasMoreTemplates()) {
		this.templates.push(this.templateIn.retrieve());
	}
};

/**
 * Writes all templates in the collection to the output data store supplied at
 * construct time.
 * @method
 */

TemplateCollection.prototype.writeAll = function () {
	var self = this;

	this.templates.forEach(function (item) {
		self.templateOut.store(item);
	});
	this.templateOut.finish();
};

/**
 * Adds a template to the collection.
 * @param Template template - The template to add to the collection
 * @param Object [options] - Options that change the behavior of the method.
 * @param {boolean} options.createID - If true, then a guranteed unique id will be
 * created for the added template.
 * @method
 */

TemplateCollection.prototype.add = function (template, options) {
	if (options) {
		if (options.createID) {
			template.id = this.generateNextID();
		}
	}

	this.templates.push(template);
};

/**
 * Inserts a template into a specific index in the collection.
 * @param Template template - The template to insert.
 * @param {number} index - The index to insert the template into.
 * @method
 */

TemplateCollection.prototype.insert = function (template, index) {
	this.templates.splice(index, 0, template);
};

/**
 * Empties the collection completely.
 * @method
 */

TemplateCollection.prototype.purge = function () {
	this.templates = [];
};

/**
 * Removes a template from the collection.
 * @param Object options - Describes how to remove the template.
 * @param {number} options.id - If present, then the template with the supplied ID
 * will be removed from the collection.
 * @param {number} options.index - If present, then the template at the given index
 * will be removed from the collection.
 * @returns Template - The removed template, if found.  Returns null otherwise.
 * @method
 */

TemplateCollection.prototype.remove = function (options) {
	var i = 0,
		result = 0;

	options = options || {};

	if (options.id) {
		for (i = 0; i < this.templates.length; ++i) {
			if (this.templates[i].id === options.id) {
				result = this.templates[i];
				this.templates.splice(i, 1);

				return result;
			}
		}

	} else if (typeof options.index !== "undefined") {
		if (options.index > this.templates.length - 1) {
			return null;
		}

		result = this.templates[options.index];
		this.templates.splice(options.index, 1);

		return result;
	}

	return null;
};

/**
 * Retrieves a template or array of templates from the collection.
 * @param Object options - Describes which templates to retrieve.
 * @param {number} options.index - If present, then the template at the supplied
 * index will be retrieved.
 * @param {number} options.id - If present, then the template with the supplied ID
 * will be retrieved.
 * @param Object options.range.start - If present, then the method will return an
 * array of templates starting at the supplied value, through the end of the collection.
 * @param object [options.range.end] - If present, then the method will return an
 * array of templates starting from the start value, through the supplied value. Must
 * accompany the range.start value.
 * @returns Template - Either an template or an array of templates, depending of the
 * supplied options. If no template is found, then null is returned.
 * @method
 */

TemplateCollection.prototype.get = function (options) {
	var i = 0,
		start = 0,
		bound = 0,
		result = null;

	options = options || {};

	if (typeof options.index !== "undefined") {
		if (options.index > -1 && options.index < this.templates.length) {
			return this.templates[options.index];
		}

	} else if (options.id) {
		for (i = 0; i < this.templates.length; i += 1) {
			if (this.templates[i].id === options.id) {
				return this.templates[i];
			}
		}

	} else if (options.range) {
		return this.templates.slice(
			options.range.start || 0,
			options.range.end
		);
	}

	return null;
};

/**
 * Returns the number of templates in the collection.
 * @returns {number} - Number of templates in the collection.
 * @method
 */

TemplateCollection.prototype.length = function () {
	return this.templates.length;
};

/**
 * Returns a string representation of the template collection. This currently
 * manifests as a JSON string of the internal templates array.
 * @returns {string} - String representation of the collection.
 * @method
 */

TemplateCollection.prototype.stringify = function () {
	return JSON.stringify(this.templates);
};

module.exports = {
	/** The Template constructor */
	Template: Template,

	/** The TemplateCollection constructor */
	TemplateCollection: TemplateCollection
};
