
requirejs.config({
    baseUrl: '/js',
    paths: {
        underscore: 'lib/underscore'
    }
});

var standardDimension = 100;

requirejs(['app/app', 'app/ui/instruments'], function(app, instruments) {

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
        this.element = $("<div class='canvas-wrapper'></div>");
        this.attitude = new instruments.AttitudeIndicator();
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

        function quaterionToEuler(q1) {
            console.log("got quat (" + q1.w + ", " + q1.x + ", " + q1.y + ", " + q1.z + ")");

            var sqw = q1.w*q1.w;
            var sqx = q1.x*q1.x;
            var sqy = q1.y*q1.y;
            var sqz = q1.z*q1.z;
            var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
            var test = q1.x*q1.y + q1.z*q1.w;
            if (test > 0.499*unit) { // singularity at north pole
                return {
                    heading: 2 * Math.atan2(q1.x,q1.w),
                    pitch: Math.PI/2,
                    roll: 0
                };
            }
            if (test < -0.499*unit) { // singularity at south pole
                return {
                    heading: -2 * Math.atan2(q1.x,q1.w),
                    pitch: -Math.PI/2,
                    roll: 0
                };
            }
            return {
                heading: Math.atan2(2*q1.y*q1.w-2*q1.x*q1.z , sqx - sqy - sqz + sqw),
                pitch: Math.asin(2*test/unit),
                roll: Math.atan2(2*q1.x*q1.w-2*q1.y*q1.z , -sqx + sqy - sqz + sqw)
            }
        }

        var euler = quaterionToEuler({
            w: m.fields.quat_reading.fields.w.toJS(),
            x: m.fields.quat_reading.fields.x.toJS(),
            y: m.fields.quat_reading.fields.y.toJS(),
            z: m.fields.quat_reading.fields.z.toJS()
        });

        function radiansToDegrees(rad) {
            return rad / Math.PI * 180;
        }

        var state = {
            euler: {
                pitch: radiansToDegrees(euler.pitch),
                roll: radiansToDegrees(euler.roll)
            }
        }
        this.view.setState(state);
    };

    var d = new SensorDisplay(new app.WebsocketMessageSource());
    d.loadView();
    d.viewWillAppear();

    // var state = 0;
    // setInterval(function() {
    //     state += .01;
    //     d.onMessage({
    //         euler: {
    //             pitch: 20 * Math.sin(state / 15),
    //             roll: 60 * Math.cos(state / 30)
    //         }
    //     });
    // }, 10);

    $(".global-wrapper").append(d.view.element);

    d.viewDidAppear();
});