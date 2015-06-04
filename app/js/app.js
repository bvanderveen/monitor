'use strict';

define(['./lib/underscore.js', './lib/libschema'], function(_, schema) {
    var exports = {};

    exports.types = _.keys(schema.SpecificationInfo.types);

    return exports;
});
