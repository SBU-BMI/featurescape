console.log('download.js loaded')

downloadData=function(div){
    console.log('downloading ...')
    downloadData.getParms()
    // extract limit from url if provided
    if(downloadData.parms.url.match(/limit=\d+/)){
        downloadData.parms.limit=parseInt(downloadData.parms.url.match(/limit=(\d+)/)[1])
    }
    div.innerHTML='<p id="downloadDataLimitMsg"></p>Maximum number of features to download: <input id="downloadDataLimitInput" size=6> <button class="btn btn-primary" id="downloadButton">Download</button>'
    downloadDataLimitInput.value=100000
    downloadData.parms.url=downloadData.parms.url.replace(/limit=\d+&/,'').replace(/"\$gte"\:[0123456789\.]+/,'"$gte":0')
    //downloadData.parms.url=downloadData.parms.url.replace('"randval":{"$gte":0},','')
    // 'properties.scalar_features.nv' :
    downloadData.msg=function(m,c){
        downloadDataLimitMsg.style.color=c||'blue'
        downloadDataLimitMsg.innerHTML=m
    }

    var findQuery = function(pre){ //assemble find string where "randval":{"$gte":0} is
        pre=pre||''
        return downloadData.parms.url.replace('"randval":{"$gte":0},',pre+'"$and":[{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$gte" : '+downloadData.parms.xmin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$lte" : '+downloadData.parms.xmax+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$gte" : '+downloadData.parms.ymin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$lte" : '+downloadData.parms.ymax+'}}}}}}],')
    }

    downloadData.msg('estimating size of dataset ...','blue')
    //$.getJSON(downloadData.parms.url.replace('"$gte":0','"$gte":0.999')+'&limit=1000') // sample 1/1000th of the features
    $.getJSON(findQuery('"randval":{"$gte":0.999},')+'&limit=1000')
     .then(function(x){
         var n=x.length
         if(n>100){
             downloadData.msg('About '+n+',000 expected. That will take a while, for something faster maybe go back to the plot and select a smaller area','red')
         }else if(n>10){
             downloadData.msg('About '+n+',000 expected. It will take a few seconds to retrieve them','orange')
         }else{
             downloadData.msg('fewer than 10,000 features expected, it woudn\'t take long to retrieve them all','green')
         }
         downloadData.parms.pn=n*1000 // predicted n
     })
     //downloadData.parms.urlFind=downloadData.parms.url.replace('"randval":{"$gte":0},','"$and":[{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$gte" : '+downloadData.parms.xmin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.xTitle+'", "value" : {"$lte" : '+downloadData.parms.xmax+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$gte" : '+downloadData.parms.ymin+'}}}}}},{"properties.scalar_features":{"$elemMatch":{"nv":{"$elemMatch":{"name" : "'+downloadData.parms.yTitle+'", "value" : {"$lte" : '+downloadData.parms.ymax+'}}}}}}],')
     downloadData.parms.urlFind=findQuery()

     downloadButton.onclick=function(){
         downloadData.getData()
     }
}

downloadData.getParms=function(){ // extract parameters from url search
    downloadData.parms=downloadData.parms||{}
    location.search.slice(1).split('&')
     .forEach(function(pp){
         pp = pp.split('=')
         downloadData.parms[pp[0]]=decodeURIComponent(decodeURIComponent(pp[1]))
     })
    //var pp = decodeURIComponent(decodeURIComponent(location.search)).slice(1)
    4
}

// get the data

downloadData.getData=function(){
    var n =  10000
    if(!downloadData.dt){downloadData.dt=[]}
    if(!downloadData.parms.n){downloadData.parms.n=0}
    downloadData.msg('features retrieved: '+downloadData.parms.n+' ... out of an estimated total of '+downloadData.parms.pn)
    if(!downloadData.parms.lastId){
        var url= downloadData.parms.urlFind+'&limit='+n
    }else{
        //var url=downloadData.parms.urlFind.replace('find={','find={"_id":{"$gte":"'+downloadData.parms.lastId+'"},')+'&limit='+n
        var url=downloadData.parms.urlFind.replace('find={','find={"_id" > "'+downloadData.parms.lastId+'",')+'&limit='+n
        4
    }
    $.getJSON(url)
     .then(function(x){
         downloadData.parms.n+=x.length
         downloadData.parms.lastId=x.slice(-1)[0]._id
         downloadData.getData()
     })

    4
}



// Run
if(document.getElementById('downloadDataDiv')){
    downloadData(downloadDataDiv)
}
window.onload=function(){
    if(document.getElementById('downloadDataDiv')){
        downloadData(downloadDataDiv)
    }
}


/*
example
http://quip1.uhmc.sunysb.edu:3000/?limit=1000&find={%22randval%22:{%22$gte%22:0.17426561033975674},%22provenance.analysis.execution_id%22:%22luad:bg:20160520%22,%22provenance.image.case_id%22:%22TCGA-55-6543-01Z-00-DX1%22}&db=u24_luad


*/