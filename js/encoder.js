window.Encoder = Base.extend({
    constructor: function() {
        this.dataUrl = null;
    },

    addImage: function(dataUrl) {
        this.dataUrl = dataUrl;
    },

    encode: function(msg) {
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


            var bits = [];

            // Convert the message to a stream of bits
            // TODO: Make true unicode and don't assume 8 bit characters
            for (var i=0; i<msg.length; i++) {
                var charByte = msg.charCodeAt(i);

                console.log("CharByte: ", charByte);

                for (var j=0; j<8; j++) {
                    console.log("Bit: ", 1 & charByte);
                    bits.push(1 & charByte);
                    charByte = charByte >> 1;
                }
            }

            console.log("Bits: ", bits);
            var bitLog = "";
            for (i=0; i<bits.length; i++) {
                bitLog += " " + bits[i];
            }
            console.log("Bits: ", bitLog);

            // Prepend the payload with a length identifier
            var length = bits.length;
            console.log("length should be: ", length);
            for (i=0; i<32; i++) {
                bits.unshift(1 & length);
                length = length >> 1;
            }

            // TODO: Instead of alerting about size use higher order bits
            var imgData = this.ctx.getImageData(0, 0, $canv.width(), $canv.height());

            if (imgData.width * imgData.height * 3 < bits.length) {
                alert("Message too big for image");
                return;
            }

            console.log("Length: ", bits.length);
            var ptr = 0;
            while(bits.length) {
                var myBit = bits.shift();
                imgData.data[ptr] = imgData.data[ptr] | myBit;

                // Variations in the alpha channel would make it easy to detect that
                // steganography is going on
                ptr++;
                if ((ptr+1) % 4 == 0) {
                    ptr++;
                }
            }
            this.ctx.putImageData(imgData, 0, 0);
            var outputImage = new Image();
            $(outputImage).attr('src', $canv.get(0).toDataURL('image/png'));
            $('#result').append(outputImage);
            $('#result').show();
        };
        $(image).attr('src', this.dataUrl);
    }
});