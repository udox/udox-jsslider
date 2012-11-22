var totalWidth = $(window).width();
var sliderWidth = $("#contain_slider").width();
var globalDuration = 2000;
var direction = 'left';
var liHeight = 300;
var liWidth = 600;
var featureHeight = 400;
var featureWidth = 700;

$(document).ready(function() {

    $("li").css({'width':+liWidth+'px', 'height':+liHeight+'px'});
    $(".featuredSlide").css({'width':+featureWidth+'px', 'height':+featureHeight+'px'});

    function init() {
        $('.slide-data').hide();
    }
    init();

    function moveSlider(override_dir) {
        if(override_dir==undefined) {
            move_direction = direction;
        } else {
            move_direction = override_dir;
        }

        var method = '-=';
        if(move_direction==='right') {
            method = '+=';
        }
        $('.slideme').animate({
            'left': method + liWidth
        }, 'swing', function() {
            moveSlide(move_direction);
        });
        assignMiddle();
    }

    function moveSlide(direction) {
        if (direction === 'left') {
            $('.slideme').append($('.slideme li:first-child'));
            $('.slideme').css('left', '+='+liWidth+'px');
        }
        if (direction === 'right') {
            $('.slideme').prepend($('.slideme li:last-child'));
            $('.slideme').css('left', '-='+liWidth+'px');
        }
    }

    var t=setInterval(moveSlider, globalDuration);

    $("#contain_slider").hover(
      function () {
        $('.slideme').stop();
        t=clearInterval(t);
        $('.slideme').css('left','0px');
      }, 
      function () {
        moveSlider();
        t=setInterval(moveSlider, globalDuration);
      }
    );   

    function middleList() {
        /* Returns the middle list element for the current screen width
           and list element width */
        var middle = (sliderWidth/liWidth)/2;

        return Math.floor(middle);
    }            
     
    function findMiddle() {
        var offset = 0;
        if(direction==='left') {
            offset = 2;
        }
        var sourceSlide = $("ul li:nth-child(" + (middleList() + offset) + ")");
        var slideContent = $(sourceSlide).find(".slide-data").html(); 
        if (slideContent == undefined) {
            var slideContent = $(sourceSlide).find(".image-data").html(); 
        }
        return(slideContent);
    }

    function assignMiddle() {
        $('.featuredSlide').fadeOut('fast', function() {
            $('.featuredSlide').html(findMiddle());
            $('.featuredSlide').fadeIn('fast');
        });
    }  

    var dir_change = function() {
        if (direction === 'left') {
            direction = 'right';
        } else {
           direction = 'left';
        }
    };

    function direction_opposite() {
        if (direction==='left') {
            return 'right';
        } else {
            return 'left';
        }
    }

    $('#next_slide').click(function() {
        t=clearInterval(t);
        moveSlider();
    });

    $('#prev_slide').click(function() {
        t=clearInterval(t);
        moveSlider(direction_opposite());
    });

    function directionChanger() {
        var dirButton = $('#direction_changer');

        dirButton.bind("click", function() {

            dirButton.unbind("click");
            setTimeout(directionChanger, globalDuration);

            $('.slideme').stop();
            $('.slideme').animate({
                'left': '0px'
            }, 'swing', function() {
                dir_change();
            });
        });
    }
    directionChanger();

    $('.featuredSlide').click(function() {
        var lightSlide = $('.featuredSlide').html();
        $('.lightbox').css('display','block');
        $('.close').css('display','block');
        $('.lightbox').html(lightSlide);
        $('.lightboxContain, #cboxOverlay').fadeIn('slow');
    });

    $('.close, #cboxOverlay').click(function() {
        $('.close').css('display','none');
        $('.lightboxContain, #cboxOverlay, .lightbox').fadeOut('slow');
    });
});


















