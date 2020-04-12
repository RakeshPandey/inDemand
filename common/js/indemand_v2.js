// $('body').append(`<div id="loading" style="position: fixed; z-index: 9999999; top: 0px; left: 0px; right: 0px; bottom: 0px; background: rgb(64, 150, 238);"> 
//   <div class="dot"></div>
// </div>
// <style>`);

 jQuery(document).ready(function($){

	// 	resource listing isotropefilter
  if ($(".categoriesResources").length > 0) {// Isotrope  filter 
    var $isotopeItem = $('.categoriesResources').isotope({
      layoutMode: 'fitRows',
    });
    $('.categoryTabbing ul li').on('click',function(){
      var ajaxUrl = 'https://api.hubapi.com/hubdb/api/v2/tables/'+$('.resourceCategorySection').attr('data-table')+'/rows?portalId=464158';
      if($(window).width() < 768){
        $(this).parent().slideUp();
        $(this).closest('.categoryTabbing').removeClass('open');
      }
      if($(this).attr('data-filter') != ''){
      	ajaxUrl += '&type__in='+$(this).attr('data-filter');
    	}
      $.getJSON(ajaxUrl,function(results){
        var resultsArray = results.objects;
        $('.categoriesResources').isotope('destroy');
        $('.categoriesResources').html('').removeClass('loaded').addClass('loading');
        if(resultsArray.length){
          for(i=0; i<resultsArray.length; i++){
            /* Get Row Values */
            var title = resultsArray[i].values[1];
            var rowType = resultsArray[i].values[2];
            var imageUrl = resultsArray[i].values[3];
            var overview = resultsArray[i].values[4];
            var tag = resultsArray[i].values[5];
            var resourceLink = resultsArray[i].values[6];
            var form_Id = resultsArray[i].values[7];
            var classAdd = ''; 
            if(form_Id){
              for(j=0;j<rowType.length;j++){
                classAdd += ' '+(rowType[j].name).toLowerCase().replace(' ','').replace('-','_');
              }
            	// Form Present	
            	var staticAddition = 
                  `<a href="#formElement_`+i+`" class="overlayLink formPopup"></a>
                    <div style="display:none;">
                      <div class="formInside" id="formElement_`+i+`">
                        <h3 class="pb30">Fill Below Form to Download <span class="text-blue">`+title+`</span></h3>
                        <div class="formtoRender"></div>
                      </div>
											<a href='`+resourceLink+`' target="_blank" id="onLoadClick_`+i+`" class="onLoadClick" download></a>
                    </div>`;
            }else{
            	// Form Absent
            	for(j=0;j<rowType.length;j++){
                classAdd += ' '+(rowType[j].name).toLowerCase().replace(' ','').replace('-','_');
              	if(rowType[j].name == 'Videos'){
                	var staticAddition = '<a href="'+resourceLink+'" class="overlayLink videoPopup"></a>';
                }
                else if(rowType[j].name == 'Podcasts'){
                	var staticAddition = 
                      `<a href="#audioPodcast`+i+`_`+j+`" class="overlayLink audioPodcast"></a>
                      <div style="display:none;">
                        <div id="audioPodcast`+i+`_`+j+`">
                          <audio controls>
                            <source src="`+resourceLink+`" type="audio/mpeg">
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>`;
                }else{
                  var staticAddition = '<a target="_blank" href="'+resourceLink+'" class="overlayLink"></a>';
                }
              }
            }
            if(imageUrl){
            	var imageBg = `<span class="bgImage" style="background-image:url(`+imageUrl.url.replace('(','%28').replace(')','%29')+`)"></span>`;
            }else{
            	var imageBg = ` `	;
            }
            if($('.resourceCategorySection').hasClass('v1')){
              var finalHTML = 
                `<div class="cateResource animate w33 Tabw50 webinars">
                  <div class="resource">
											`+imageBg+`
                    <div class="resourceContent text-center text-white">
                      <div class="resourceIcon"></div>
                      <div class="pt20 font12 contentToHover">`+overview+`</div>
                    </div>
                    <a target="_blank" href="`+resourceLink+`" class="overlayLink"></a>
                  </div>
                  <div class="bottomtext p20-0 ">
                    <h5><a href="javascript:void(0)" class="text-blue">`+title+`</a></h5>
                    <span class="text-alternate">`+tag+`</span>
                  </div>
                 </div>`;
            }else{
              var finalHTML = 
                `<div class="cateResource animate w33 Tabw50 `+classAdd+`">
                  <div class="resource">
											`+imageBg+`
                    <div class="resourceContent text-center text-white">
                      <div class="resourceIcon"></div>
                      <div class="pt20 font12">`+overview+`</div>
                    </div>
                    `+staticAddition+`
                  </div>
                  <div class="bottomtext p20-0 ">
                    <h5><a href="javascript:void(0)" class="text-blue">`+title+`</a></h5>
                    <span class="text-alternate">`+tag+`</span>
                  </div>
                 </div>`;
            }
            
            	$('.categoriesResources').append(finalHTML);
          } // For Loop Ends
          
          $('.categoriesResources').isotope({
            layoutMode: 'fitRows',
          });
          setTimeout(function(){
            $('.categoriesResources').addClass('loaded');
            setTimeout(function(){
              $('.categoriesResources').removeClass('loading');
            },500);
          },1000);
          
          
          setTimeout(function(){
            for(i=0; i<resultsArray.length; i++){
              if(form_Id){
                hbspt.forms.create({
                  portalId: "464158",
                  formId: form_Id,
                  css: "",
                  target: '#formElement_'+i+' .formtoRender',
                  inlineMessage: ' ',
                  onFormReady: function($form){},
                  onFormSubmit: function($form) {
                    $('.mfp-content h3').html('Thankyou for Downloading <span class="text-blue">'+title+'</span>');
                    setTimeout(function(){
                      $('#onLoadClick_'+i)[0].click();
                      
                    },3000);   
                  } 
                }) 
              }
            }
            $('.videoPopup').magnificPopup({
              disableOn: 700,
              type: 'iframe',
              mainClass: 'mfp-fade',
              removalDelay: 160,
              preloader: false,
              fixedContentPos: false
            });
            
            /*$(document).on('click', '.videoPopup', function(){
              setTimeout(function(){
                if($('.mfp-container').length > 0){
                  $('.w-big-play-button').click();
                }
              },1200);
            });*/
            
            
            $('.formPopup, .audioPodcast').magnificPopup({
              type:'inline',
              midClick: true,
              mainClass: 'mfp-fade',
              removalDelay: 160,
            });
          },100)
          
        }else{
        	// No Data Found
        }
      });
      
      
    });
    $(document).on('click','.catExpand',function(){
      if($(window).width() < 768){
        $(this).toggleClass('change').next().slideToggle();
        $(this).closest('.categoryTabbing').toggleClass('open');
      }
    });



  }
   
   
   
   
   
   // 	flexible slider category	 
   if ($(".flexibleSlider").length > 0) {
   	 $('.flexslidewrap > .row-fluid-wrapper').before('<div class="whatWedoCategory p30-0"><ul></ul></div>');
     $('.flexslidewrap > .row-fluid-wrapper').after('<div class="pt40"><div class="filupdiv"><div class="fillupline"></div></div></div>');
     $('.flexibleSlider').append('<label class="prevArrow"></label><label class="nextArrow"></label>');
     
      var catrgories = [];
             $('.whatwedoFilterSliderParent').each(function(){
                 var catType = $(this).attr('data-value');
                 var catTitle = $(this).attr('data-title');
                 catrgories.push({'title':catTitle, 'value':catType});
                 $(this).addClass(catType);  
             });
            var categoriesValue = removeDuplicates(catrgories, 'title');
            for(i=0; i<[categoriesValue.length]; i++){
                if(i==0){
                    $('.whatWedoCategory ul').wrap('<div class="CAT-Filter"></div>');
                  	$('.whatWedoCategory ul').before('<label class="cat-Expand">All</label>')
                    //$('.whatWedoCategory ul').append('<li>All</li>')
                }
                $('.whatWedoCategory ul').append('<li data-filter=".'+categoriesValue[i].value+'">'+categoriesValue[i].title+'</li>'); 
            }
     
     		$('.whatWedoCategory ul li').on('click',function(){
             var selector = $(this).attr('data-filter');
             $('.whatWedoCategory ul li').not(this).removeClass('selected');
             $(this).addClass('selected');
          		$('.flexibleSlider > .slick-slider > .slick-list > .slick-track > .slick-slide:not(.slick-cloned)').each(function(){
                var $element = $(this);
              	if($(this).find('.whatwedoFilterSliderParent'+selector).length){
                	var gotoIndex = $element.attr("data-slick-index");
                  $('.flexibleSlider > .slick-slider').slick('slickGoTo',gotoIndex,false);
                  $('.flexibleSlider .slick-slide[data-slick-index="'+gotoIndex+'"]').find('.whatwedoFilterSliderParent').slick('slickGoTo',0,true)
                }
              });
          
          		
             $(this).parent().parent().find('.cat-Expand').html($(this).html());
               if ($(window).width() < 768){
                    $(this).parent().slideToggle();
//                    $(this).closest('.categoryTabbing').find('.catExpand').toggleClass('change') ;
                }
           });
            
              $(document).on('click','.cat-Expand',function () {
                if($(window).width() < 768){
                   $(this).toggleClass('change').next().slideToggle();
                   $(this).closest('.whatWedoCategory').toggleClass('open');
                  }
             });
    
            $(document).on('click','.whatWedoCategory ul li',function(){
              if($(window).width() < 768){
                $(this).parent().slideUp();
                $(this).closest('.whatWedoCategory').removeClass('open');
                }
            });
              
            $(document).on('click','.flexibleSlider > span > .slick-arrow',function(){
            	$('.whatwedoFilterSliderParent').slick('slickGoTo',0, true);
            });
     
     
     
     
		//  main slider   
     $('.flexibleSlider > span').slick({
     	adaptiveHeight: true,
       draggable: false,
       infinite: false
     });
      $('.flexibleSlider > span').on('afterChange',function(event,slick, currentSlide){ 
      	var currentCat = '.'+$('.flexibleSlider .slick-current .whatwedoFilterSliderParent').attr('data-value');
        $('.whatWedoCategory li[data-filter="'+currentCat+'"]').addClass('selected').siblings().removeClass('selected');
        var slidesInside = $('.flexibleSlider .slick-current .whatwedoFilterSliderParent .slick-slide').length;
        var currentIndex = $('.flexibleSlider .slick-current .whatwedoFilterSliderParent .slick-slide.slick-active').index();
        if(currentIndex < 0) { currentIndex = 0  }
        $('.filupdiv .fillupline').css({
           'width':((100/slidesInside)*(currentIndex+1))+'%'
         });
        
      });
     
     $('.whatwedoFilterSlider').each(function(){
        var random = Math.floor(Math.random() * 2) + 1;
         if(random == 1){
            $(this).find('.bgOverlay').fadeIn(0);
         }else{
            $(this).find('.bgOverlay').fadeOut(0);
         }
     });
     
     //  Innerslider slider   
     $('.whatwedoFilterSliderParent').slick({
     			adaptiveHeight: true,
       		arrows: false,
       		infinite: false
     });
     $('.whatwedoFilterSliderParent').on('afterChange',function(event,slick, currentSlide){
         $('.filupdiv .fillupline').css({
           'width':((100/slick.$slides.length)*(currentSlide+1))+'%'
         });
     }).on('edge', function(event, slick, direction){
       if(direction == 'right'){
         // Left Edge Hit
         if($('.flexibleSlider > span > .slick-prev').hasClass('slick-disabled')){
         		$('.flexibleSlider > .slick-slider').slick('slickGoTo',($('.flexibleSlider > .slick-slider > .slick-list > .slick-track > .slick-slide').length - 1),false);
         }else{
         	$('.flexibleSlider > span > .slick-prev').click();
         }
       }else{
         // Right Edge Hit
         if($('.flexibleSlider > span > .slick-next').hasClass('slick-disabled')){
         		$('.flexibleSlider > .slick-slider').slick('slickGoTo',$('.flexibleSlider > .slick-slider > .slick-list > .slick-track > .slick-slide:first-child'),false);
         }else{
         	$('.flexibleSlider > span > .slick-next').click();
         }
       }
     });
     $('.whatWedoCategory ul li:first-child').trigger('click');
     
     
     $('.nextArrow').on('click',function(){
       var currentVal = $('.whatWedoCategory li.selected').attr('data-filter');
       if($('.whatwedoFilterSliderParent'+currentVal+' .slick-slide.slick-current').is(':last-child')){
         if($('.whatWedoCategory li.selected').next('li').length > 0){
         		$('.whatWedoCategory li.selected').next('li').click();
         }else{
         	$('.whatWedoCategory li:first-child').click();
         }
       }else{
       	$('.slick-slide.slick-current').parents('.whatwedoFilterSliderParent').slick('slickNext');
       }	
     });
     $('.prevArrow').on('click',function(){
       var currentVal = $('.whatWedoCategory li.selected').attr('data-filter');
       if($('.whatwedoFilterSliderParent'+currentVal+' .slick-slide.slick-current').is(':first-child')){
         
         if($('.whatWedoCategory li.selected').prev('li').length > 0){
         		$('.whatWedoCategory li.selected').prev('li').click();
         }else{
         	$('.whatWedoCategory li:last-child').click();
         }
         
       }else{
       	$('.slick-slide.slick-current').parents('.whatwedoFilterSliderParent').slick('slickPrev');
       }	
     });
     
     
     
   }
   
   
	//Contact Page    
    $(document).on('click','#sendMessage',function(){
      $(this).closest('.forMainBookingSection').hide();
      $(this).closest('.forcontactModule').find('#Form-Sec').show();  
    });
     $(document).on('click','.CloseBtn',function(){
       $('.BoolMeetSecIframe').hide();
       $(this).closest('.forcontactModule').find('.forMainBookingSection').show();  
     });
	
   	$(document).on('click','.BoxBook a.BookLink',function(){
      	$(this).closest('.forMainBookingSection').hide();
       $('.BoolMeetSecIframe').hide();
       $('#'+$(this).attr('data-iframe-id')).show();  
     });
   $(document).on('click','#meetingId', function(){
     $(this).closest('.forMainBookingSection').hide();
     $(this).closest('.forcontactModule').find('#Ed-Frame').show();  
   });
   
   
//    Pillar Page

   // Find Counter link   
  var Counter = 1;
  $(".sectionParent .pillerstripSection").each(function() {
    var a = $(this).find(".pillerstripTitle a").text();
    var b = $(this).attr("id", "counter" + Counter);
    var c = $(this).attr("id");
    $(".pillersidebar .SidebarListing ul").append("<li><a class='' data-id= " + Counter + " href=#" + c + ">" + a + "</a></li>");
    Counter++
  });

  var pillarLengths = $('.pillerstripSection').length;
  for(i=1;i<=pillarLengths;i++){
    $('#counter'+i).attr('data-top', $('#counter'+i).offset().top);
    if($('#counter'+(i+1)).length){
      $('#counter'+i).attr('data-bottom', $('#counter'+(i+1)).offset().top);
    }else{
      $('#counter'+i).attr('data-bottom', ($('#counter'+i).parents('.widget-span').offset().top + $('#counter'+i).parents('.widget-span').outerHeight()) );
    }
  }
  
  $(".sectionParent").each(function(){
    var $parent  = $(this);
    $(window).on("scroll",function(){
      var $parentOffest  = $parent.offset().top
      var $sideContentHeight  =  $parentOffest + $parent.outerHeight() - $parent.find(".pillersidebar").outerHeight();
      var $topScroll = $(window).scrollTop();
      if( $topScroll > $parentOffest){
        $parent.find(".pillersidebar").addClass('sticky');
        var left = $(window).width() - $parent.find(".wrapper").width();
        if($topScroll > $sideContentHeight) {
          $parent.find('.pillersidebar').addClass('buttonSticky')
        } else {
          $parent.find('.pillersidebar').removeClass('buttonSticky')
        }
      } else {
        $parent.find(".pillersidebar").removeClass('sticky');
      }

      var globalOffset = 40; 
      var scrollPos = $(document).scrollTop() + globalOffset;

      $('.SidebarListing ul li a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        var refElementTop = parseInt(refElement.attr('data-top'));
        var refElementBottom = parseInt(refElement.attr('data-bottom'));
        console.log(refElementTop,refElementBottom)
        if (refElementTop <= scrollPos && refElementBottom > scrollPos) {
          $('.SidebarListing ul li a').not(currLink).removeClass("active");
          $('.SidebarListing ul li a ').not(currLink.parent()).removeClass("active");
          currLink.addClass("active");
          $(this).parent('li').addClass("active");
        }else{
          currLink.removeClass("active");
          $(this).parent('li').removeClass("active");
          $(this).parents('.SidebarListing').find(".currentTab").removeClass("iCon");
        }
      });


    });
  });
  //   Scroll on click navigation
  $('.sectionParent a[href*=#]').bind('click', function(e) {
    e.preventDefault(); 
    var target = $(this).attr("href"); 
    if ($(window).width() < 767) {
      $('html, body').stop().animate({scrollTop:$(target).offset().top - 101 }, 1800), 600, function() {
        location.hash = target; 
      };
    }
    else{
      $('html, body').stop().animate({scrollTop:$(target).offset().top }, 1800), 600, function() {
        location.hash = target; 
      };
    }
    return false;
  });

  // Pillar page mobile side bar 
  $('.mobileNaviagtion').on('click', function(){    
    $(this).toggleClass('open');
    $(this).siblings('.pillersidebar').toggleClass('show');
    $(this).find('i').toggleClass('fa-chevron-right');
  });

  $('.SidebarListing li a').on('click',function(){
    $(this).closest('.pillersidebar ').removeClass('show');
    $(this).closest('.pillersidebar ').siblings('.mobileNaviagtion ').removeClass('open');
    $(this).closest('.pillersidebar ').siblings('.mobileNaviagtion').find('i').removeClass('fa-chevron-right').addClass('fa-chevron-left');
  });

   
   
   
   
   
   
   
   
   
   
	   

  });









