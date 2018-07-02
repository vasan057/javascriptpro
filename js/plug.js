(function($){
    var orginMenu={};
    var globvar ="";
    var mainSource ="";
    var avail = [];
    $.fn.Plug = function(options){
        options = $.extend({
            that:this,
            source :"",
            sortBy:"",
            filters:"",
            update:false,
            currentPattern:"",
            checked:false,
            inputTrigger:false,
            opts:[],
            tmpSource: options.source.compare,
            header : "Resource Library",
            menus: [{label:"Industry Verticals",field:"name",type:"multi"},{label:"Document Type",field:"type",type:"single"},{label:"Citrix Product Type",field:"product",type:"multiple"}],
            grid:[{type:"div",class:"small-12 large-3 medium-3 columns menu-block",id:"options"},{type:"div",class:"small-12 large-9 medium-9 columns content-block"}],
            selected:{}

        },options);
        init(options);
        globvar = dataManpulat(options);
    };
    var init = function(options){
        if(options.update){
            options.that[0].getElementsByClassName("content-block")[0].remove();
        }else{
            options.that[0].innerHTML="";
        }
        gridLayout(options.grid,function(elements){
            if(!options.update) sidebarManager(elements[0],options);
            contentManager(elements[1],options);
        });
        if(options.input) {
            var val = options.input.value;
            options.input.setSelectionRange(val.length,val.length);
            if(val.length && options.inputTrigger) options.input.focus();
            options.inputTrigger = false;
        }
        if(!options.update && options.menus){
            var _menus = options.menus;
            _menus.forEach(function(val,key){
                options['selected'][val.field]=[];
            });
        }
    };
    
    // creates elements
    var sample = function(){
        var date = $('#date-sort:checked');
        var headline = $('#headline-sort:checked');
        if(date.length) globvar['sortBy']='date';
        if(headline.length) globvar['sortBy']='headline';
        globvar['update']=true;
        init(globvar);
    }
    var SearchFilter = function(search){
        var tmpdata = globvar.tmpSource;
        var keys=  tmpdata.forEach(function(k,v){
            var patten = new RegExp(search,"i");
            if(patten.test(k.text)){
                globvar.tmpSource[v]['filter']=false;
            }else{
                globvar.tmpSource[v]['filter']=true;
            }
        });
        globvar['filters'] = search;
        globvar['inputTrigger']=true;
        init(globvar);

    }
    var resetForm = function(){
        globvar['update'] = false;
        globvar['filters'] = "";
        globvar['checked'] = false;
        globvar.tmpSource.forEach(function(k,v){
            k.check = false;
            k.current = false;
            k.currentPattern = "";
            k.filter = false;
        });
        init(globvar);
    }
    var updateSub = function(sub,relat,patten){
        var items = globvar.tmpSource;
        var fnl = [];
        items.forEach(function(k,v){
            if(patten.test(k[relat])){
                if($.inArray(k.n,sub) !== -1) fnl.push(k.n);
            }
        });
        return fnl;

    };
    var changeMenu = function(that,all){
        var check = $(that);
        var currentChecked = check.attr('id');
        var opts = globvar.opts; 
        var _selected = globvar.selected;
        if(!all){
            var cur_relation = check.attr('relation');
            if(check.is(':checked')){
                opts.push(currentChecked);
                _selected[cur_relation].push(currentChecked);
            }else{
                opts.splice($.inArray(currentChecked,opts),1);
                _selected[cur_relation].splice($.inArray(currentChecked,_selected[cur_relation]),1);
            }
           var list_check =  $("input[type=checkbox][relation='"+cur_relation+"']:checked");
           if(list_check.length){
               $("input[type=checkbox][extra='"+cur_relation+"'").prop("checked",false);
            } else{
                $("input[type=checkbox][extra='"+cur_relation+"'").prop("checked",true);
            }

        }else{
            // uncheck related checkbox list
            var all_relation = check.attr('extra');
            _selected[all_relation] = [];
            $(that).prop("checked",true);
            var cur_type = $("input[type=checkbox][relation='"+all+"']");
            cur_type.each(function(ke,ve){
                $(ve).prop('checked', false);
                var cur_id = $(ve).attr('id');
                if($.inArray(cur_id,opts) !== -1) opts.splice($.inArray(cur_id,opts),1);
            })
        }
        globvar['opts']=opts;
        var query = [];
        for(var i=0; i<opts.length; i++){
            query.push($("#"+opts[i])[0]);
        }
        var qry = document.querySelectorAll('input[relation]:checked');
        var tmpdata = globvar.tmpSource;
        var currentPattern = "";
        var ini = avail;
        var tmp = [];
        var sub = [];
        query.forEach(function(val,key){
            var id = val.getAttribute('id');
            var relat = val.getAttribute('relation');
            var patten = new RegExp(id,"i");
            if(currentPattern != "" && currentPattern != relat) {
                sub = updateSub(sub,relat,patten);
                ini = $.merge(tmp,sub);
                sub = []
                tmp = [];
            }
            var keys=  tmpdata.forEach(function(k,v){
                
                var n = globvar.tmpSource[v]['n'];
                if(patten.test(k[relat])) {
                    sub.push(n);
                }
                if(patten.test(k[relat]) && (currentPattern == "" || currentPattern == relat)){
                    if($.inArray(n,ini) !== -1) tmp.push(n);
                    
                }else if(currentPattern != "" && currentPattern != relat){
                    if(patten.test(k[relat])){
                       if($.inArray(n,ini) !== -1) tmp.push(n); 

                    }
                }
            });
            currentPattern = relat;
        });
       
        globvar.currentPattern = "";
        menus = globvar.menus;
        // menu count setting
        var tmp_relation = cur_relation?cur_relation:all_relation
        var list_ids=[];
        for(var i=0; i<menus.length; i++){
            // check if current checked type
            if(menus[i].field != tmp_relation){
                orginMenu[menus[i].field].forEach(function(val,key){
                    lookupCount(menus[i].field,val,_selected);
                });
            }
            orginMenu[menus[i].field].forEach(function(val,key){
                lookupList(menus[i].field,val,_selected,function(list){ list_ids=$.merge(list_ids,list); });
            });
        }
        ini = $.unique(list_ids);
        if(query.length){
            tmpdata.forEach(function(k,v){
                if($.inArray(globvar.tmpSource[v]['n'],ini) !== -1){
                    globvar.tmpSource[v]['check']=true;
                }else{
                     globvar.tmpSource[v]['check']=false;
                }
            });
            globvar.checked = true;
        }
        // if everything unchecked then
        if(!query.length){
            tmpdata.forEach(function(k,v){
                globvar.tmpSource[v]['check']=false;
                globvar.tmpSource[v]['current'] = false;
            });
            globvar.checked = false;
          
        }
        globvar['update'] = true;
        globvar.selected = _selected;
        init(globvar);
        query=[];
    }
    var lookupList = function(sideHeading,value,selected,cb){
        var ids = {};
        ids[value]=[];
        globvar.menus.forEach(function(val,key){
            selectedList([sideHeading,value],val.field,selected[val.field],function(res){
                ids[value].push(res);
            })
        });
        var result = ids[value].shift().filter(function(v) {
            return ids[value].every(function(a) {
                return a.indexOf(v) !== -1;
            });
        });
        cb(result);

    }
    var lookupCount = function(sideHeading,value,selected){
        var ids = {};
        ids[value]=[];
        globvar.menus.forEach(function(val,key){
            if(val.field != sideHeading){
                selectedList([sideHeading,value],val.field,selected[val.field],function(res){
                    ids[value].push(res);
                })
            }
        });
        var result = ids[value].shift().filter(function(v) {
            return ids[value].every(function(a) {
                return a.indexOf(v) !== -1;
            });
        });
       var ele = $("#"+value);
       ele.siblings('label').find('span').text("("+result.length+")");
       if(!result.length) {
           ele.prop('disabled',true);
           ele.siblings('label').addClass('disabled');
       }else{
           ele.prop('disabled',false);
           ele.siblings('label').removeClass('disabled');
       }
       
    }
    /**
     * 
     */
    var selectedList = function(comp,whom,selected,cb){
        var ids = [];
        var main_pattern = new RegExp(comp[1],"i");
        var items = globvar.tmpSource;
        //  if length is 0
        if(!selected.length){
            items.forEach(function(k,v){
                if(main_pattern.test(k[comp[0]])){
                    ids.push(k.n);
                }
            });
            ids = $.unique(ids);
        }else{
            selected.forEach(function(val,key){
                var pattern = new RegExp(val,"i");
                items.forEach(function(k,v){
                    if(main_pattern.test(k[comp[0]]) && pattern.test(k[whom])){
                        ids.push(k.n);
                    }
                });
            })
            ids = $.unique(ids);
        }
        cb(ids);
    }

    var dataByN = function(selected,_items,value,_field,cb){
        var count = 0;
        var _regex = new RegExp(value,"i");
        _items.forEach(function(_v,_k){
            if($.inArray(_v.n,selected) !== -1){
                if(_regex.test(_v[_field])){
                    count++;
                }
            }
        });
        cb(count);
    }
    var gridLayout = function(item,cb){
        var elements=[];
        for(var i =0; i<item.length; i++){
            var  element = document.createElement(item[i].type);
            if(item[i].class) element.setAttribute('class',item[i].class);
            if(item[i].id) element.setAttribute('id',item[i].id);
            if(item[i].types) element.setAttribute('type',item[i].types);
            if(item[i].value) element.setAttribute('value',item[i].value);
            if(item[i].for) element.setAttribute('for',item[i].for);
            if(item[i].relation) element.setAttribute('relation',item[i].relation);
            if(item[i].extra) element.setAttribute('extra',item[i].extra);
            if(item[i].checked) element.setAttribute('checked',item[i].checked);
            if(item[i].text) element.innerHTML = item[i].text;
            elements.push(element);
        }
        cb(elements);
    };
    var sidebarManager = function(div,options){
        var that = options.that;
        var menu = options.menus;
        var header = options.header;
        // first heading
        headerManager(header,'h1',function(hElement){
            div.appendChild(hElement);
            // firt div
            var menuItem = [{type:"div",class:"menu-items",id:"options"}]
            gridLayout(menuItem,function(menuElement){
                div.appendChild(menuElement[0]);
                var subheading = "<b>Filter</b> | ";
                var reset = document.createElement('a');
                reset.setAttribute("href","javascript://");
                reset.innerHTML="reset"

                reset.addEventListener("click",resetForm);
                subHeaderManager(subheading,'h2',function(subhead){ menuElement[0].appendChild(subhead).appendChild(reset); });
                // populating all the menus
                menus = options.menus;
               for(var i=0; i<menus.length; i++){
                    // looping number of menu blocks
                    var listMenuItem = [{type:"div",class:"option-set",id:menus[i].field}]
                    gridLayout(listMenuItem,function(listDiv){
                        menuTitle(menu[i].label,'h3',function(listHead){ listDiv[0].appendChild(listHead); });
                        // div.appendChild(listDiv[0]);
                        // populate individual menus
                        menuManager(menus[i].field,options.tmpSource,function(res){
                            var listMenu = res.arr;
                            listMenu = listMenu.sort();
                            var listCount = res.count;
                            var listRelation = res.relation;
                            var uls = [{type:"ul",class:"doc-options"}];
                            var _orginMenu = [];
                            gridLayout(uls,function(ul){ 
                                ul = ul[0];

                                gridLayout([{type:'li'}],function(li){
                                    var checked = !options.update;
                                    gridLayout([{types:"checkbox",type:"input","id":menus[i].label.replace(/\s/g,'_'),extra:menus[i].field,checked:checked}],function(res){ 
                                       res[0].addEventListener("change",function(){
                                           changeMenu(this,listRelation[0]);
                                       });
                                       li[0].appendChild(res[0]);
                                   });
                                   // store allmenu byparent
                                   var text = "All "+menus[i].label;
                                   gridLayout([{for:menus[i].label.replace(/\s/g,'_'),type:"label",text:text}],function(res){
                                       li[0].appendChild(res[0]);
                                   });
                                ul.appendChild(li[0]);   
                               });

                                for(var j=0; j<listMenu.length; j++){
                                    gridLayout([{type:'li'}],function(li){
                                         gridLayout([{types:"checkbox",type:"input","id":listMenu[j],relation:listRelation[j]}],function(res){ 
                                            res[0].addEventListener("change",function(){
                                                changeMenu(this,false);
                                            });
                                            li[0].appendChild(res[0]);
                                        });
                                        var text =  listMenu[j].replace(/_/g,' ')+' <span>('+listCount[listMenu[j]]+')';
                                        // store allmenu byparent
                                        _orginMenu.push(listMenu[j]);
                                        gridLayout([{for:listMenu[j],type:"label",text:text}],function(res){
                                            li[0].appendChild(res[0]);
                                        });
                                     ul.appendChild(li[0]);   
                                    });
                                }
                                listDiv[0].appendChild(ul);
                             });
                             orginMenu[menus[i].field] = _orginMenu;
                        });
                        menuElement[0].appendChild(listDiv[0]);
                    })
               }
            });
        });

        that[0].appendChild(div);
    }
    var contentManager = function(div,options){
        var that = options.that;
        that[0].appendChild(div);
        searchSort(div,options,function(searchDiv){   });
        countRecords(div,options,function(){ });
        listManager(div,options,function(){});
        
    }
    var headerManager = function(text,tag,cb){
        var hElement = document.createElement(tag);
        hElement.setAttribute('class','menu-heading');
        hElement.innerHTML = text;
        cb(hElement);
    }
     var subHeaderManager = function(text,tag,cb){
        var hElement = document.createElement(tag);
        hElement.setAttribute('class','subheading');
        hElement.innerHTML = text;
        cb(hElement);
    }
    var menuTitle = function(text,tag,cb){
        var hElement = document.createElement(tag);
        hElement.setAttribute('class','menu-title');
        hElement.innerHTML = text;
        cb(hElement);
    }
    var menuManager = function(check,list,cb){
        var menus = [];
        for(var i=0; i<list.length; i++){
            if(list[i][check] && !list[i].check && !list[i].filter){
                menus.push(list[i][check]);
            }
        }
        var menu = [];
        for(var k=0;k<menus.length; k++){
            var tmp = menus[k].split(" ");
            for(var i=0; i<tmp.length;i++){
                if(tmp[i]) menu.push(tmp[i]);
            }
        }
        arrayCount(menu,check,function(res){
            cb(res);
        });
    }
    var arrayCount = function(arr,check,cb){
        arr.sort();
        var current = null;
        var cnt = 0;
        var res = {};
        var ind  = [];
        var relation = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != current) {
                if (cnt > 0) {
                    res[current]=cnt;
                    ind.push(current);
                    relation.push(check);
                }
                current = arr[i];
                cnt = 1;
            }else{
                cnt++;
            }
        }
        if (cnt > 0) {
            res[current]=cnt;
            ind.push(current);
            relation.push(check);
        }
        cb({count:res,arr:ind,relation:relation});
    }
    var searchSort = function(div,options,cb){
        var rowDiv = [{type:"div",class:"row sort-search-content"}];
        gridLayout(rowDiv,function(row_div){
            div.appendChild(row_div[0]);
            var rowDiv = [{type:"div",class:"large-9 medium-8 small-8 columns search-box"}];
            gridLayout(rowDiv,function(searchBoxDiv){
                row_div[0].appendChild(searchBoxDiv[0]);
                 var rowDiv = [{type:"div",class:"search"}];
                 gridLayout(rowDiv,function(searchDiv){
                    searchBoxDiv[0].appendChild(searchDiv[0]);
                    var rowDiv = [{type:"div",class:"large-11 medium-11 small-10 columns"}];
                    gridLayout(rowDiv,function(inputDiv){
                        searchDiv[0].appendChild(inputDiv[0]);
                         var inputConf = [{type:"input",types:"text",placeholder:"Search all assets",name:"search",id:"quicksearch",value:options.filters}];
                          gridLayout(inputConf,function(input){
                            input[0].addEventListener("input",function(){ SearchFilter(this.value);});
                            globvar['input'] = input[0];
                            inputDiv[0].appendChild(input[0]);
                          });
                    });
                 });
            });
            sortButton(row_div[0],options,function(btn){

            });
        });
        cb(div);
    };

    var sortButton = function(div,options,cb){
        var dateSort = options.sortBy == 'date' ? 'checked':'';
        var headlineSort = options.sortBy == 'headline' ? 'checked':'';
        var rowDiv = [{type:"div",class:"large-3 medium-4 small-4 columns sort-box",id:"sort-by"}];
            gridLayout(rowDiv,function(sortBoxDiv){
                div.appendChild(sortBoxDiv[0]);
                var rowDiv = [{type:"div",class:"large-12 medium-12 small-12 columns sort-box-items"}];
                gridLayout(rowDiv,function(sortDiv){
                    sortBoxDiv[0].appendChild(sortDiv[0]);
                    var multi1 = "<a class=\"button filter-btn\" id=\"show-menu\"><span><img src=\"images/filter-icon.png\"></span> Filter</a>";
                    multi1 = $.parseHTML(multi1);
                    var multi3 = "<div class=\"sort_dropdown hidden\" >"+
                                    "<div class=\"close\"><img src=\"images/sort-close.png\" class=\"fa\" width=\"25\"></div>"+
                                    "<div class=\"filter\">Sort | <a href=\"javascript://\" id=\"filter-reset\" class=\"resetfilter\">Reset</a></div>"+
                                    "<ul id=\"dwn_sort\" class=\"items\" data-dropdown-content=\"\" tabindex=\"-1\" aria-hidden=\"true\" aria-autoclose=\"true\">"+
                                        "<li id=\"sort_date\">"+
                                            "<label class=\"container\">Date"+
                                                "<input name=\"sort\" id=\"date-sort\" type=\"radio\" data-sort-by=\"date\" "+dateSort+">"+
                                                "<span class=\"checkmark\"></span>"+
                                            "</label>"+
                                        "</li>"+
                                        "<li id=\"sort_headline\">"+
                                            "<label class=\"container\">Alphabetical Order"+
                                                "<input  name=\"sort\" id=\"headline-sort\" type=\"radio\" data-sort-by=\"headline\" "+headlineSort+">"+
                                                "<span class=\"checkmark\"></span>"+
                                            "</label>"+
                                        "</li>"+
                                    "</ul>"+
                                "</div>";
                    var multi2 =  "<a class=\"button sort-btn\">Sort <span><img src=\"images/sort-icon.png\"></span></a>";
                    multi2 = $.parseHTML(multi2);
                    multi2[0].addEventListener("click",function(){
                        alert('test');
                    });
                    $(sortBoxDiv[0]).append(multi1);
                    $(sortBoxDiv[0]).append(multi2);
                    console.log(multi2);
                   
                    // var rowDiv = [{type:"div",text:multi}];
                    // gridLayout(rowDiv,function(sortMDiv){
                    //     sortDiv[0].appendChild(sortMDiv[0]);
                    //     var multi = "<div class=\"sort_dropdown hidden\" >"+
                    //                 "<div class=\"close\"><img src=\"images/sort-close.png\" class=\"fa\" width=\"25\"></div>"+
                    //                 "<div class=\"filter\">Sort | <a href=\"javascript://\" id=\"filter-reset\" class=\"resetfilter\">Reset</a></div>"+
                    //                 "<ul id=\"dwn_sort\" class=\"items\" data-dropdown-content=\"\" tabindex=\"-1\" aria-hidden=\"true\" aria-autoclose=\"true\">"+
                    //                     "<li id=\"sort_date\">"+
                    //                         "<label class=\"container\">Date"+
                    //                             "<input name=\"sort\" id=\"date-sort\" type=\"radio\" data-sort-by=\"date\" "+dateSort+">"+
                    //                             "<span class=\"checkmark\"></span>"+
                    //                         "</label>"+
                    //                     "</li>"+
                    //                     "<li id=\"sort_headline\">"+
                    //                         "<label class=\"container\">Alphabetical Order"+
                    //                             "<input  name=\"sort\" id=\"headline-sort\" type=\"radio\" data-sort-by=\"headline\" "+headlineSort+">"+
                    //                             "<span class=\"checkmark\"></span>"+
                    //                         "</label>"+
                    //                     "</li>"+
                    //                 "</ul>"+
                    //             "</div>";
                    //     var rowDiv = [{type:"div",text:multi}];
                    //     gridLayout(rowDiv,function(tot){
                    //         sortDiv[0].appendChild(tot[0]);
                    //     });
                    // });
                });
            });
            cb(div);
    }
    var countRecords = function(div,options,cb){
        var rowDiv = [{type:"div",class:"row"}];
        gridLayout(rowDiv,function(row){
            div.appendChild(row[0]);
            var rowDiv = [{type:"div",class:"large-10 medium-10 columns asset-count"}];
            gridLayout(rowDiv,function(countDiv){
                row[0].appendChild(countDiv[0]);
                var rowDiv = [{type:"div",class:"filter-count-main"}];
                gridLayout(rowDiv,function(totalCount){
                    var ops = Object.keys(options.tmpSource).filter(function(v,k){
                        if(options.update){
                            return !options.tmpSource[v].hide && !options.tmpSource[v].filter && options.tmpSource[v].check;
                        } else{
                            return !options.tmpSource[v].hide && !options.tmpSource[v].filter;
                        }
                    });
                    var count = ops?ops.length:0;
                    totalCount[0].innerHTML = count+" Resources";
                    countDiv[0].appendChild(totalCount[0]);
                });
            });
        });
        cb(div);

    }
    var listManager = function(div,options,cb){
        var rowDiv = [{type:"div",class:"row",id:"container1"}];
        gridLayout(rowDiv,function(row){
            div.appendChild(row[0]);
            sortManager(options.tmpSource,options.sortBy,function(items){
                for(var i=0; i<items.length; i++){
                    if(!items[i].hide && !items[i].filter){
                        if(options.checked){
                            if(items[i].check){
                                var rowDiv = [{type:"div",class:"item small-12 large-6 medium-6 columns"}];
                                gridLayout(rowDiv,function(listDiv){
                                    arrangeList(items[i],function(html){
                                        listDiv[0].innerHTML = html;
                                        
                                    });
                                    
                                    row[0].appendChild(listDiv[0]);
                                    if(i==(items.length-1)){
                                        row[0].innerHTML =row[0].innerHTML+"<div style=\"clear:both;\"></div>"
                                    }
                                });
                            }
                        }else{
                            var rowDiv = [{type:"div",class:"item small-12 large-6 medium-6 columns"}];
                            gridLayout(rowDiv,function(listDiv){
                                arrangeList(items[i],function(html){
                                    listDiv[0].innerHTML = html;
                                    
                                });
                               
                                row[0].appendChild(listDiv[0]);
                                if(i==(items.length-1)){
                                    row[0].innerHTML =row[0].innerHTML+"<div style=\"clear:both;\"></div>"
                                }
                            });
                        }
                    }

                }
            });
        });
    };

    var arrangeList = function(item,cb){
        var is_mage = item.img ? true:false;
        var video_flag = item.duration ? true:false;
        var image_html='';
        var overlay='';
       
        if(is_mage){
            image_html='<img  src="images/'+item.img+'">';
            overlay='<div class="overlay"></div>';
        }
        var video_html='';
         var href='javascript://';
        if(video_flag){
            video_html='<span class="icon-play-darker-hollow"><i class="fa fa-play-circle"></i></span><span>'+item.duration+'</span>';
            // alert(item.link);
            // $('.webinar-video iframe').attr('src',item.link);
            var href='#lightbox-webinar';
        }
         // console.log(image_html);
        var type = item.type.replace(/_/g,' ');
        var name = item.name.replace(/_/g,' ');//style=\"height:300px\"
        var html = "<div class=\"item small-12 large-5 medium-12 columns resource-grid-cell animated pulse\">"+
                        "<a  href=\"javascript://\" data-url=\""+item.link+"\" class=\"resource-grid-cell resource-grid-card\" data-image=\""+is_mage+"\" >"+
                            "<div class=\"title-container\">"+image_html+overlay+
                                "<div class=\"title-wrapper\">"+
                                    "<span class=\"title\" style=\"background-color:rgba(0,0,0,0.6); color:white;\">"+
                                        name+
                                    "</span>"+
                                    "<span class=\"vid-duration\" data-video="+video_flag+">"+ video_html+"</span>"+
                                "</div>"+
                            "</div>"+
                            "<div class=\"data-container\">"+
                                "<div class=\"headline\">"+
                                   item.title+
                                "</div>"+
                                "<div class=\"metadata\">"+
                                   type +
                                "</div>"+
                            "</div>"+
                        "</a>"+
                    "</div>";
            cb(html);

    };
    var sortManager = function(items,sortBy,cb){
        var date = sortBy == 'date' ? true:false;
        var headline = sortBy == 'headline' ? true:false;
        if(date){
            items.sort(function(a, b) {
                var dateA = new Date(a.date), dateB = new Date(b.date);
                return dateA - dateB;
            });
        }else if(headline){
            items.sort(function(a, b) {
                var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });
        }else{

        }
        cb(items);
    };
    var dynamicMenuChange = function(){
        
    }
    function orderChange(){
    }
    function dataManpulat(options){
        var obj=[];
        var data = options.tmpSource;
        for(var i=0; i<data.length; i++){
            var text = [];
            for(key in data[i]){
                text.push(data[i][key]);
            }
            data[i]['text'] = JSON.stringify(text);
            data[i]['n']=i+1;
            avail.push(i+1);
        }
        options['tmpSource'] = data; 
        return options;
    }
    
})(jQuery);