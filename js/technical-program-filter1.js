/*jshint browser:true, undef: true, unused: true, jquery: true */
var filters = {};
var $container;
var qsRegex;
var height_menu;
var height_filter;
$container = $('#container1');
var iso;
var $filterButtons = $('#options input');
var _docType = {};
var _docPro = {};
var _proCats = {};
var _proDocs = {};
var _docs = new Array();
var _cat = new Array();
var _pro = new Array();
var _totalProduct=new Array();
var _unDocType = {};
Array.prototype.count = function(obj){
    var count = this.length;
    if(typeof(obj) !== "undefined"){
        var array = this.slice(0), count = 0; // clone array and reset count
        for(i = 0; i < array.length; i++){
            if(array[i] == obj){
                count++;
            }
        }
    }
    return count;
}
Array.prototype.lengthWihtoutEmptyValues = function () {
    var initialLength = this.length;
    var finalLength = initialLength;

    for (var i = 0; i < initialLength; i++) {
        if (this[i] == "") {
            finalLength--;
        }
    }

    return finalLength;
}
$(function(){

    $('.topic-all input').prop('checked',true);
    $('.doc-all input').prop('checked',true);
    $('.product-all input').prop('checked',true);
    createContent();
    _cat = _cat.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    _pro = _pro.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    // console.log(_pro);return false;
    _docs = _docs.filter(function(item, i, ar){ return ar.indexOf(item) === i; });


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
    // do stuff when checkbox change
    $('#options').on( 'change', function( jQEvent ) {
        var $checkbox = $( jQEvent.target );
        var disbaletype =$checkbox.attr('data-f-type');
        var all_id =$checkbox.attr('data-a');
        var checkstatus=$checkbox.prop('checked');
        manageCheckbox( $checkbox );
        var comboFilter = getComboFilter( filters );
        $container.isotope({ filter: comboFilter });
        var filterdata=$container.isotope('getFilteredItemElements');
        // var filterdata=$container;
        // var isotopeInstance = $container.data('isotope');
         // var filterdata1=$container.isotope({ filter: '*' });
        // return false;
        if(disbaletype=='topic'){
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
        manpulateCount(filterdata);
        
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
        var count = $(filterdata).filter('.'+filterValue).length;

            if(count==0)
            {
            }
            else
            {
                $button.prop('disabled',false);
                // $button.siblings(':last').text( ' (' + count +')' ).css('color',ActColor);
                $button.siblings(':first').css('color',ActColor);
            }
        
        if(cp=='onload'){
           
            // $button.siblings(':last').text( ' (' + count +')' );
        }
        
    });
    if(cp == 'onload'){
        for(var k=0;k<_docs.length;k++){
            $('#'+_docs[k]).siblings(':last').text(' ('+_unDocType[_docs[k]]+')');
            // console.log(_docType[_docs[k]]);
        }
        for(var j=0;j<_cat.length;j++){
            countFromArray(_docs,_docType,_cat[j],function(ct){
                $('#'+_cat[j]).siblings(':last').text(' ('+ct+')');
            });
        }
        for(var l=0;l<_pro.length;l++){
            countFromArray(_docs,_docPro,_pro[l],function(ct){
                $('#'+_pro[l]).siblings(':last').text(' ('+ct+')');
            });
        }
    }
}


function manpulateCount(filterdata){
    var window_width=$( window ).width();
    var doc = $("div[data-group=topic] input:checked:not(:disabled)").not('#topic-all');
    var cat_change = $("div[data-group=document] input:checked:not(:disabled)").not('#document-all');
    var pro_change = $("div[data-group=product] input:checked:not(:disabled)").not('#document-all');
    var docs = new Array();
    // console.log(_proCats);
    if(window_width<=768)
     {
            ActColor='#fff';
            DectColor='#3f4042';
      }
     else{
            ActColor='#3f4042';
            DectColor='#D0D0CE';
      }
    if(!doc.length && !cat_change.length && !pro_change.length){
        for(var k=0;k<_docs.length;k++){
            $('#'+_docs[k]).siblings(':last').text(' ('+_unDocType[_docs[k]]+')');
            // console.log(_docType[_docs[k]]);
        }
        for(var j=0;j<_cat.length;j++){
            countFromArray(_docs,_docType,_cat[j],function(ct){
                $('#'+_cat[j]).siblings(':last').text(' ('+ct+')');
            });
        }
        for(var l=0;l<_pro.length;l++){
            countFromArray(_docs,_docPro,_pro[l],function(ct){
                $('#'+_pro[l]).siblings(':last').text(' ('+ct+')');
            });
        }
        return;
    }
    if(doc.length){
        var doc_values = new Array();
        var dup = new Array();
        // var dup_pro = new Array();
        var tot_data = SourceData.compare;

        doc.each(function(k,v){
            var _id = v.getAttribute('id');
           for(var k=0; k < tot_data.length; k++){
                var _name = tot_data[k].name;
                // var _pro = tot_data[k].product;
                if(_name.indexOf(_id) !== -1) dup[k] = tot_data[k].type;
                // if(_pro.indexOf(_id) !== -1) dup_pro[k] = tot_data[k].type;
           }
           
        });

        // chne
        for(var i=0;i<_docs.length;i++){
            $('#'+_docs[i]).siblings(':last').text(' ('+dup.count(_docs[i])+')')
        }
        // chnage product counts
        var tmp_doc = [];
        if(cat_change.length){
            cat_change.each(function(k,v){
                tmp_doc.push(v.getAttribute('id'));
            });
        }
        var pro_count  =  {};
        if(tmp_doc.length){
            for(var pro_i=0;pro_i<dup.length;pro_i++){
                if(dup[pro_i] && $.inArray(dup[pro_i],tmp_doc) !== -1){
                    for(var _p_i=0;_p_i<_pro.length;_p_i++){
                        var tmp = tot_data[pro_i].product;
                        if(tmp.indexOf(_pro[_p_i]) !== -1 ) pro_count[_pro[_p_i]] = pro_count[_pro[_p_i]] ? pro_count[_pro[_p_i]]+1:1; 
                    }
                }
            } 
        }else{
           for(var pro_i=0;pro_i<dup.length;pro_i++){
                if(dup[pro_i]){
                    for(var _p_i=0;_p_i<_pro.length;_p_i++){
                        var tmp = tot_data[pro_i].product;
                        if(tmp.indexOf(_pro[_p_i]) !== -1 ) pro_count[_pro[_p_i]] = pro_count[_pro[_p_i]] ? pro_count[_pro[_p_i]]+1:1; 
                    }
                }
            }  
        }
        // populate values in product
        for(var _p_i=0;_p_i<_pro.length;_p_i++){
            if(pro_count[_pro[_p_i]]){
                $('#'+_pro[_p_i]).siblings(':last').text(' ('+pro_count[_pro[_p_i]]+')');
            }else{
                 $('#'+_pro[_p_i]).siblings(':last').text(' (0)');
            }
        }
            
         
    }else{
        for(var k=0;k<_docs.length;k++){
            if(_unDocType[_docs[k]]){
                $('#'+_docs[k]).siblings(':last').text(' ('+_unDocType[_docs[k]]+')');
            }else{

                $('#'+_docs[k]).siblings(':last').text(' (0)');
            }

        }
         for(var l=0;l<_pro.length;l++){
            countFromArray(_docs,_docPro,_pro[l],function(ct){
                $('#'+_pro[l]).siblings(':last').text(' ('+ct+')');
            });
        }
    }


    
    if(cat_change.length){
        var _id = new Array();
        cat_change.each(function(k,v){
            _id.push(v.getAttribute('id'));
        });
        for(var j=0;j<_cat.length;j++){
            countFromArray(_id,_docType,_cat[j],function(ct){
                $('#'+_cat[j]).siblings(':last').text(' ('+ct+')');
            });
        }
        for(var m=0;m<_pro.length;m++){
            // console.log(_pro[m]);
           // countFromArray(_id,_docPro,_pro[m],function(ct){
           //      $('#'+_pro[m]).siblings(':last').text(' ('+ct+')');
           //  });

        }

    }else{
        for(var j=0;j<_cat.length;j++){
            countFromArray(_docs,_docType,_cat[j],function(ct){
                $('#'+_cat[j]).siblings(':last').text(' ('+ct+')');
            });
        }
    }
    var pro_change = $("div[data-group=product] input:checked:not(:disabled)").not('#document-all');
    if(pro_change.length){
        var _ids = new Array();
        pro_change.each(function(k,v){
            _ids.push(v.getAttribute('id'));
        });
        var pro_new = new Array();
        for(var j=0;j<_cat.length;j++){
            countFromArray(_ids,_proCats,_cat[j],function(ct){
                $('#'+_cat[j]).siblings(':last').text(' ('+ct+')');
            });
        }
        for(var j=0;j<_docs.length;j++){
            countFromArray(_ids,_proDocs,_docs[j],function(ct){
                if(ct)
                {
                    // $('#'+_docs[j]).attr('disabled',false).css('color',ActColor);
                    // $('#'+_docs[j]).siblings(':first').css('color',ActColor);
                    $('#'+_docs[j]).siblings(':last').text(' ('+ct+')').css('color',ActColor);
                }
                else
                {
                    // $('#'+_docs[j]).attr('disabled',true).css('color',DectColor);
                    // $('#'+_docs[j]).siblings(':first').css('color',DectColor);
                    $('#'+_docs[j]).siblings(':last').text(' ('+ct+')').css('color',DectColor);
                }
            });
        }


    }else{

    }

    
}
function countFromArray(base,arr,$value,cb){
    var count = 0;
    for(var k=0;k<base.length;k++){
        // if(arr[base[k]]){
            console.log(arr[base[k]]);
            count += arr[base[k]].count($value);
        // }
    }
    cb(count);
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

        // count the document type list
        if(_unDocType[SourceData.compare[i].type]){
            _unDocType[SourceData.compare[i].type] = _unDocType[SourceData.compare[i].type]+1;
        }else{
            _unDocType[SourceData.compare[i].type] = 1;
        }
        // loading doctype and category
        if(_docType[SourceData.compare[i].type] && _docType[SourceData.compare[i].type].length){
            var or = _docType[SourceData.compare[i].type];
            var _data = SourceData.compare[i].name.split(" ");
            for(var _k=0;_k<_data.length;_k++){
                or.push(_data[_k]);
            }
           // or.push(SourceData.compare[i].name.split(" ").toString());
            _docType[SourceData.compare[i].type] = or;
        }else{
            _docType[SourceData.compare[i].type] = SourceData.compare[i].name.split(" ");
        }
                
        // loading cat to product
            if(_proCats[_pro[i]] && _proCats[_pro[i]].length){
                if(_proCats[_pro[i]]!==undefined)
                    {
                    var or = _proCats[_pro[i]];
                    var _data = SourceData.compare[i].name.split(" ");
                    for(var _k=0;_k<_data.length;_k++){
                        
                            or.push(_data[_k]);
                        }
                    _proCats[_pro[i]] = or;
                    }
            }else{
                _proCats[_pro[i]] = SourceData.compare[i].name.split(" ");
            }
        // loading docs to product
        if(_proDocs[_pro[i]] && _proDocs[_pro[i]].length){
                var or = _proDocs[_pro[i]];
                var _data = SourceData.compare[i].type.split(" ");
                // var _data = SourceData.compare[i].type;
                for(var _k=0;_k<_data.length;_k++){
                    
                        or.push(_data[_k]);
                    }
            _proDocs[_pro[i]] = or;
        }else{
            _proDocs[_pro[i]] = SourceData.compare[i].type.split(" ");
        }
        // loading doctype and products
        if(_docPro[SourceData.compare[i].type] && _docPro[SourceData.compare[i].type].length){
            var _or = _docPro[SourceData.compare[i].type];
            var __data = SourceData.compare[i].product.split(" ");
            for(var _k=0;_k<__data.length;_k++){
                _or.push(__data[_k]);
            }
            _docPro[SourceData.compare[i].type] = _or;
        }else{
            _docPro[SourceData.compare[i].type] = SourceData.compare[i].product.split(" ");
        }


        _docs.push(SourceData.compare[i].type);
        // creating cat array
        var arr = SourceData.compare[i].name.split(" ");
        if(arr.length){
            for(var j=0;j< arr.length;j++){
                _cat.push(arr[j]);
            }
        } 
        // creating pro array
        var arr_pro = SourceData.compare[i].product.split(" ");
        if(arr_pro.length){
            for(var l=0;l< arr_pro.length;l++){
                if(arr_pro[l]){
                    _pro.push(arr_pro[l]);
                }
            }
        }

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
                    '<a style="height:300px" href="'+container_url+'" data-url='+href+' data-type='+DOCType+' class="resource-grid-card" data-image="'+flag+'">'+
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
                    '<div class="metadata">'+product+'</div>'+
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