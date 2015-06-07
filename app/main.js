
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

requirejs(['app/app'], function(app) {
    alert("asdf");
    $(".global-wrapper").append("hi" + app.types);
});