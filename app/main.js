
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

requirejs(['app/app'], function(app) {

    // at first I just want to make a HUD for my glider.

    // so things like 
    // attitude indicator
    // moving map
    // g-meter
    // current heading
    // altitude
    // sink rate
    // velocity vector/intercept point


    function SensorDisplayView() {
        this.element = $("<div class='sensor_display'><span class='lat'></span><span class='lon'></span></div>")
    };

    SensorDisplayView.prototype.setLat = function(value) {
        this.element.find(".lat").html(value);
    };

    SensorDisplayView.prototype.setLon = function(value) {
        this.element.find(".lon").html(value);
    };

    function SensorDisplay(messageSource) {
        this.messageSource = messageSource;
    };

    SensorDisplay.prototype.loadView = function() {
        this.view = new SensorDisplayView();
    };

    SensorDisplay.prototype.viewWillAppear = function() {
        this.messageSource.setDelegate(this);
        this.messageSource.connect();
    };

    SensorDisplay.prototype.viewWillDisappear = function() {
        this.messageSource.setDelegate(null);
    };

    SensorDisplay.prototype.onMessage = function(m) {
        this.view.setLat(m.fields.gps_position.fields.lat.toJS());
        this.view.setLon(m.fields.gps_position.fields.lon.toJS());
    };

    var d = new SensorDisplay(new app.MessageSource());
    d.loadView();
    d.viewWillAppear();

    $(".global-wrapper").append(d.view.element);
});