// Duplicate Function
function removeDuplicates(arrayName, whatShoudBeFiltered) {
    return arrayName.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[whatShoudBeFiltered]).indexOf(obj[whatShoudBeFiltered]) === pos;
    });
}


    $(window).on('load',function() {
      var postContainer = $(".post-listing");
      var ajaxUrl = postContainer.attr('data-next-page');
      if(!ajaxUrl){
        $('#loadMore').hide();
      }
      $('#loadMore').click(function(event){
        $.get(ajaxUrl, function(data){
          page = $(data);
          var posts = page.find('.post-item');
          var postsLength = 0;
          posts.each(function(){
            var blogPost = $(this);
            postsLength++
            //$isotope.isotope( 'insert', blogPost );
            setTimeout(function(){
              blogPost.addClass('animateIt');
              $('.post-listing').append(blogPost);         
            },100*postsLength);

          });
          ajaxUrl = page.find('.post-listing').attr('data-next-page');
          if(!ajaxUrl){
            $('#loadMore').hide();
          }    
        });
      }); 
    }); 
   


// Animation Starts
var controller = new ScrollMagic.Controller();
$(window).on('load',function(){
  $('body.noLoader .header-container, body.noLoader .body-container, body.noLoader .footer-container').css('opacity',1);
//   	$('#loading').fadeOut(500);
  	if($('body').hasClass('hs-blog-post')){
    	headerAnimation.progress(1).pause();
    }else{
      headerAnimation.play();
    }
    
    
  }); 
  var headerAnimation = new TimelineMax();
  headerAnimation.fromTo('.siteLogo',0.3,{ opacity:0},{opacity:1},0)
  .staggerFromTo('.siteNavigation .hs-menu-wrapper > ul > li',0.6,{ opacity:0, rotation:2, y:30},{opacity:1,rotation:0, y:0},0.05,'-=0.03')
  .fromTo('.searchform',0.3,{ opacity:0},{opacity:1},'-=0.03')
  .fromTo('.headerRight',0.3,{ opacity:0},{opacity:1},'-=0.03')
  .fromTo('.flexslidewrap',0.4,{ opacity:0},{opacity:1},'-=0.01')
  headerAnimation.progress(0).pause()
  


