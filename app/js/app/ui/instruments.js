define([], function() {
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
    };

    return {
        AttitudeIndicator: AttitudeIndicator
    }
})