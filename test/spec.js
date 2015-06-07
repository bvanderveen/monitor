'use strict';

define(['jasmine', 'app/app', 'lib/libschema', 'lib/libcaut/cauterize', 'lib/libcaut/buffer', 'lib/libcaut/prototypes'], function(jasmine, app, schema, cauterize, buffer, prototypes) {
  describe('app', function(){

    beforeEach(function() {
    });

    it('should encode and decode messages', function () {
        var c = new cauterize.Cauterize(schema.SpecificationInfo);

        var encodedData = c.encode(new schema.PidConfigT({
            p_gain: schema.F32.fromJS(1.0),
            i_gain: schema.F32.fromJS(2.0),
            d_gain: schema.F32.fromJS(3.0),
        }));

        var decodeBuffer = new buffer.CautBuffer();

        decodeBuffer.append(encodedData);

        var decodedObject = c.decode(decodeBuffer);

        expect(decodedObject.fields.p_gain.toJS()).toEqual(1.0);
        expect(decodedObject.fields.i_gain.toJS()).toEqual(2.0);
        expect(decodedObject.fields.d_gain.toJS()).toEqual(3.0);
    });
  });
});