console.log("WTF");
window.Decoder = Base.extend({
    constructor: function(dataUrl) {
        var image = new Image();

        image.onload = function() {
            $img = $(image);
            var $canv = $('#outputCanvas');
            var width = image.width;
            var height = image.height;
            $canv.attr('width', width);
            $canv.attr('height', height);
            $canv.css('width', width + 'px');
            $canv.css('height', height + 'px');

            this.ctx = $canv.get(0).getContext('2d');

            this.ctx.drawImage($img.get(0), 0, 0);

            var imgData = this.ctx.getImageData(0, 0, width, height);

            var daData = imgData.data;
            var bits = [];
            ptr = 0;

            //var MASK = ~0 ^ 1;
            var length = 0;
            for (var i=0; i<32; i++) {
                length = (length << 1) | (daData[ptr] & 1);
                ptr++;
                if ((ptr+1) % 4 == 0) {
                    ptr++;
                }
            }

            var msg = "";
            var charBit = 0;
            var unicode = 0;
            console.log("Length: ", length);

            for (i=0; i<length; i++) {
                bits.push(daData[ptr] & 1);
                //unicode = (unicode << 1) | (daData[ptr] & 1);
                //console.log("Unicode: ", unicode);
                ptr++;
                if ((ptr+1) % 4 == 0) {
                    ptr++;
                }
                /*

                charBit++;
                if (charBit > 8) {
                    msg += String.fromCharCode(unicode);
                    console.log("Msg: ", msg);
                    unicode = 0;
                    charBit = 0;
                }
                */
            }
            console.log("Bits: ", bits);

            var bitLog = "";
            for (i=0; i<bits.length; i++) {
                bitLog += " " + bits[i];
            }
            console.log("Bits: ", bitLog);


            var mult = 0;
            var unicode = 0;
            while(bits.length) {
                var daBit = bits.shift();
                unicode += Math.pow(2, mult) * daBit;
                mult++;

                if (mult > 7) {
                    console.log("Unicode: ", unicode);
                    msg += String.fromCharCode(unicode);
                    console.log("Msg: ", msg);
                    mult = 0;
                    unicode = 0;

                }
                
            }
            $('#result').append(msg).show();

        };

        $(image).attr('src', dataUrl);
    }


});