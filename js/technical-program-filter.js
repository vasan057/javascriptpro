/*jshint browser:true, undef: true, unused: true, jquery: true */
var filters = {};
var $container;
var qsRegex;
var height_menu;
var height_filter;
$container = $('#container1');
var iso;
var $filterButtons = $('#options input');
 var docs_checked=[];
 var topic_checked=[];
 var topinit=true;
 var docinit=true;
$(function(){

    $('.topic-all input').prop('checked',true);
    $('.doc-all input').prop('checked',true);
    $('.product-all input').prop('checked',true);
    createContent();
    var $filterDisplay = $('#filter-display');
    //  initialize filert and sort
    $container.isotope({
        itemSelector: '.item',
        layoutMode: 'fitRows',
        filter: function() {
            return qsRegex ? $(this).text().match( qsRegex ) : true;
        },
        getSortData: {
            date: '.date',
            headline:'.headline'
        }
    });
    var filterdata=$container.isotope('getFilteredItemElements');
    CountUpdate('onload',filterdata);
    //  initialize filert and sort end
    iso = $container.data('isotope');
    // console.log(iso);
    // do stuff when checkbox change
    $('#options').on( 'change', function( jQEvent ) {
        var $checkbox = $( jQEvent.target );
        var disbaletype =$checkbox.attr('data-f-type');
        var all_id =$checkbox.attr('data-a');
        var checkstatus=$checkbox.prop('checked');
       
        if(disbaletype=='topic')
        {
            // topinit=true;
            var d_lists = $('.doc-options input[type=checkbox]:checked');
            // alert(topinit);
            if(topinit)
            {
                if(d_lists.length>0)
                {
                    $.each(d_lists,function(k,v){
                        filters.document.push('.'+$(v).attr('data-filter'));
                    });
                    topinit=true; 
                }
                else
                {

                    $.each(d_lists,function(k,v){
                    docs_checked.push($(v).attr('data-filter'));
                    });
                    filters.document=[]; 
                    topinit=false; 
                    
                }
                // topinit=false;
            }
            else
            {
                if(d_lists.length>0)
                {
                    $.each(d_lists,function(k,v){
                        filters.document.push('.'+$(v).attr('data-filter'));
                    });
                    topinit=true; 
                } 
                else
                {
                     $.each(d_lists,function(k,v){
                        docs_checked.push($(v).attr('data-filter'));
                    });
                     filters.document=[];
                    topinit=false;
                   
                }
            }
        }
        if(disbaletype=='doc')
        {
            var t_lists = $('.top_options1 input[type=checkbox]:checked');
            if(docinit)
            {
                if(t_lists.length>0)
                {
                   // alert('am here');
                    $.each(t_lists,function(k,v){
                        filters.topic.push('.'+$(v).attr('data-filter'));
                    });
                    docinit=true;
                }
                else
                {
                    $.each(t_lists,function(k,v){
                        docs_checked.push($(v).attr('data-filter'));
                    });
                    filters.topic=[];
                    docinit=false;
                }
            }
            else
            {
                if(t_lists.length>0)
                {
                    $.each(t_lists,function(k,v){
                        docs_checked.push($(v).attr('data-filter'));
                    });
                    filters.topic=[];
                     docinit=true;
                } 
                else
                {
                   $.each(t_lists,function(k,v){
                        filters.topic.push('.'+$(v).attr('data-filter'));
                    });
                    docinit=false;
                }
            }
        }
        manageCheckbox( $checkbox );
        var comboFilter = getComboFilter( filters );
        console.log(filters);
        $container.isotope({ filter: comboFilter });
        var filterdata=$container.isotope('getFilteredItemElements');
        // var filterdata=$container;
        // var isotopeInstance = $container.data('isotope');
         // var filterdata1=$container.isotope({ filter: '*' });
        // console.log(filterdata);
        // return false;

        if(disbaletype=='topic')
        {
            if(checkstatus){
                $('.top_options input').attr('disabled',false);
                $('.topic-all input').prop('checked',false);
            }
            else{ 
                var t_lists = $('.top_options input[type=checkbox]:checked');
                if(t_lists.length==0){
                    $('.topic-all input').prop('checked',true);
                }
                $('.doc-options input').prop('disabled',false);
            }
            // console.log(filterdata);
            CountUpdate(disbaletype,filterdata);
        }
        else{
            if(checkstatus){
              // $('.doc-options input').attr('disabled',true);
            }
            else{

              $('.doc-options input').attr('disabled',false);
            }
        }
        if(all_id=='all-topic'){
            CountUpdate(disbaletype,filterdata);
            $('.top_options input').attr('checked',false);
            $('.doc-options input').attr('disabled',false);
            $('.topic-all input').prop('checked',true);
        }
        // else{
        //     $('.doc-options input').attr('disabled',true);
        //     $('.product-options input').attr('disabled',true);
        // }
        // document check box handle
        if(disbaletype=='doc')
        {
            // alert('doc');
             $('.doc-options input').attr('disabled',false);
            if(checkstatus)
            {
                $('.top_options input').attr('disabled',false);
                $('.doc-all input').prop('checked',false);
                $('.doc-options input').prop('disabled',false);
            }
            else{
                var d_lists = $('.doc-options input[type=checkbox]:checked');
                // alert(d_lists.length);
                if(d_lists.length==0){
                    $('.doc-all input').prop('checked',true);
                }
                $('.top_options input').attr('disabled',false);
            }
            CountUpdate(disbaletype,filterdata);
        }
        if(all_id=='all-doc'){
            CountUpdate(disbaletype,filterdata);
            $('.doc-options input').attr('checked',false);
            $('.doc-options input').attr('checked',false);
            $('.doc-all input').prop('checked',true);
        }
        // document check box handle end
        // product check box handle
        if(disbaletype=='product'){
             $('.doc-options input').attr('disabled',false);
            CountUpdate(disbaletype,filterdata);
            if(checkstatus){
                $('.top_options input').attr('disabled',false);
                $('.product-all input').prop('checked',false);
            }
            else{
                var p_lists = $('.product-options input[type=checkbox]:checked');
                 $('.doc-options input').attr('disabled',false);
                if(p_lists.length==0){
                    $('.product-all input').prop('checked',true);
                }
                $('.top_options input').attr('disabled',false);
            }
        }
        if(all_id=='all-product'){
            CountUpdate(disbaletype,filterdata);
            $('.product-options input').attr('checked',false);
            $('.product-options input').attr('checked',false);
            $('.product-all input').prop('checked',true);
        }
        // product check box handle end
        $checkbox.attr('disabled',false);
        // $('#options .filter-count').html('');
        $.each(filterdata,function(k,v){
            var p=$(v).attr('data-p');
            var d=$(v).attr('data-doc');
            var t=$(v).attr('data-top');
            var prd=p.split(' ');
            $.each(prd,function(k1,v1){
                $('#'+v1).attr('disabled',false);
            });
            var topic_sl=t.split(' ');
            $.each(topic_sl,function(k2,v2){
                $('#'+v2).attr('disabled',false);
            });
            $('#'+d).attr('disabled',false);
        });
        updateFilterCount(iso);
    });
    //  sort date and alphabetical order
    $('#dwn_sort').on( 'change', 'li input', function() {
        $('#dwn_sort li').removeClass('active');
        var sortByValue = $(this).attr('data-sort-by');
        $('#dwn_sort li input').prop('checked',false);
        $(this).prop('checked',true);
        $('#sort_'+sortByValue).addClass('active');
        $container.isotope({ sortBy: sortByValue });
        //  sort date and alphabetical order end
    });
    $("#filter-reset").click(function(){
        $('#dwn_sort li input').prop('checked',false);
        $('#date').prop('checked',true);
        var sortByValue='date';
        $container.isotope({ sortBy: sortByValue });
    });
    $("#assets-reset").click(function(){
        $('.top_options input').attr('checked',false);
        $('.doc_option input').attr('checked',false);
        $('.p_option input').attr('checked',false);
        $('.top_options input').attr('disabled',false);
        $('.doc_option input').attr('disabled',false);
        $('.p_option input').attr('disabled',false);
        $( '.all').prop('checked',true)
        filters = {};
        $container.isotope({ filter: '*' });
        updateFilterCount(iso);
        CountUpdate('onload',filterdata);
    });
   $('.delete-search').click(function(){
        if($('#quicksearch').val()!=""){
            $('#quicksearch').val('');
            filters = {};
            $container.isotope({ filter: '*' });
            updateFilterCount(iso);
            // saturday
            $('.topic-all input').prop('checked',true);
            $('.doc-all input').prop('checked',true);
            $('.product-all input').prop('checked',true);
            $('.top_options input').attr('disabled',false);
            $('.doc_option input').attr('disabled',false);
            $('.p_option input').attr('disabled',false);
            $('.delete-search').hide();
            CountUpdate('onload',filterdata);
        }
    });
   $('.resource-grid-card').click(function(){

        var url=$(this).attr('data-url');
        var type=$(this).attr('data-type').toLowerCase();
        if(url!="javascript://"){

            if(type=='White_paper' || type=='white_paper'){

                // window.open('https://citrixreadyqa.citrix.com/content/dam/ready/assets/programs/'+url,'_blank');
                window.open(url,'_blank');
            }
            else if(type=='webinar'){
                $('.webinar-video iframe').attr('src',url);
            }
            else{
                window.open(url,'_blank');
            }
        }
    });
});
//  main search box 
var $quicksearch = $('#quicksearch').keyup( debounce( function() {
    // $('.top_options input').attr('disabled',true);
    // $('.doc_option input').attr('disabled',true);
    // $('.p_option input').attr('disabled',true);
    if($quicksearch.val()!=""){
        $(".delete-search").show();
        $('#options input').attr('checked',false);
    }else{
        $(".delete-search").hide();
        $( '.all').prop('checked',true)
        $('.top_options input').attr('disabled',false);
        $('.doc_option input').attr('disabled',false);
        $('.p_option input').attr('disabled',false);
    }
    // $('.topic-all input').prop('checked',true);
    // $('.doc-all input').prop('checked',true);
    // $('.product-all input').prop('checked',true);
    qsRegex = new RegExp( $quicksearch.val(), 'gi' );
    $container.isotope({
        itemSelector: '.item',
        layoutMode: 'fitRows',
        filter: function() {
            return qsRegex ? $(this).text().match( qsRegex ) : true;
        }
    });
        var iso = $container.data('isotope');
        updateFilterCount(iso);
         var filterdata=$container.isotope('getFilteredItemElements');
        CountUpdate('onload',filterdata);
}, 200 ) );
window.addEventListener("orientationchange", function() {
    // alert('changed');
    var filterdata=$container.isotope('getFilteredItemElements');
        CountUpdate('onload',filterdata);
});
function CountUpdate(cp,filterdata){
     var window_width=$( window ).width();
     var filterdata1=$container.isotope('getFilteredItemElements');
        $filterButtons.each( function( i, button ) {
        var $button = $( button );
        var filterValue = $button.attr('data-filter');
        if ( !filterValue ) {
            // do not update 'any' buttons
            return;
        }
             if(window_width<=768)
             {
                    ActColor='#fff';
                    DectColor='#3f4042';
              }
             else{
                    ActColor='#3f4042';
                    DectColor='#D0D0CE';
              }
        var count = $(filterdata1).filter('.'+filterValue).length;
        // console.log($button.siblings(':first'));
        // if($button.attr('data-f-type')!=cp){
             if(docs_checked.length > 0)
            {
                filters.document=[];
                $.each(docs_checked,function(dk,dv){
                    filters.document.push('.'+dv);
                });
                docs_checked=[];
            }
            else
            {
                docs_checked=[];
            }
            if(topic_checked.length > 0)
            {
                filters.topic=[];
                $.each(topic_checked,function(tk,tv){
                    filters.topic.push('.'+tv);
                });
                topic_checked=[];
            }
            else
            {   
                topic_checked=[];
            }
            if(count==0)
            {
               // $button.prop('disabled',true);
               // $button.siblings(':last').text( ' (' + count +')' ).css('color',DectColor);
               // $button.siblings(':first').css('color',DectColor);
                // console.log($button);
            }
            else
            {
                $button.prop('disabled',false);
                $button.siblings(':last').text( ' (' + count +')' ).css('color',ActColor);
                $button.siblings(':first').css('color',ActColor);
            }

        // }
        // else
        // {
        //     // if(count==0){
        //     //   $button.prop('disabled',true);
        //     //    $button.siblings(':last').text( ' (' + count +')' ).css('color',DectColor);
        //     //    $button.siblings(':first').css('color',DectColor);
        //     // }
        //     // else{
        //          $button.prop('disabled',false);
        //         // $button.siblings(':last').text( ' (' + count +')' ).css('color',ActColor);
        //         $button.siblings(':first').css('color',ActColor);
        //     // }
        // }
        if(cp=='onload'){
            $button.siblings(':last').text( ' (' + count +')' );
        }
        
    });
}
function updateFilterCount(iso) {
    height_menu=$('.menu-items ').height();
    height_filter=$('#container1').height();
    if(height_filter < height_menu){
        $('.filter-content ').height(height_menu);
    }else{
        $('.filter-content ').height(height_filter);
    }
    $('.filter-count-main').text( iso.filteredItems.length );
}
function debounce( fn, threshold ) {
    var timeout;
    return function debounced() {
        if ( timeout ) {
            clearTimeout( timeout );
        }
        function delayed() {
            fn();
            timeout = null;
        }
        setTimeout( delayed, threshold || 100 );
    };
}
function createContent(){
    var name, DOCType,cat,desc,product,industry,img,link,date,flag,duration;
    var items = '';
    // dynamically create content
    for (var i=0, len1 = SourceData.compare.length; i < len1; i++) {
        name = SourceData.compare[i].name;
        cat = SourceData.compare[i].cat;
        DOCType = SourceData.compare[i].type;
        desc = SourceData.compare[i].description;
        title = SourceData.compare[i].title;
        product = SourceData.compare[i].product;
        date = SourceData.compare[i].date;
        industry = SourceData.compare[i].industry;
        img = SourceData.compare[i].img;
        link = SourceData.compare[i].link;
        duration = SourceData.compare[i].duration;
        var href='';
        var image_html='';
        var video_html='';
        var overlay='';
        var video_flag=false;
        var Mydate=ToTimeStamp(date);
        var container_url='javascript://';
        if(link!=''){
            href=link;
        }
        else{
            href='javascript://';
        }
        if(img!=''){
            image_html='<img  src="images/'+img+'">';
            overlay='<div class="overlay"></div>';
            flag=true;
        }
        else{
            image_html='';
            overlay='';
            flag=false;
        }
        if(DOCType=='Webinar'){
            container_url='#lightbox-webinar';
            if(duration!=''){
                video_html='<span class="icon-play-darker-hollow"><i class="fa fa-play-circle"></i></span><span>'+duration+'</span>';
                video_flag=true;
            }else{
                video_html='';
                video_flag=false;
            }
        }
        if(DOCType=='Blog' || DOCType=='blog'){
            title=title + '<span style="font-size:16px;"> <i class="fa fa-external-link" aria-hidden="true"></i></span>'
        }
        if(DOCType=='White_paper' || DOCType=='white_paper'){
            DOCType1='White paper';
        }else{
            DOCType1=DOCType;
        }
        var DivHtml='<div data-p="'+product+'" data-doc='+DOCType+' data-top="'+name+'" style="padding:0% 2% 2%;" class="item small-12 large-5 medium-5 columnsn resource-grid-cell ' + name + ' '+DOCType+' '+product+'">'+
                    '<a href="'+container_url+'" data-url='+href+' data-type='+DOCType+' class="resource-grid-card" data-image="'+flag+'">'+
                    '<div class="title-container">'+
                    ''+image_html+''+
                     ''+overlay+''+
                    '<div class="title-wrapper">'+
                    '<span><span class="title" style="background-color:rgba(0,0,0,0.6); color:white;">'+cat+'</span></span>'+
                    '<span class="vid-duration" data-video="'+video_flag+'">'+ video_html+'</span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="data-container">'+
                    '<div class="headline">'+title+'</div>'+
                    // '<div class="description">'+desc+'</div>'+
                    '<div class="metadata">'+DOCType1+'</div>'+
                    '<p class="date" style="display:none">'+Mydate+'</p><p class="date" style="display:none"> date: '+date+'</p></div>'+
                    '</a>'+
                    '</div>';
        items += DivHtml;
    }
    $container.append( items );
        $('.filter-count-main').text(SourceData.compare.length);
    }
