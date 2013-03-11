udox-jsslider
=============

Slider in jquery for various **UDOX** sites, we use this across django &amp; wp apps and have basic admins for both

## UDOX Custom Slider

The U-dox slider was built and designed by the U-dox crew, it's features include:
Simple, semantic markup
Supported in all major browser
Vertical slide animation
Choice of slider navigation, pagination and directional arrows

To use the U-dox slider download the source code, within it you will find two css files, two jQuery files and an index HTML file, you will also find some images to get you started.

To get started you must include jQuerry, the link goes into the `<head>` section of your HTML file, you can host this yourself or use Google's: 

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

Next you need to include the U-dox slider js file, this can be found in the JS folder, attach it in the `<head>` section of your HTML code like so: 

    <script defer src="js/jquery.udoxslider.js"></script>

The next step involves you making a decision about which CSS to use, please do not add both as they are the same, the slider.css file can be added to the `<head>` section of your HTML document like so: 

    <link rel="stylesheet" type="text/css" href="css/slider.css">

However, if you would like to use the less file you must also add the less-1.2.0.min.js file which can be found in the js folder you downloaded earlier, you have to include this file after the less css file, so to use this your head section will look like this: 
    
    <link rel="stylesheet/less" type="text/css" href="css/slider.less">
    <script src="js/less-1.2.0.min.js" type="text/javascript"></script>

More information about less can be found here: [lesscss](http://lesscss.org/).

To add the slides into your HTML add the following code where you would like the slider to appear:

    <div id="contain_slider">
        <ul class="slideme">
            <li class="current">
                <a href="">
                    <div class="image-data">
                        <img src="http://placehold.it/940x300/000" />
                    </div>
                    <div class="featureText">
                        <h3>Title</h3>
                        <p>Add text here</p>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <div class="image-data">
                        <img src="http://placehold.it/940x300/fff" />
                    </div>
                    <div class="featureText">
                        <h3>Title</h3>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</p>
                    </div>
                </a>
            </li>
        </ul>
    </div>

You can call the container div and ul, whatever you would like, but they will both need names, then each li is a new slide, within it you can add a link within the `<a href="add URL here">` or you can add and image or text in the following tweo divs.

Finally, you need to call the udox slider, you do this in the `<head>` section of your HTML document, like this:

    <script>
        jQuery(document).ready(function() {
            jQuery('.slideme').udoxslider({
            });
        });
    </script>

The .slideme in this case would be the name of your ul.

There are many options you can add to the above code, they are listed below with a brief description:

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


The slider will not sit centrally unless body has margings set to 0, this is already set in our CSS


## JS 1.9 IE fix

Add this to the head of your HTML document:
<!--[if IE 8]>
    <style type="text/css">
        body {
            overflow-y: scroll;
        }
    </style>
<![endif]-->

And this can be removed from the JS:
//Scroll bar appears just in IE8, to fix random bug
if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
  $('body').css('overflow-y','scroll');
} 
