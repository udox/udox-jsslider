(function( $ ) {
    $.fn.udoxslider = function(options) {

        //Settings
        var settings = $.extend( {
            'globalDuration' : 20000, //How long it takes for the slider to slide by its self
            'direction' : 'left', // Which direction the slider moves in
            'liHeight' : 300, // Height of each image
            'liWidth' : 940, // Width of each image
            'offset' : 3, // Number of slides before current !Shouldn't need changing!
            'masks' : 'true', //Display masks over the non-current images
            'mask_hover' : 'true', //Allow sneak preview when the mask are hovered on
            'peak_size' : 27, // Size in pixels of sneak preview
            'direction_arrows' : 'true', // Display directional arrows
            'pagination' : 'true' // Turn the pagination bar on/off
        }, options);

        //Variables
        var mainContainer = $(this);
        var mainContainerParent = mainContainer.parent();
        var slideLi = $(this).children('.item');
        var liCount = slideLi.length;
        var windowSize = $('body').width();
        var slidemeWidth = (liCount*settings['liWidth']);
        var centerView = ((windowSize)-(settings['liWidth']))/2;
        var sliderWidth = mainContainerParent.width();
        var paginator_id = 'sliderPag';
        var active_slide = undefined;
        var cycleTimer;

        //Global styles setup
        $.easing.def = "easeInOutCirc";
        mainContainer.css({'width':+slidemeWidth+'px'});
        mainContainer.css({'height':+settings['liHeight']+'px'});
        mainContainer.css('left','0px');
        slideLi.css({'width':+settings['liWidth']+'px', 'height':+settings['liHeight']+'px'});
        slideLi.css({'display':'block'});
        mainContainerParent.css({
            'overflow-x' : 'hidden',
            'position' : 'absolute',
            'left' : '0px',
            'width' : '100%',
            'height' : +settings['liHeight']+'px'
        });

        //Scroll bar appears just in IE8, to fix random bug
        if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
          $('body').css('overflow-y','scroll');
        }

        //Function called after page loads
        $(window).load(
            function() {
                findMiddle();
                var windowSize = $('body').width();
                var slide_before_middle = settings['offset']-1;
                var visble_next_slide = settings['liWidth'] - centerView;
                var left_spacing = 0-(slide_before_middle*settings['liWidth'])-visble_next_slide;
                mainContainer.css({'margin-left': +left_spacing});
            }
        )

        //Function called when window is resized
        $(window).resize(function(){
            var windowSize = $(window).width();
            mainContainerParent.css({'width': +windowSize});
            var centerView = ((windowSize)-(settings['liWidth']))/2;
            var slide_before_middle = settings['offset']-1;
            var visble_next_slide = settings['liWidth'] - centerView;
            var left_spacing = 0-(slide_before_middle*settings['liWidth'])-visble_next_slide;

            mainContainer.css({'margin-left': +left_spacing});

            $(".mask").css({'width':+centerView+'px'});
        });

        function slideInit() {
            // Called when slider first loaded - we need to number our
            // slides for the pagination to work nicely

            if(settings['masks']=='true') {
                //Create masks to make edges opaque
                mainContainerParent.prepend('<div class="mask" id="mask-left"></div>');
                mainContainerParent.prepend('<div class="mask" id="mask-right"></div>');
                $(".mask").css({'width':+centerView+'px'}); 
                $(".mask").css({'height':+settings['liHeight']+'px'});
                $('#mask-left').bind("mouseenter", hoverLeftEnter).bind("mouseleave", hoverLeftLeave);
                $('#mask-right').bind("mouseenter", hoverRightEnter).bind("mouseleave", hoverRightLeave);
            }

            if(settings['direction_arrows']=='true') {
                //Create navigation arrows
                mainContainerParent.append('<div class="udox-slider-nav"></div>');
                $('.udox-slider-nav').append('<a href="#" id="prev_slide"></a>');
                $('.udox-slider-nav').append('<a href="#" id="next_slide"></a>');
            }

            if(settings['pagination']=='true') {
                // Create a container for direct slide links
                mainContainerParent.prepend('<ul class="'+paginator_id+'"></ul>');

                // Loop over each slide, add a class to ref. it and a link in the paginator
                var cnt = 1;
                slideLi.each(function (){
                    $(this).attr('id', 'slideno-'+cnt).children('.image-data').append('<h2>Slide#'+cnt+'</h2>');
                    $('.'+paginator_id).append('<li class="notCurrent-'+cnt+'"><a href="#" class="slide-jump" id="slide-target-'+cnt+'">'+cnt+'</a></li>');
                    cnt++;
                });
                $('.'+paginator_id+' li a.slide-jump').bind('click', bindPaginationClick);
            }
            
            moveSlider(undefined, -2);
        }
        slideInit();

        function showPagSlide(active_slide) {
            if(settings['pagination']=='true') {
                var currentSlide = (active_slide).replace(/[^\d]/g, '');
                var findMe = $(".notCurrent-"+currentSlide);
                $(findMe).addClass("current");
            }
        }

        function bindPaginationClick() {
            if(settings['pagination']=='true') {
                //Work out which slide to jump from too
                var targetSlide = ($(this).attr('id')).replace(/[^\d]/g, '');
                var currentSlide = (active_slide).replace(/[^\d]/g, '');
                var slideMoves = targetSlide-currentSlide;

                clearInterval(cycleTimer);
                if(targetSlide==currentSlide) {
                    $('.'+paginator_id+'li').addClass(current);
                }
                $('.'+paginator_id+' li a.slide-jump').clearQueue();
                moveSlider(undefined, slideMoves);
            }
        }

        function middleList() {
            /* Returns the middle list element for the current screen width
               and list element width */

            var middle = (settings['offset'])+1;

            return Math.floor(middle);
        }

        function findMiddle() {
            //Finds the middle slide and adds a class to it
            var sourceSlide = mainContainer.children(".item:nth-child(" + middleList() + ")");
            var slideContent = $(sourceSlide).find(".image-data").html();

            sourceSlide.addClass('current');

            active_slide = $(sourceSlide).attr('id');
            return({content: slideContent, name: active_slide});
        }

        function findFeatureText() {
            //Finds the featured text for the current slide
            var sourceSlide = mainContainer.children(".item:nth-child(" + (middleList() + settings['offset']) + ")");
            var textContent = $(sourceSlide).find(".featureText");

            return(textContent);
        }

        function moveSlider(override_dir, step) {
            //Calls all other functions and actually moves slider
            if(override_dir==undefined) {
                move_direction = settings['direction'];
            } else {
                move_direction = override_dir;
            }
            if(step===undefined) {
                step = 1;
            }
            var method = '-=';
            if(move_direction==='right') {
                method = '+=';
            }
            clearInterval(cycleTimer);
            $('#next_slide').unbind('click');
            $('#prev_slide').unbind('click');
            $('.'+paginator_id+' li a.slide-jump').unbind('click');

            if (step > 1 || step < 1) {
                moveSlide(move_direction, step);
            }

            $(mainContainer).animate({
                'left': method + settings['liWidth'] * step
            }, 600, 'swing', function() {
                if (step == 1) {
                    moveSlide(move_direction, step);
                }
                findMiddle();
                findFeatureText();
                showPagSlide(active_slide);
                $('#next_slide').click(nextClickHandler);
                $('#prev_slide').click(prevClickHandler);
                $('#mask-left').bind("mouseenter", hoverLeftEnter).bind("mouseleave", hoverLeftLeave);
                $('#mask-right').bind("mouseenter", hoverRightEnter).bind("mouseleave", hoverRightLeave);
                $('.'+paginator_id+' li a.slide-jump').bind("click", bindPaginationClick);
            });
            $(mainContainer).clearQueue();
            $('#next_slide').clearQueue();
            $('#prev_slide').clearQueue();
            $(mainContainer).css('left','0px');
            $('.'+paginator_id+' li').removeClass("current");
            slideLi.removeClass("current");
            startCycle();
        }

        function moveSlide(dir, n) {
            var slideLi = $(mainContainer).children('.item');
            //Decides which way slider is moving and append or preends appropriatly
            if(n===undefined) {
                n = 1;
            }
            if (dir === 'left') {
                $(mainContainer).append($(slideLi).slice(0, n));
                $(mainContainer).css('left', '+='+n*settings['liWidth']+'px');
            }
            if (dir === 'right') {
                $(mainContainer).prepend($(slideLi).slice(-1*n));
                $(mainContainer).css('left', '-='+n*settings['liWidth']+'px');
            }
        }

        //Tells the slider to move automatically at a set interval
        function startCycle() {
           cycleTimer = setInterval(function () {
              moveSlider(settings['direction'], 1);
            }, settings['globalDuration']);
        } startCycle();

        if(settings['mask_hover']=='true') {
            //Mask hover action
            var hoverLeftEnter = function(){
                mainContainer.animate({
                    'left': +settings['peak_size']+'px'
                    }, 400, 'swing');
            }
            var hoverLeftLeave = function(){
                mainContainer.animate({
                    'left': '0px'
                }, 400, 'swing', function() {
                    if($('#next_slide').data('events')===undefined || $('#prev_slide').data('events')===undefined) {
                    }
                });
            }
            var hoverRightEnter = function(){
                mainContainer.stop(true, false).animate({
                    'left': '-'+settings['peak_size']+'px'
                }, 400, 'swing');
            }
            var hoverRightLeave = function(){
                mainContainer.stop(true, false).animate({
                    'left': '0px'
                }, 400, 'swing', function() {
                    if($('#next_slide').data('events')===undefined || $('#prev_slide').data('events')===undefined) {
                    }
                });
            }
        }
        
        //Moves the slider by one in the opposite direction
        function direction_opposite() {
            if (settings['direction'] === 'left') {
                return 'right';
            } else {
                return 'left';
            }
        }

        //Handler for clicking next arrow
        var nextClickHandler = function(t){
            t=clearInterval(t);
            moveSlider();
            event.preventDefault();
        };

        //Handler for clicking previous arrow
        var prevClickHandler = function(t){
            t=clearInterval(t);
            moveSlider(direction_opposite());
            event.preventDefault();
        };
    };
})( jQuery );