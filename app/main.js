
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

var standardDimension = 100;

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

    function AttitudeIndicator() {

    }

    AttitudeIndicator.prototype.draw = function (ctx, roll, pitch, aspect) {
        var color = "#fff";
        var dimensionPerDegree = .3 / 10;
        var pitchDimension = standardDimension * pitch * dimensionPerDegree;
        var root2 = 1.414213562373095;
        var hemisphereHeight = standardDimension * 1.2;

        ctx.save();
        ctx.beginPath();

        var normalizedWidth = aspect * standardDimension;
        var normalizedHeight = standardDimension;
        console.log(normalizedWidth);
        console.log(normalizedHeight);
        ctx.rect(-normalizedWidth / 2, -normalizedHeight / 2, normalizedWidth, normalizedHeight);
        ctx.clip();

        ctx.rotate(roll / 180 * Math.PI);
        ctx.translate(0, pitchDimension);

        // ctx.fillStyle = "#0000ff";
        // ctx.fillRect(-standardDimension / 2 * root2, -hemisphereHeight, standardDimension * root2, hemisphereHeight);


        // ctx.fillStyle = "#705010";
        // ctx.fillRect(-standardDimension / 2 * root2, 0, standardDimension * root2, hemisphereHeight);

        var ticks = 18 * 2;
        var halfTicks = 9 * 2;
        for (var i = 0; i <= ticks; i++) {
            var height = i == halfTicks ? standardDimension * .002 : standardDimension * .002;
            var width = i == halfTicks ? normalizedWidth : .3;
            var degrees = (i - halfTicks) * 10 / 2;
            
            
            ctx.fillStyle = color;
            ctx.fillRect(-standardDimension * width / 2, standardDimension * dimensionPerDegree * degrees, standardDimension * width, height)

            var rectWidth = standardDimension * .2;
            ctx.font = (standardDimension * .04) + "px Futura";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var labelText = -1 * degrees;
            ctx.fillText(labelText, 
                -standardDimension * width / 2 - (rectWidth / 2), 
                standardDimension * dimensionPerDegree * degrees, 
                rectWidth);
            ctx.fillText(labelText, 
                standardDimension * width / 2 + (rectWidth / 2), 
                standardDimension * dimensionPerDegree * degrees, 
                rectWidth);
        }
        ctx.restore();

        // arrow
        var lineWidth = .003;
        ctx.fillStyle = color;
        ctx.fillRect(-standardDimension * .1, -(standardDimension * lineWidth) / 2, standardDimension * .2, standardDimension * lineWidth);
        ctx.fillRect(-(standardDimension * lineWidth) / 2, -standardDimension * .05, lineWidth * standardDimension, standardDimension * .1);
    }


    function SensorDisplayView() {
        this.element = $("<div class='canvas-wrapper'></div>");
        this.attitude = new AttitudeIndicator();
    };

    SensorDisplayView.prototype.recreateCanvas = function() {
        var c = $("<canvas></canvas>");
        this.element.empty().append(c);
        c[0].width = $(window).width();
        c[0].height = $(window).height();
        this.ctx = c[0].getContext('2d');

    }

    SensorDisplayView.prototype.draw = function() {
        var width = this.element.width();
        var height = this.element.height();
        var aspect = width / height;

        var scale = Math.min(width, height) / standardDimension;

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0,0,width,height);

        this.ctx.save();

        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);

        this.attitude.draw(this.ctx, this.state.euler.roll, this.state.euler.pitch, aspect);

        this.ctx.restore();
    }

    SensorDisplayView.prototype.attachListeners = function () {
        var self = this;
        $(window).resize(function() { self.recreateCanvas(); })
        this.recreateCanvas();
    };

    SensorDisplayView.prototype.setState = function(value) {
        this.state = value;
        this.draw();
        // this.element.find(".lat").html(value);
    };

    function SensorDisplay(messageSource) {
        this.messageSource = messageSource;
    };

    SensorDisplay.prototype.loadView = function() {
        this.view = new SensorDisplayView();
        this.view.attachListeners();
    };

    SensorDisplay.prototype.viewWillAppear = function() {
        this.messageSource.setDelegate(this);
    };

    SensorDisplay.prototype.viewWillDisappear = function() {
        this.messageSource.setDelegate(null);
        this.view.detachListeners()
        this.view = null;
    };

    SensorDisplay.prototype.viewDidAppear = function() {
        this.messageSource.connect();
    }

    SensorDisplay.prototype.onMessage = function(m) {
        this.view.setState(m);
    };

    var d = new SensorDisplay(new app.MessageSource());
    d.loadView();
    d.viewWillAppear();

    var state = 0;
    setInterval(function() {
        state += .5;
        d.onMessage({
            euler: {
                pitch: 20 * Math.sin(state / 15),
                roll: 60 * Math.cos(state / 30)
            }
        });
    }, 50);

    $(".global-wrapper").append(d.view.element);

    d.viewDidAppear();
});