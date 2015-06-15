define(['underscore', 'lib/libschema', 'lib/libcaut/cauterize', 'lib/libcaut/buffer'], function(_, schema, cauterize, buffer) {
    "use strict";

    var exports = {};

    function MessageSource() {

    };

    MessageSource.prototype.setDelegate = function(delegate) {
        this.delegate = delegate;
    };

    MessageSource.prototype.connect = function() {
        function val3(x, y, z, t) {
            return new schema.Val3T({
                x: schema.F32.fromJS(x),
                y: schema.F32.fromJS(y),
                z: schema.F32.fromJS(z),
                t: schema.F32.fromJS(t)
            });
        };

        function val4(w, x, y, z, t) {
            return new schema.Val3T({
                w: schema.F32.fromJS(w),
                x: schema.F32.fromJS(x),
                y: schema.F32.fromJS(y),
                z: schema.F32.fromJS(z),
                t: schema.F32.fromJS(t)
            });
        };

        function gpsPosition(lat, lon, alt, t) {
            return new schema.GpsPositionT({
                lat: schema.F32.fromJS(lat),
                lon: schema.F32.fromJS(lon),
                alt: schema.F32.fromJS(alt),
                t: schema.F32.fromJS(t),
            })
        };

        function gpsVelocity(speed, course) {
            return new schema.GpsVelocityT({
                course: schema.F32.fromJS(speed),
                speed: schema.F32.fromJS(course),
            });
        }

        var t = 1400000;

        var m = new schema.SensorStateT({
            mag_reading: val3(-1.0, 0, 0, t),
            acc_reading: val3(0, -9.8, 0, t),
            gyr_reading: val3(0.0, 0, 0, t),
            quat_reading: val4(0.0, 0, 0, 0, t),
            gps_position: gpsPosition(45.5, -122.2, 100, t),
            gps_velocity: gpsVelocity(50, 270)
        });

        this.delegate.onMessage({
            lat: m.fields.gps_position.fields.lat.toJS(),
            lon: m.fields.gps_position.fields.lon.toJS(),
            alt: m.fields.gps_position.fields.alt.toJS(),
            euler: {
                pitch: 10,
                roll: 30
            }
        });
    };

    MessageSource.prototype.disconnect = function() {
        
    };

    exports.MessageSource = MessageSource;


    function WebsocketMessageSource() {

    };

    WebsocketMessageSource.prototype.setDelegate = function(delegate) {
        console.log("set deelgate");
        this.delegate = delegate;
    };

    WebsocketMessageSource.prototype.connect = function() {
        console.log("connecting");
        this.socket = new WebSocket("wss://127.0.0.1:8888/connect");
        this.socket.binaryType = 'arraybuffer';

        var self = this;
        this.socket.onopen = function(e) { self.onOpen(e); };
        this.socket.onclose = function(e) { self.onClose(e); };
        this.socket.onmessage = function(e) { self.onMessage(e); };
        this.socket.onerror = function(e) { self.onError(e); };
    };

    WebsocketMessageSource.prototype.disconnect = function() {
        this.socket.onopen = null;
        this.socket.onclose = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket = null;
    };

    WebsocketMessageSource.prototype.onOpen = function (e) {
        console.log("onOpen");
    };

    WebsocketMessageSource.prototype.onClose = function (e) {
        console.log("onClose");
    };

    WebsocketMessageSource.prototype.onMessage = function (e) {
        var c = new cauterize.Cauterize(schema.SpecificationInfo);

        var b = new buffer.CautBuffer();
        b.addU8Array(new Uint8Array(e.data));

        
        var message = c.decode(b);
        this.delegate.onMessage(message);
    };

    WebsocketMessageSource.prototype.onError = function (e) {
        console.log("onError");
    };

    exports.WebsocketMessageSource = WebsocketMessageSource;

    return exports;
});