(function($) {
    "use strict";

    var _body = $('body'),
        _mask  = $('.processing-mask'),
        _wrap  = $('#image-wrapper'),
        _input  = $('#input-file'),
        _space = $('#input-select'),
        _fix = $('.fix-image-space'),
        _processing = [];
        _mask.hide();

    if (!window.FileReader) {
        _mask.find('.processing-text').text('当前浏览器无法读取本地文件，换个浏览器试试吧~');
        return _mask.show();
    } else {
        _input.on('change', readFile);
        _space.on('change', function(){
            readFile.call(_input[0]);
        });
    }

    function readFile(ev) {
        _wrap.html('');

        $.map(this.files, function(file) {
            if (!/image\/\w+/.test(file.type)) {return alert("请选择图片文件");}

            var _reader = new FileReader();
            _reader.onload = function(e) {

                var _img = new Image();
                _img.onload = _img.onerror = function(){

                    AlloyImage.useWorker('/aliar/static/js/demo/alloyimage.js');
                    AlloyImage(this)
                        .add(AlloyImage(this) , '变亮', 0, +_space.val() || 6)
                        .act('brightness', 0, 5)
                        // .act('sharp', 5)
                        .act('gaussBlur', 2)
                        .replace(this)
                        .complete(function(){
                            _wrap.append($(_img).css({'margin': '10px 0'}) );
                            _processing.shift(1);
                            (_processing.length < 1) && _mask.hide();
                            _fix.show();
                        });
                };
                _img.src = this.result;
            }
            _processing.push(false) && _mask.show();
            _reader.readAsDataURL(file);
        });
    }
})(jQuery);