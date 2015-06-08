
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

    AttitudeIndicator.prototype.draw = function (ctx, roll, pitch) {
        var dimensionPerDegree = .1 / 10;
        var pitchDimension = standardDimension * pitch * dimensionPerDegree;
        var root2 = 1.414213562373095;
        var hemisphereHeight = standardDimension * 1.2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(-standardDimension / 2, -standardDimension / 2, standardDimension, standardDimension);
        ctx.clip();

        ctx.rotate(roll / 180 * Math.PI);
        ctx.translate(0, pitchDimension);

        ctx.fillStyle = "#0000ff";
        ctx.fillRect(-standardDimension / 2 * root2, -hemisphereHeight, standardDimension * root2, hemisphereHeight);


        ctx.fillStyle = "#705010";
        ctx.fillRect(-standardDimension / 2 * root2, 0, standardDimension * root2, hemisphereHeight);

        var ticks = 18;
        var halfTicks = 9;
        for (var i = 0; i <= ticks; i++) {
            var height = i == halfTicks ? standardDimension * .02 : standardDimension * .01;
            var width = i == halfTicks ? root2 : .5;
            var degrees = (i - halfTicks) * 10;
            
            
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-standardDimension * width / 2, standardDimension * dimensionPerDegree * degrees, standardDimension * width, height)

            var rectWidth = standardDimension * .2;
            ctx.font = (standardDimension * .05) + "px Futura";
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

        //     NSString *label = [NSString stringWithFormat:@"%d", (-1 * (degrees))];
        //     CGFloat rectWidth = standardDimension * .15;
        //     CGFloat rectHeight = standardDimension * .06;
        //     [label drawInRect:CGRectMake(-standardDimension * width / 2 - rectWidth, standardDimension * dimensionPerDegree * degrees - rectHeight / 2, rectWidth, rectHeight)
        //        withAttributes:@{
        //                         NSForegroundColorAttributeName: [UIColor whiteColor],
        //                         //NSBackgroundColorAttributeName: [UIColor colorWithWhite:1 alpha:.2],
        //                         NSFontAttributeName: font,
        //                         NSParagraphStyleAttributeName: style
        //                         }];
            
        //     [label drawInRect:CGRectMake(standardDimension * width / 2, standardDimension * dimensionPerDegree * degrees - rectHeight / 2, rectWidth, rectHeight)
        //        withAttributes:@{
        //                         NSForegroundColorAttributeName: [UIColor whiteColor],
        //                         //NSBackgroundColorAttributeName: [UIColor colorWithWhite:1 alpha:.2],
        //                         NSFontAttributeName: font,
        //                         NSParagraphStyleAttributeName: style
        //                         }];
        }




        ctx.restore();


        // arrow
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-standardDimension * .2, 0, standardDimension * .4, standardDimension * .01);
        ctx.fillRect(0, -standardDimension * .05, standardDimension * .01, standardDimension * .1);

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

        this.ctx.clearRect(0, 0, width, height);

        this.ctx.save();

        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(3,3);

        this.attitude.draw(this.ctx, this.state.euler.roll, this.state.euler.pitch);

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
        state += 1;
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