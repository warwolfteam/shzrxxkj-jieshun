$('.menuLocat').after("<div class='mh'></div>");
$(window).scroll(function () {
				var stop=$(document).scrollTop()
				    var mst=$('.menuLocat').offset().top
					var mh=$('.menuLocat').outerHeight();
	                 var tah=$('.top').outerHeight()
                if ( stop>= mst-tah) {
                    $('.top').css('top',-tah);
					$(".mh").outerHeight(mh);
                    $('.menuLocat').css({'position':'fixed','top':'0px'});
                    //$('.sersupmenu').css('margin-top','0px')
                    $('.menuLocat.menuLocatJMFS').removeClass('menuLocatonbg');
                }
				
                if (stop <= $(".mh").offset().top-mh) {
                    $('.top').css('top','0');
					$(".mh").outerHeight(0);
                    $('.menuLocat').css('position','static');
                  //  $('.sersupmenu').css('margin-top','81px');
                     $('.menuLocat.menuLocatJMFS').addClass('menuLocatonbg');

                }
					
            });