"use strict";
var fs = require("fs"),
	xml2js = require("xml2js"),
	xmlbuilder = require("xmlbuilder"),
	model = require("./model.js"),
	config = require("./config.js");

/**
 * Generic interface for reading templates from an arbitrary data store. This
 * class shouldn't be instantiated, since it really do anything in this form.
 * @abstract
 */

function TemplateInput() {}

/**
 * Indicates whether the input interface has more templates available to read.
 * @returns {boolean} - If true, then more templates are available to read. If
 * false, all available templates have been retrieved.
 * @method
 */

TemplateInput.prototype.hasMoreTemplates = function () {
	return false;
};

/**
 * Retreives the next available template from the input interface.
 * @returns Template - If a template is available to read, that template is 
 * returned. If no templates are available, then null is returned.
 * @method
 */

TemplateInput.prototype.retrieve = function () {
	return null;
};

/**
 * XML-file based implementation of the TemplateInput interface. Using the supplied
 * path, the XML contents are read, parsed, converted to Template objects.
 * @param {string} xmlFile - Path to the XML file where template data is stored.
 * @extends TemplateInput
 * @class
 */

function XMLTemplateInput(xmlFile) {
	this.readAll(xmlFile);
}

XMLTemplateInput.prototype = new TemplateInput();

/**
 * A utility function which does all the heavy lifting: reading, parsing, and
 * converting the data store into Template objects.  Objects are stored internally
 * in the rawTemplates array.
 * @param {string} xmlFile - The XML file to read data from.
 * @method
 */

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

/**
 * Indicates whether the input interface has more templates available to read. 
 * State is maintained internally with an index variable, which is incremented
 * for every retrieve()
 * @returns {boolean} - If true, then more templates are available to read. If
 * false, all available templates have been retrieved.
 * @method
 */

XMLTemplateInput.prototype.hasMoreTemplates = function () {	
	return this.currentIndex < this.rawTemplates.length;
};

/**
 * Retreives the next available template from the input interface.
 * @returns Template - If a template is available to read, that template is 
 * returned. If no templates are available, then null is returned.
 * @method
 */

XMLTemplateInput.prototype.retrieve = function () {
	var result = null;

	if (this.hasMoreTemplates()) {
		result = new model.Template();
		
		result.fromHash(this.rawTemplates[this.currentIndex]);
		this.currentIndex += 1;
	}

	return result;
};

/**
 * Generic interface for writing templates to an arbitrary data store. This
 * class shouldn't be instantiated.
 * @abstract
 */

function TemplateOutput() {
	this.outputQueue = [];
}

/**
 * Adds a template to the data store. Note: This call does not gurantee that
 * the data is flushed.  To ensure data is written to the store, finish() must
 * be called once all templates have been stored.
 * @param Template template - The template to add to the data store.
 * @method
 */

TemplateOutput.prototype.store = function (template) {
	this.outputQueue.push(template);
};

/**
 * Flushes stored templates to the data store and resets internal state.
 * @method
 */

TemplateOutput.prototype.finish = function () {
	this.outputQueue = [];
};

/**
 * XML-file based implementation of the TemplateOutput interface. Using the supplied
 * path, stored templates are serialized and written to the file.
 * @param {string} filePath - Path at which to write the XML data store.
 * @extends TemplateOutput
 * @class
 */

function XMLTemplateOutput(filePath) {
	this.filePath = filePath;
}

XMLTemplateOutput.prototype = new TemplateOutput();

/**
 * Flushes stored templates to the output file and resets internal state.
 * @method
 */

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


