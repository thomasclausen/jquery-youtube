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
			description_length: 0 // Any amount you like. Above 0 shortens the description length
		}, options);
	
		var e = $(this);

		var youtube_cinema_html = '<div id="youtube_cinema"><div class="youtube_cinema_overlay"></div><div class="youtube_cinema_box"><a href="#" id="youtube_cinema_close">Close</a><div class="youtube_cinema_content"><iframe width="640" height="480" src="" frameborder="0" allowfullscreen wmode="opaque"></iframe></div><div class="youtube_cinema_caption"></div></div></div>';
		$('body').append(youtube_cinema_html);

		var youtube_cinema = $('#youtube_cinema');

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
			
			var videoDATA = 'http://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=jsonc&callback=?';

			$.getJSON(videoDATA, function(video) {
				$.each(video, function() {
					var output = '';

					if (video.data.aspectRatio == 'widescreen') {
						$('li', e).eq(v).attr('data-aspect-ratio', video.data.aspectRatio);
					}
					if (options.use_link_title == true) {
						output += '<div class="title">' + video.data.title + '</div>';
					} else {
						output += '<div class="title">' + link_title + '</div>';
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
			if ($('.youtube_cinema_box', youtube_cinema).is(':animated') || $('.youtube_cinema_overlay', youtube_cinema).is(':animated')) { return false; }

			var video_url = $(this).attr('href');
			if (video_url.indexOf('youtu.be') > 0) {
				var split_video_url = video_url.split('/');
				var video_id = split_video_url[3];
			} else if (video_url.indexOf('youtube.com') > 0) {
				var split_video_url = video_url.split('=');
				var video_id = split_video_url[1];
			}
			var widescreen = $(this).parent().attr('data-aspect-ratio');
			var title = $('.title', this).text();
			var description = $('.description', this).text();

			var share_url = $(this).parent().siblings('.fakta').attr('data-permalink');

			$('iframe', youtube_cinema).attr('src', 'http://www.youtube.com/embed/' + video_id + '?wmode=transparent');
			$('.youtube_cinema_caption', youtube_cinema).html('<p class="title">' + title + '</p><p class="description">' + modText(description) + '</p>');

			if (options.show_title == false) {
				$('.youtube_cinema_box .title', youtube_cinema).css({'display': 'none'});
			}
			if (options.show_description == false) {
				$('.youtube_cinema_box .description', youtube_cinema).css({'display': 'none'});
			}
			if (widescreen == 'widescreen') {
				$('.youtube_cinema_box', youtube_cinema).css({'height': 360}).find('iframe').css({'height': 360});
			} else {
				$('.youtube_cinema_box', youtube_cinema).css({'height': 480}).find('iframe').css({'height': 480});
			}

			if (options.effect == 'none') {
				$('.youtube_cinema_overlay', youtube_cinema).show();
				$('.youtube_cinema_box', youtube_cinema).show();
				if (options.show_caption == true) {
					$('.youtube_cinema_caption', youtube_cinema).show();
				}
			} else { 
				$('.youtube_cinema_overlay', youtube_cinema).fadeIn((options.speed/2), function() {
					if (options.effect == 'fade') {
						$('.youtube_cinema_box', youtube_cinema).fadeIn(options.speed, function() {
							if (options.show_caption == true) {
								$('.youtube_cinema_caption', youtube_cinema).delay(options.timeout).fadeIn(options.speed);
							}
						});
					} else {
						$('.youtube_cinema_box', youtube_cinema).css({'top': -$('.youtube_cinema_box', youtube_cinema).outerHeight()}).show().animate({'top': 100}, options.speed, function() {
							if (options.show_caption == true) {
								$('.youtube_cinema_caption', youtube_cinema).delay(options.timeout).slideDown(options.speed, function() {
									$(this).css('overflow', 'visible');
								});
							}
						});
					}
				});
			}

			e.preventDefault();
		});

		$('.youtube_cinema_overlay, #youtube_cinema_close', youtube_cinema).click(function(e) {
			if ($('.youtube_cinema_box', youtube_cinema).is(':animated') || $('.youtube_cinema_overlay', youtube_cinema).is(':animated')) { return false; }
			if (options.effect == 'none') {
				$('.youtube_cinema_overlay', youtube_cinema).hide();
				$('.youtube_cinema_box', youtube_cinema).hide();
				$('.youtube_cinema_caption', youtube_cinema).hide();
				$('iframe', youtube_cinema).attr('src', '');
			} else if (options.effect == 'fade') {
				$('.youtube_cinema_box', youtube_cinema).fadeOut((options.speed/2), function() {
					$('.youtube_cinema_overlay', youtube_cinema).fadeOut(options.speed/2);
					$('.youtube_cinema_caption', youtube_cinema).hide();
					$('iframe', youtube_cinema).attr('src', '');
				});
			} else {
				$('.youtube_cinema_box', youtube_cinema).fadeOut((options.speed/2), function() {
					$('.youtube_cinema_overlay', youtube_cinema).fadeOut(options.speed/2);
					$('.youtube_cinema_caption', youtube_cinema).hide();
					$('iframe', youtube_cinema).attr('src', '');
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
