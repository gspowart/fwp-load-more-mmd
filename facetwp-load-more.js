(function($) {
    $(function() {
        if ('object' !== typeof FWP) {
            return;
        }

        FWP.hooks.addFilter('facetwp/template_html', function(resp, params) {
            if (FWP.is_load_more) {
                FWP.is_load_more = false;
                $('.facetwp-template').append(params.html);
                return true;
            }
            return resp;
        });
    });

	
    $(document).on('click', '.fwp-load-more', function(event) {
		event.preventDefault();
        $('.fwp-load-more').html(FWP_JSON.load_more.loading_text);

        FWP.is_load_more = true; // set the flag
        FWP.load_more_paged += 1; // next page
        FWP.facets['paged'] = [FWP.load_more_paged]; // trick into adding URL var
        FWP.paged = FWP.load_more_paged; // grab the next page of results
        FWP.soft_refresh = true; // don't process facets
        FWP.is_reset = true; // don't parse facets
        FWP.refresh();
    });

    $(document).on('facetwp-loaded', function() {
        $('.fwp-load-more').html(FWP_JSON.load_more.default_text);

        if (FWP.settings.pager.page < FWP.settings.pager.total_pages) {
            $('.fwp-load-more').show();
        }
        else {
            $('.fwp-load-more').hide();
        }

		// if it's a fresh load
		// 	Work out the start number from the paged querystring
		// else
		//  
		var start = 1;
		if (FWP.start_page > 1) {
			start = (FWP.settings.pager.per_page * (FWP.start_page - 1)) + 1;
		}
		$('.facetwp-counts .lower').html(start);
		$('.fwp-load-more').attr('href','?fwp_paged=' + (FWP.load_more_paged + 1));

		console.log('Start ' + start);

	});

    $(document).on('facetwp-refresh', function() {
        if (! FWP.loaded) {
			console.log('not postback');
            var uv = FWP_HTTP.url_vars;
            var paged = ('undefined' !== typeof uv.paged) ? uv.paged : 1;
            FWP_JSON.load_more.default_text = $('.fwp-load-more').html();
            FWP.load_more_paged = parseInt(paged);
        }
        else {
			console.log('postback');
            if (! FWP.is_load_more) {
			console.log('not load more');
                FWP.load_more_paged = 1;
            }
        }
		if (FWP.start_page == null) { 
			FWP.start_page = FWP.load_more_paged;
		}

    });
})(jQuery);
