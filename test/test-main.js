var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});


var reporters = require('jasmine-reporters');

jasmine = require('jasmine-node');

requirejs(['spec'], function () {
    // tell Jasmine to use the boring console reporter:
    //jasmine.getEnv().addReporter(new reporters.TerminalReporter());

    jasmine.getEnv().addReporter(new jasmine.TerminalReporter({color:true}));

    // execute all specs
    jasmine.getEnv().execute();
});

global.define = requirejs;

for (key in jasmine) {
    if (jasmine[key] instanceof Function) {
        global[key] = jasmine[key];
    }
}