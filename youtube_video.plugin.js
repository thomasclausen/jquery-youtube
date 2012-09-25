(function($) {
	$.fn.youtube_video = function(options) {
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

		var youtube_video_html = '<div id="youtube_video"><a href="#" id="youtube_video_close">Close</a><div class="youtube_video_content"><iframe width="640" height="480" src="" frameborder="0" allowfullscreen wmode="opaque"></iframe></div><div class="youtube_video_caption"></div></div>';
		$(youtube_video_html).insertAfter(e);

		var youtube_video = $('#youtube_video');

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
			
			var videoDATA = 'http://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=jsonc';

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
			if (youtube_video.is(':animated')) { return false; }

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

			youtube_video.find('iframe').attr('src', 'http://www.youtube.com/embed/' + video_id + '?wmode=transparent');
			youtube_video.find('.youtube_video_caption').html('<p class="title">' + title + '</p><p class="description">' + modText(description) + '</p>');

			if (options.show_title == false) {
				youtube_video.find('.youtube_video_caption .title').css({'display': 'none'});
			}
			if (options.show_description == false) {
				youtube_video.find('.youtube_video_caption .description').css({'display': 'none'});
			}
			if (widescreen == 'widescreen') {
				youtube_video.find('.youtube_video_content').css({'height': 360}).find('iframe').css({'height': 360});
			} else {
				youtube_video.find('.youtube_video_content').css({'height': 480}).find('iframe').css({'height': 480});
			}

			if (options.effect == 'none') {
				youtube_video.show();
				if (options.show_caption == true) {
					youtube_video.find('.youtube_video_caption').show();
				}
			} else if (options.effect == 'fade') {
				if (youtube_video.is(':visible')) {
					youtube_video.fadeOut(options.speed, function() {
						youtube_video.fadeIn(options.speed, function() {
							if (options.show_caption == true) {
								youtube_video.find('.youtube_video_caption').delay(options.timeout).fadeIn(options.speed);
							}
						});
					});
				} else {
					youtube_video.fadeIn(options.speed, function() {
						if (options.show_caption == true) {
							youtube_video.find('.youtube_video_caption').delay(options.timeout).fadeIn(options.speed);
						}
					});
				}
			} else {
				if (youtube_video.is(':visible')) {
					youtube_video.slideUp(400, function() {
						youtube_video.slideDown(options.speed, function() {
							if (options.show_caption == true) {
								youtube_video.find('.youtube_video_caption').delay(options.timeout).slideDown(options.speed);
							}
						});
					});
				} else {
					youtube_video.slideDown(options.speed, function() {
						if (options.show_caption == true) {
							youtube_video.find('.youtube_video_caption').delay(options.timeout).slideDown(options.speed);
						}
					});
				}
			}

			e.preventDefault();
		});

		youtube_video.find('#youtube_video_close').click(function(e) {
			if (youtube_video.is(':animated')) { return false; }
			if (options.effect == 'none') {
				youtube_video.hide();
				youtube_video.find('.youtube_video_caption').hide();
				youtube_video.find('iframe').attr('src', '');
			} else if (options.effect == 'fade') {
				youtube_video.fadeOut((options.speed/2), function() {
					youtube_video.find('.youtube_video_caption').hide();
					youtube_video.find('iframe').attr('src', '');
				});
			} else {
				youtube_video.slideUp((options.speed/2), function() {
					youtube_video.find('.youtube_video_caption').hide();
					youtube_video.find('iframe').attr('src', '');
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