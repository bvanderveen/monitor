
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

requirejs(['app/app'], function(app) {
    $(".global-wrapper").append("types are: " + _.map(app.types, function(x) { return "a type called " + x; }).join(', '));
});