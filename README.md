# YouTube Videos

jQuery plugin that lets you show YouTube videos.

### Examples

The plugin can be seen live here: [http://beta.thomasclausen.dk/youtube/](http://beta.thomasclausen.dk/youtube/)

### Usage

Insert the following code to activate the pluign:

    (function($) {
        $(document).ready(function(){
            $('#youtube_list').youtube_cinema();
        });
    })(jQuery);

or:

    (function($) {
        $(document).ready(function(){
            $('#youtube_list').youtube_video();
        });
    })(jQuery);

options:

    use_link_title: false - choices: 'true' or 'false'
    timeout: 400 - any amount (in miliseconds)
    speed: 400 - any amount (in miliseconds)
    effect: 'slide' - choices: 'slide', 'fade' or 'none'
    show_caption: true - choices: 'true' or 'false'
    show_title: true - choices: 'true' or 'false'
    show_description: true - choices: 'true' or 'false'
    description_length: 0 - the length of the message

### Feedback

I'm self-taught by scattering code across the web, so if you see some bad practices PLEASE contact me, so I can learn from the mistakes I'm making!

Also feel free to contact me if you have som great ideas for improvements.

### License

Credits would be nice, but feel free to use as often as you like.
