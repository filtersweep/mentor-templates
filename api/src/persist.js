"use strict";
var fs = require("fs"),
	xml2js = require("xml2js"),
	xmlbuilder = require("xmlbuilder"),
	model = require("./model.js"),
	config = require("./config.js");

/**
 * @class
 */

function TemplateInput() {}

TemplateInput.prototype.hasMoreTemplates = function () {
	return false;
};

TemplateInput.prototype.retrieve = function () {
	return null;
};

/**
 * @class
 */

function XMLTemplateInput(xmlFile) {
	this.readAll(xmlFile);
}

XMLTemplateInput.prototype = new TemplateInput();

XMLTemplateInput.prototype.readAll = function (xmlFile) {
	var self = this,
		rawData = "",
		xmlParser = new xml2js.Parser({
			async: false,
			explicitArray: false
		});

	this.ready = false;
	rawData = fs.readFileSync(xmlFile, {encoding: "UTF-8"});

	xmlParser.parseString(
		rawData,
		function (err, result) {
			if (err) {
				throw err;
			}

			self.currentIndex = 0;
			self.rawTemplates = result.root ? result.root.mentorTemplate : [];
			self.ready = true;
		}
	);
};

XMLTemplateInput.prototype.hasMoreTemplates = function () {	
	return this.currentIndex < this.rawTemplates.length;
};

XMLTemplateInput.prototype.retrieve = function () {
	var result = new model.Template();
	
	result.fromHash(this.rawTemplates[this.currentIndex]);
	this.currentIndex += 1;

	return result;
};

/**
 * @class
 */

function TemplateOutput() {
	this.outputQueue = [];
}

TemplateOutput.prototype.store = function (template) {
	this.outputQueue.push(template);
};

TemplateOutput.prototype.finish = function () {
	this.outputQueue = [];
};

/**
 * @class
 */

function XMLTemplateOutput(filePath) {
	this.filePath = filePath;
}

XMLTemplateOutput.prototype = new TemplateOutput();

XMLTemplateOutput.prototype.finish = function () {
	var xmlDoc = xmlbuilder.create("root"),
		rawXML = "",
		elTemp = null,
		attr = "";

	this.outputQueue.forEach(function (template) {
		elTemp = xmlDoc.ele("mentorTemplate");

		for (attr in template) {
			if (template.hasOwnProperty(attr)) {
				elTemp.ele(attr, template[attr]);
			}
		}
	});

	rawXML = xmlDoc.end({
		pretty: true, 
		indent: '\t', 
		newline: '\n'
	});
	
	fs.writeFileSync(this.filePath, rawXML);

	this.outputQueue = [];
};

/**
 * @exports
 */

module.exports = {
	getTemplateInput: function () {
		return new XMLTemplateInput(config.templateStoragePath);
	},
	getTemplateOutput: function () {
		return new XMLTemplateOutput(config.templateStoragePath);
	}
};