if($('.aboutBanner').length > 0){
  var aboutBanner = new TimelineMax();
  aboutBanner.staggerFromTo('.aboutBanner .left > *',0.6,{ opacity:0, y:30},{ opacity:1, y:0},0.05)
  		.fromTo('.aboutBanner .right',0.6,{ opacity:0},{ opacity:1},'-=0.1')
  headerAnimation.add(aboutBanner,'-=0.6');
}
if($('.aboutFounder').length > 0){
  var aboutFounder = new TimelineMax();
  aboutFounder.fromTo('.aboutFounder .fullImage',0.6,{ opacity:0},{ opacity:1},0)
  .staggerFromTo('.aboutFounder .span7 > *',0.6,{ opacity:0, y:30},{ opacity:1, y:0},0.05,'-=0.1')
  aboutFounder.progress(0).pause();
  var aboutFounderScene = new ScrollMagic.Scene({
      triggerElement: ".aboutFounder",
      triggerHook: 0.9,
    }).reverse(false).setTween(aboutFounder.play()).addTo(controller);
  
  
}
if($('.aboutTimeline').length > 0){
  var aboutTimeline = new TimelineMax();
  aboutTimeline.staggerFromTo('.aboutTimeline .span5 > *',0.6,{ opacity:0, x:30},{ opacity:1, x:0},0.05)
  .staggerFromTo('.aboutTimeline .timelineGroup > .timelineSingle',0.6,{ opacity:0, y:30},{ opacity:1, y:0},0.05,'-=0.1')
  aboutTimeline.progress(0).pause();
  
  var aboutTimelineScene = new ScrollMagic.Scene({
      triggerElement: ".aboutTimeline",
      triggerHook: 0.9,
    }).reverse(false).setTween(aboutTimeline.play()).addTo(controller);
  
}
if($('.responsiveVideo').length > 0){
  var responsiveVideo = new TimelineMax();
  responsiveVideo.fromTo('.responsiveVideo',0.6,{ opacity:0, scale:0.4},{ opacity:1, scale:1})
  responsiveVideo.progress(0).pause();
    var responsiveVideoScene = new ScrollMagic.Scene({
      triggerElement: ".responsiveVideo",
      triggerHook: 0.9,
    }).reverse(false).setTween(responsiveVideo.play()).addTo(controller);
}
if($('.aboutPartner').length > 0){
  var aboutPartner = new TimelineMax();
  aboutPartner.staggerFromTo('.aboutPartner > .wrapper > * > *',0.6,{ opacity:0, y:30},{ opacity:1, y:0},0.1)
  aboutPartner.progress(0).pause();
  var aboutPartnerScene = new ScrollMagic.Scene({
      triggerElement: ".aboutPartner",
      triggerHook: 0.9,
    }).reverse(false).setTween(aboutPartner.play()).addTo(controller);
}

