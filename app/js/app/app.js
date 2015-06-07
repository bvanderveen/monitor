define(['underscore', 'lib/libschema'], function(_, schema) {
	"use strict";

    var exports = {};

    exports.types = _.keys(schema.SpecificationInfo.types);

    return exports;
});
