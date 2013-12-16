"use strict";
var xml2js = require("xml2js"),
	config = require("./config");

/**
 * @class
 */

function Template(values) {
	this.fromHash(values);
}

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
 * @class
 */

function TemplateCollection(templateIn, templateOut) {
	this.templateIn = templateIn;
	this.templateOut = templateOut;
	this.readAll();
}

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

TemplateCollection.prototype.readAll = function () {
	this.templates = [];
	while(this.templateIn.hasMoreTemplates()) {
		this.templates.push(this.templateIn.retrieve());		
	}
};

TemplateCollection.prototype.writeAll = function () {
	var self = this;
	
	this.templates.forEach(function (item) {
		self.templateOut.store(item);
	});
	this.templateOut.finish();
};

TemplateCollection.prototype.add = function (template, options) {
	if (options) {
		if (options.createID) {
			template.id = this.generateNextID();
		}
	}

	this.templates.push(template);
};

TemplateCollection.prototype.insert = function (template, index) {
	this.templates.splice(index, 0, template);
};

TemplateCollection.prototype.purge = function () {
	this.templates = [];
};

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

TemplateCollection.prototype.length = function () {
	return this.templates.length;
};

TemplateCollection.prototype.stringify = function () {
	return JSON.stringify(this.templates);
};

module.exports = {
	Template: Template,
	TemplateCollection: TemplateCollection
};