if($('.teamSection ').length > 0){
  var teamSection  = new TimelineMax();
  teamSection.staggerFromTo('.teamSection  > .wrapper > * > *',0.6,{ opacity:0, y:30},{ opacity:1, y:0},0.2)
  teamSection.progress(0).pause();
  
   var teamSectionScene = new ScrollMagic.Scene({
      triggerElement: ".teamSection",
      triggerHook: 0.9,
    }).reverse(false).setTween(teamSection.play()).addTo(controller);
}





if($('.sectionParent').length > 0){
  var sectionParent = new TimelineMax();
  sectionParent.staggerFromTo('.sectionParent',0.6,{opacity:0, visibility:'hidden'},{ opacity:1, visibility:'visible'},0.05)
  headerAnimation.add(sectionParent,'-=0.6');
}

/*  Blog Page */ 
if($('.pageTitleSection').length > 0){
	var pageTitleSection = new TimelineMax();
  pageTitleSection.fromTo('.pageTitleSection .title',0.4,{ opacity:0},{ opacity:1},0.05)
  		.fromTo('.pageTitleSection .breadcurmb ',0.3,{ opacity:0, y:30 },{ opacity:1, y:0},'-=0.1');
  if($('.topic-tabing').length > 0){
    pageTitleSection.staggerFromTo('.topic-tabing a',0.4,{ opacity:0},{ opacity:1},0.05,'-=0.1');
  }
  if($('.post-listing').length > 0){
    pageTitleSection.staggerFromTo('.post-listing .post-item',0.8,{ opacity:0, y:30},{ opacity:1, y:1},0.05,'-=0.1');
  }
  headerAnimation.add(pageTitleSection,'-=0.6');
}





// Animation Ends



jQuery(document).ready(function(a) { wrapperPadding() });
$(window).load(function() { wrapperPadding()});
$(window).resize(function() {wrapperPadding() });

function wrapperPadding() {
    var b = $(window).width();
    if ($(".wrapper").length > 0) {
        var a = $(".wrapper").width()
    } else {
        if ($(window).width() > 1230) {
            var a = 1170
        } else {
            if ($(window).width() < 1230 && $(window).width() > 992) {
                var a = 900
            } else {
                var a = b
            }
        }
    }
    var c = ((b - a) / 2);
    if ($(".wrapLeft").length > 0) {
        $(".wrapLeft").css("padding-left", c)
    }
    if ($(".wrapRight").length > 0) {
        $(".wrapRight").css("padding-right", c)
    }
}

function triggerFocus(){
  	$('#searchExpand').focus().addClass('focus');
  }