function ToTimeStamp(myDate){
    myDate=myDate.split("-");
    var newDate=myDate[1]+"/"+myDate[2]+"/"+myDate[0];
    var result= new Date(newDate).getTime();
    return result;
}
function getComboFilter( filters ) {
    var i = 0;
    var comboFilters = [];
    var message = [];
    for ( var prop in filters ) {
        message.push( filters[ prop ].join(' ') );
        var filterGroup = filters[ prop ];
        // skip to next filter group if it doesn't have any values
        if ( !filterGroup.length ) {
            continue;
        }
        if ( i === 0 ) {
            // copy to new array
            comboFilters = filterGroup.slice(0);
        } else {
            var filterSelectors = [];
            // copy to fresh array
            var groupCombo = comboFilters.slice(0); // [ A, B ]
            // merge filter Groups
            for (var k=0, len3 = filterGroup.length; k < len3; k++) {
                for (var j=0, len2 = groupCombo.length; j < len2; j++) {
                  filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
                }
            }
            // apply filter selectors to combo filters for next group
            comboFilters = filterSelectors;
        }
        i++;
        // console.log(comboFilters);
    }
    var comboFilter = comboFilters.join(', ');
    return comboFilter;
}
function manageCheckbox( $checkbox ){
    var checkbox = $checkbox[0];
    var group = $checkbox.parents('.option-set').attr('data-group');
    // create array for filter group, if not there yet
    var filterGroup = filters[ group ];
    if ( !filterGroup ) {
        filterGroup = filters[ group ] = [];
    }
    var isAll = $checkbox.hasClass('all');
    // reset filter group if the all box was checked
    if ( isAll ) {
        delete filters[ group ];
        if ( !checkbox.checked ) {
          checkbox.checked = 'checked';
        }
    }
    // index of
    var index = $.inArray( checkbox.value, filterGroup );
    if ( checkbox.checked ) {
        var selector = isAll ? 'input' : 'input.all';
        $checkbox.siblings( selector ).removeAttr('checked');
        if ( !isAll && index === -1 ) {
          // add filter to group
          filters[ group ].push( checkbox.value );
        }
    } else if ( !isAll ) {
        // remove filter from group
        filters[ group ].splice( index, 1 );
        // if unchecked the last box, check the all
        if ( !$checkbox.siblings('[checked]').length ) {
            $checkbox.siblings('input.all').attr('checked', 'checked');
        }
    }
}