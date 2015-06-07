var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'js',
    paths: {
        underscore: 'lib/underscore'
    }
});

var reporters = require('jasmine-reporters');

jasmine = require('jasmine-node');

requirejs(['app/spec'], function () {
    jasmine.getEnv().addReporter(new jasmine.TerminalReporter({color:true}));
    jasmine.getEnv().execute();
});

global.define = requirejs;

for (key in jasmine) {
    if (jasmine[key] instanceof Function) {
        global[key] = jasmine[key];
    }
}
