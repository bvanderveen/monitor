
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

requirejs(['app/app'], function(app) {

    function PIDDisplayView() {
        this.element = $("<div class='pid_display'><span class='i'></span><span class='d'></span></div>")
    };

    PIDDisplayView.prototype.setIState = function(value) {
        this.element.find(".i").html(value);
    };

    PIDDisplayView.prototype.setDState = function(value) {
        this.element.find(".d").html(value);
    };

    function PIDDisplay(observable) {
        this.observable = observable;
    };

    PIDDisplay.prototype.loadView = function() {
        this.view = new PIDDisplayView();
    };

    PIDDisplay.prototype.viewWillAppear = function() {
        this.cancel = this.observable.subscribe(this.handleUpdate);
    };

    PIDDisplay.prototype.viewWillDisappear = function() {
        this.cancel();
    };

    PIDDisplay.prototype.handleUpdate = function(x) {
        this.view.setIState(5);
        this.view.setDState(2);
    };

    var d = new PIDDisplay(null);
    d.loadView();

    $(".global-wrapper").append(d.view.element);
    d.handleUpdate(null);
});