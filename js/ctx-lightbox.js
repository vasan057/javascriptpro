(function($) {
	/*
	 * CTX Lightbox v.1
	 * Initial implementation only opens an overlay which then must be populated by content on later development
	 * 
	 * TODO:
	 * 
	 */
    $.fn.ctxLightbox = function(options) {
    	
    	var lightboxHtml = '<div class="ctx-lightbox-overlay"></div><div class="ctx-lightbox"><div class="ctx-lightbox-close"><span class="icon-decline"></span></div><div class="ctx-lightbox-content"></div></div>';
    	
        options = $.extend({
        	overlay: ".ctx-lightbox-overlay",
        	contentBox: ".ctx-lightbox-content",
        	lightbox: ".ctx-lightbox",
        	x: "",
        	y: "",
        	data: "",
            closeLightbox: function(e){
            	$(options.contentBox).html("");
            	$("html").addClass("lb-loading").removeClass("lb-open");
            	$(options.overlay).velocity({ scale: 1 }, 400, function(){
	    			//after animation completes
            		$("html").addClass("lb-closed").removeClass("lb-loading");
            		$(options.overlay).removeAttr("style");
            		$(options.lightbox).removeAttr("style");
					$(document).trigger('ctx:lightbox-closed', [e]);
	    		});
            },
	        openLightbox: function(e){
	        	$("html").addClass("lb-loading");
	        	loadContent(options.data.type);
	        	var scale = getScale(options.x, options.y, $(options.lightbox).height(), $(options.lightbox).width()),
	        		radius = $(options.overlay).width()/2;
	        	$("html").removeClass("lb-closed");
	        	$(options.overlay).css({"left": (options.x-radius)+"px", "top": (options.y-radius)+"px", "transform": "translateX(0px) scale(1)", "visibility": "visible"});
	        	$(options.overlay).velocity({ scale: scale }, 400, function(){
	    			//after animation completes
	        		$("html").addClass("lb-open").removeClass("lb-loading");
	    		});
				$(document).trigger('ctx:lightbox-opened', [e]);
	        },
	        getOverlay: function(){
	        	return $(options.overlay);
	        },
	        resizeOverlay: function(){
	        	var scale = getScale(options.x, options.y, $(options.lightbox).height(), $(options.lightbox).width()),
	        		radius = $(options.overlay).width()/2;
	        	$(options.overlay).css({"left": (options.x-radius)+"px", "top": (options.y-radius)+"px"});
	        	$(options.overlay).velocity({ scale: scale }, 400);
	        }
        }, options);
                
        $.fn.ctxLightbox.settings = options;
        
        var getScale = function(x, y, windowHeight, windowWidth){
        	
        	var maxDistHor = ( x > windowWidth/2) ? x : (windowWidth - x),
        	    maxDistVert = ( y > windowHeight/2) ? y : (windowHeight - y),
        	    radius = $(options.overlay).width()/2;
        	return Math.ceil(Math.sqrt( Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2) )/radius)+7;
        	
        }
        
        var parseData = function(data){
        	if(data){
	        	var newObj = "";
	        	data = data.split(";");
	        	$.each(data, function(i, val){
	        		var comma = (i > 0) ? "," : "";
	        		newObj += comma+'"'+val.replace(":", '":"')+'"';
	        	});
	        	return $.parseJSON("{"+newObj+"}");
        	}else{
        		return "";
        	}
        }
        
        var loadContent = function(type){
        	/*
        	 * Temp logic for checking lightbox type
        	 */
        	if(type.indexOf("youtube") >= 0){
        		var html = '<div class="flex-video"><iframe frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/'+options.data.videoId+'?autoplay=0&amp;rel=0&amp;modestbranding=1&amp;showinfo=1&amp;wmode=transparent&amp;enablejsapi=1" type="text/html" id="'+options.data.videoId+'"></iframe></div>';
        		$(options.contentBox).html(html);
        	}else if(type.indexOf("content") >= 0){
        		var html = $(".data", options.data.id).html();
        		$(options.contentBox).html(html);
        	}
        }
        
        var initClick = function(e){
        	var pageX = (e.pageX !== undefined) ? e.pageX : ($(window).width() / 2);
            var pageY = (e.pageY !== undefined) ? e.pageY : (($(window).height() / 2) + $(document).scrollTop());

        	options.x = pageX;
			options.y = pageY-$(document).scrollTop();
			options.openLightbox(e);
        }
    	
    	var bindEvents = function(){
    		
    		$(document).on("click", ".ctx-modal-link", function(e){ 
    			options.data = parseData($(this).attr("data-options"));
    			initClick(e);
    			e.preventDefault();
    		});
    		
    		$(document).on("click", "[href^='#lightbox-']", function(e){ 
    			options.data = parseData("type:content;id:"+$(this).attr("href").replace(".html", ""));
    			initClick(e);
    			e.preventDefault();
    		});
    		
    		$(".ctx-lightbox-close").click(function(e){
    			options.closeLightbox(e);
    		});
    		
    		$(document).click(function(e){
    			if($("html").hasClass("lb-open") && ($(window).width() >= 960)){
    				if($(e.target).hasClass("ctx-lightbox-content")){
    					options.closeLightbox(e);
    				}
    			}
    		});
    		
    		$(document).keyup(function(e) {
    		     if(e.keyCode == 27){ // escape key maps to keycode `27`
    		    	 options.closeLightbox(e);
    		     }
    		});
    		
    	}
    	
    	var init = function(){
    		/*
    		 * Checking if lightbox html exists on page, if not then add it
    		 */
    		if($(".ctx-lightbox").length === 0){
    			$("body").append(lightboxHtml);
    			bindEvents();
    			$(document).ready(function(){
    				$(window).on("debouncedresize", function(){
    					/*
    					 * Handling the overlay resize
    					 */
    					if($("html").hasClass("lb-open")){
	    					options.x = $(options.lightbox).width()/2;
	    		        	options.y = $(options.lightbox).height()/2;
	    		        	options.resizeOverlay();
    					}
    				});
    			});
    		}
    	}
    	
    	init();

        return $.fn.ctxLightbox.settings;
    };
    
    $(document).ctxLightbox();
   
})(jQuery);