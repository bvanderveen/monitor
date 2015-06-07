'use strict';

define(['jasmine', 'app/app'], function(jasmine, app) {
  describe('app', function(){

    beforeEach(function() {
    });

    it('should something', function () {
      expect(app.types).toEqual(['f32', 'quaternion', 'coordinate', 'sensor_state']);
    });
  });
});