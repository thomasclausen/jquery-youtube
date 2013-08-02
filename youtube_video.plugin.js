(function($) {
	$.fn.youtube_video = function(options) {
		options = $.extend({
			use_video_title: false, // true | false
			timeout: 400,
			speed: 400,
			effect: 'slide', // slide | fade | none
			show_caption: true, // true | false
			show_title: true, // true | false
			show_description: true, // true | false
			description_length: 0 // Any amount you like. Above 0 shortens the description length
		}, options);
	
		var e = $(this);

		var youtube_video_html = '<div id="youtube_video"><a href="#" id="youtube_video_close">Close</a><div class="youtube_video_content"><iframe width="640" height="480" src="" frameborder="0" allowfullscreen wmode="opaque"></iframe></div><div class="youtube_video_caption"></div></div>';
		$(youtube_video_html).insertAfter(e);

		var youtube_video = $('#youtube_video');

		$('li', e).each(function(v) {
			var link_url = $('a', this).attr('href');
			if (link_url.indexOf('youtu.be') > 0) {
				var split_link_url = link_url.split('/');
				var video_id = split_link_url[3];
			} else if (link_url.indexOf('youtube.com') > 0) {
				var split_link_url = link_url.split('=');
				var video_id = split_link_url[1];
			}
			var link_title = $('a', this).text();
			
			var videoDATA = 'https://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=jsonc&callback=?';

			$.getJSON(videoDATA, function(video) {
				$.each(video, function() {
					var output = '';

					if (video.data.aspectRatio === 'widescreen') {
						$('li', e).eq(v).attr('data-aspect-ratio', video.data.aspectRatio);
					}
					if (options.use_video_title === true) {
						output += '<div class="title" data-video-title="' + escape(video.data.title) + '">' + video.data.title + '</div>';
					} else {
						output += '<div class="title" data-video-title="' + escape(video.data.title) + '">' + link_title + '</div>';
					}
					output += '<div class="image"><img src="http://i.ytimg.com/vi/' + video_id + '/mqdefault.jpg" /></div>';
					if (options.description_length != 0 && video.data.description.length > options.description_length) {
						output += '<div class="description">' + video.data.description.substring(0, options.description_length) + '...</div>';
					} else {
						output += '<div class="description">' + video.data.description + '</div>';
					}

					$('li', e).eq(v).find('a').html(output);
				});
			});
		});

		$('li a', e).click(function(e) {
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
			var title = unescape($('.title', this).attr('data-video-title'));
			var description = $('.description', this).text();

			$('iframe', youtube_video).attr('src', 'http://www.youtube.com/embed/' + video_id + '?wmode=transparent');
			$('.youtube_video_caption', youtube_video).html('<p class="title">' + title + '</p><p class="description">' + modText(description) + '</p>');

			if (options.show_title === false) {
				$('.youtube_video_caption .title', youtube_video).css({'display': 'none'});
			}
			if (options.show_description === false) {
				$('.youtube_video_caption .description', youtube_video).css({'display': 'none'});
			}
			if (widescreen === 'widescreen') {
				$('.youtube_video_content', youtube_video).css({'height': 360}).find('iframe').css({'height': 360});
			} else {
				$('.youtube_video_content', youtube_video).css({'height': 480}).find('iframe').css({'height': 480});
			}

			if (options.effect === 'none') {
				youtube_video.show();
				if (options.show_caption === true) {
					$('.youtube_video_caption', youtube_video).show();
				}
			} else if (options.effect === 'fade') {
				if (youtube_video.is(':visible')) {
					youtube_video.fadeOut(options.speed, function() {
						youtube_video.fadeIn(options.speed, function() {
							if (options.show_caption === true) {
								$('.youtube_video_caption', youtube_video).delay(options.timeout).fadeIn(options.speed);
							}
						});
					});
				} else {
					youtube_video.fadeIn(options.speed, function() {
						if (options.show_caption === true) {
							$('.youtube_video_caption', youtube_video).delay(options.timeout).fadeIn(options.speed);
						}
					});
				}
			} else {
				if (youtube_video.is(':visible')) {
					youtube_video.slideUp(400, function() {
						youtube_video.slideDown(options.speed, function() {
							if (options.show_caption === true) {
								$('.youtube_video_caption', youtube_video).delay(options.timeout).slideDown(options.speed, function() {
									$(this).css('overflow', 'visible');
								});
							}
						});
					});
				} else {
					youtube_video.slideDown(options.speed, function() {
						if (options.show_caption === true) {
							$('.youtube_video_caption', youtube_video).delay(options.timeout).slideDown(options.speed, function() {
								$(this).css('overflow', 'visible');
							});
						}
					});
				}
			}

			e.preventDefault();
		});

		$('#youtube_video_close', youtube_video).click(function(e) {
			if (youtube_video.is(':animated')) { return false; }
			if (options.effect === 'none') {
				youtube_video.hide();
				$('.youtube_video_caption', youtube_video).hide();
				$('iframe', youtube_video).attr('src', '');
			} else if (options.effect === 'fade') {
				youtube_video.fadeOut((options.speed/2), function() {
					$('.youtube_video_caption', youtube_video).hide();
					$('iframe', youtube_video).attr('src', '');
				});
			} else {
				youtube_video.slideUp((options.speed/2), function() {
					$('.youtube_video_caption', youtube_video).hide();
					$('iframe', youtube_video).attr('src', '');
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
