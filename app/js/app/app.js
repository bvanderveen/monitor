define(['underscore', 'lib/libschema'], function(_, schema) {
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

    return exports;
});