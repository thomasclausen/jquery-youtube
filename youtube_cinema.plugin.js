(function($) {
	$.fn.youtube_cinema = function(options) {
		options = $.extend({
			use_link_title: false, // true | false
			timeout: 400,
			speed: 400,
			effect: 'slide', // slide | fade | none
			show_caption: true, // true | false
			show_title: true, // true | false
			show_description: true, // true | false
			description_length: 0, // Any amount you like. Above 0 shortens the description length
		}, options);
	
		var e = $(this);

		var youtube_cinema_html = '<div id="youtube_cinema"><div class="youtube_cinema_overlay"></div><div class="youtube_cinema_box"><a href="#" id="youtube_cinema_close">Close</a><div class="youtube_cinema_content"><iframe width="640" height="480" src="" frameborder="0" allowfullscreen wmode="opaque"></iframe></div><div class="youtube_cinema_caption"></div></div></div>';
		$('body').append(youtube_cinema_html);

		var youtube_cinema = $('#youtube_cinema');

		e.children('li').each(function(v) {
			var link_url = $(this).find('a').attr('href');
			if (link_url.indexOf('youtu.be') > 0) {
				var split_link_url = link_url.split('/');
				var video_id = split_link_url[3];
			} else if (link_url.indexOf('youtube.com') > 0) {
				var split_link_url = link_url.split('=');
				var video_id = split_link_url[1];
			}
			var link_title = $(this).find('a').text();
			
			var videoDATA = 'http://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=jsonc&callback=?';

			$.getJSON(videoDATA, function(video) {
				$.each(video, function() {
					var output = '';

					if (video.data.aspectRatio == 'widescreen') {
						e.children('li').eq(v).attr('data-aspect-ratio', video.data.aspectRatio);
					}
					if (options.use_link_title == true) {
						output += '<div class="title">' + video.data.title + '</div>';
					} else {
						output += '<div class="title">' + link_title + '</div>';
					}
					output += '<div class="image"><img src="http://i.ytimg.com/vi/' + split_link_url[3] + '/mqdefault.jpg" /></div>';
					if (options.description_length != 0 && video.data.description.length > options.description_length) {
						output += '<div class="description">' + video.data.description.substring(0, options.description_length) + '...</div>';
					} else {
						output += '<div class="description">' + video.data.description + '</div>';
					}

					e.children('li').eq(v).find('a').html(output);
				});
			});
		});

		e.children('li').find('a').click(function(e) {
			if (youtube_cinema.children('.youtube_cinema_box').is(':animated') || youtube_cinema.children('.youtube_cinema_overlay').is(':animated')) { return false; }

			var video_url = $(this).attr('href');
			if (video_url.indexOf('youtu.be') > 0) {
				var split_video_url = video_url.split('/');
				var video_id = split_video_url[3];
			} else if (video_url.indexOf('youtube.com') > 0) {
				var split_video_url = video_url.split('=');
				var video_id = split_video_url[1];
			}
			var widescreen = $(this).parent().attr('data-aspect-ratio');
			var title = $(this).find('.title').text();
			var description = $(this).find('.description').text();

			var share_url = $(this).parent().siblings('.fakta').attr('data-permalink');

			youtube_cinema.find('iframe').attr('src', 'http://www.youtube.com/embed/' + video_id + '?wmode=transparent');
			youtube_cinema.find('.youtube_cinema_caption').html('<p class="title">' + title + '</p><p class="description">' + modText(description) + '</p>');

			if (options.show_title == false) {
				youtube_cinema.find('.youtube_cinema_box .title').css({'display': 'none'});
			}
			if (options.show_description == false) {
				youtube_cinema.find('.youtube_cinema_box .description').css({'display': 'none'});
			}
			if (widescreen == 'widescreen') {
				youtube_cinema.find('.youtube_cinema_box').css({'height': 360}).find('iframe').css({'height': 360});
			} else {
				youtube_cinema.find('.youtube_cinema_box').css({'height': 480}).find('iframe').css({'height': 480});
			}

			if (options.effect == 'none') {
				youtube_cinema.find('.youtube_cinema_overlay').show();
				youtube_cinema.find('.youtube_cinema_box').show();
				if (options.show_caption == true) {
					youtube_cinema.find('.youtube_cinema_caption').show();
				}
			} else { 
				youtube_cinema.find('.youtube_cinema_overlay').fadeIn((options.speed/2), function() {
					if (options.effect == 'fade') {
						youtube_cinema.find('.youtube_cinema_box').fadeIn(options.speed, function() {
							if (options.show_caption == true) {
								youtube_cinema.find('.youtube_cinema_caption').delay(options.timeout).fadeIn(options.speed);
							}
						});
					} else {
						youtube_cinema.find('.youtube_cinema_box').css({'top': -youtube_cinema.find('.youtube_cinema_box').outerHeight()}).show().animate({'top': 100}, options.speed, function() {
							if (options.show_caption == true) {
								youtube_cinema.find('.youtube_cinema_caption').delay(options.timeout).slideDown(options.speed);
							}
						});
					}
				});
			}

			e.preventDefault();
		});

		youtube_cinema.find('.youtube_cinema_overlay, #youtube_cinema_close').click(function(e) {
			if (youtube_cinema.children('.youtube_cinema_box').is(':animated') || youtube_cinema.children('.youtube_cinema_overlay').is(':animated')) { return false; }
			if (options.effect == 'none') {
				youtube_cinema.find('.youtube_cinema_overlay').hide();
				youtube_cinema.find('.youtube_cinema_box').hide();
				youtube_cinema.find('.youtube_cinema_caption').hide();
				youtube_cinema.find('iframe').attr('src', '');
			} else if (options.effect == 'fade') {
				youtube_cinema.find('.youtube_cinema_box').fadeOut((options.speed/2), function() {
					youtube_cinema.find('.youtube_cinema_overlay').fadeOut(options.speed/2);
					youtube_cinema.find('.youtube_cinema_caption').hide();
					youtube_cinema.find('iframe').attr('src', '');
				});
			} else {
				youtube_cinema.find('.youtube_cinema_box').fadeOut((options.speed/2), function() {
					youtube_cinema.find('.youtube_cinema_overlay').fadeOut(options.speed/2);
					youtube_cinema.find('.youtube_cinema_caption').hide();
					youtube_cinema.find('iframe').attr('src', '');
				});
			}
			e.preventDefault();
		});

		function modText(text) {
			return nl2br(autoLink(escapeTags(text)));
		}
		function nl2br(str) {
			return str.replace(/(\r\n)|(\n\r)|\r|\n/g, '<br />');
		}
		function autoLink(str) {
			return str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
		}
		function escapeTags(str) {
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
	};
})(jQuery);