 if(disbaletype=='topic' )
        {
             var d_lists = $('.doc-options input[type=checkbox]:checked');
             if(filters.topic)
             {
                console.log('topic:filtes:'+filters.document);
                if(filters.topic.length>0)
                {
                    $.each(d_lists,function(k,v){
                    docs_checked.push($(v).attr('data-filter'));
                    });
                    filters.document=[];
                   
                    
                }
                else
                {
                   $.each(d_lists,function(k,v){
                        filters.document[0].push('.'+$(v).attr('data-filter'));
                    });
                }
             }
             else
             {
                
             }
                          
        }
        if(disbaletype=='doc')
        {
             var t_lists = $('.top_options input[type=checkbox]:checked');
             if(filters.document)
             {
                if(filters.document.length>0)
                {
                    $.each(t_lists,function(k,v){
                        if(v!=undefined)
                        {
                            topic_checked.push($(v).attr('data-filter'));
                        }
                     });
                    filters.topic=[];
                   
                }
                else
                {
                    $.each(t_lists,function(k,v){
                        filters.topic[1].push('.'+$(v).attr('data-filter'));
                    });
                }
             }
        }