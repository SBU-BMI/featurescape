console.log('featurescape.js loaded')
// http://localhost:8000/featurescape/?https://fscape-132294.nitrousapp.com/?limit=1000;fun/u24demo.js

fscape=function(x){
    // being used to ini UI
    if((!x)&&(document.getElementById("featureScapeDiv"))){
        fscape.UI()
    }else if(x){ //creating an fscape grid instance
        return new fscape.grid(x)
    }else{
        console.log('no fscape UI')
    }
    
}

fscape.UI=function(){
    console.log('assembling UI ...')
    var div = document.getElementById("featureScapeDiv")
    fscape.div=div
    // load data
    $('<div id="loadDataDiv"></div>').appendTo(div)
    $('<div id="showLoadDataDiv"><a id="showLoadDataDivClick" href="javascript:void(0)" onclick="$(loadDataDiv).show(400);$(showLoadDataDiv).hide()">+ Load Data</a></div>').appendTo(div) 
    $(showLoadDataDiv).hide()
    $('<h4>Load Data</h4>').appendTo(loadDataDiv)
    $('<div>URL: <input id="inputURL" style="width:50%"></div>').appendTo(loadDataDiv)
    inputURL.onkeyup=function(evt){
        if(evt.keyCode==13){
            fscape.loadURL(inputURL.value)
        }
    }
    $('<div><input type="file" id="localFile" value="Local File"></div>').appendTo(loadDataDiv)
    $('<div id="dropBox-select"></div>').appendTo(loadDataDiv)
    $('<div id="loadingDropbox" style="color:red"> loading DropBox.com ... </div>').appendTo(loadDataDiv)
    $('<div id="box-select" data-link-type="direct" data-multiselect="YOUR_MULTISELECT" data-client-id="cowmrbwt1f8v3c9n2ucsc951wmhxasrb"></div>').appendTo(loadDataDiv)
    $('<div id="loadingBox" style="color:red"> loading Box.com ... </div>').appendTo(loadDataDiv)
    $('<div id="loadingDrive" style="color:navy;font-size:x-small"> we could also be using GoogleDrive, Microsoft OneDrive, Amazon S3, ... </div>').appendTo(loadDataDiv)
    
    // check for data URL
    if(location.search.length>1){
        var ss =location.search.slice(1).split(';')
        inputURL.value=ss[0]
        if(ss[1]){
            var sr=document.createElement('script')
            sr.src=ss[1]
            sr.onload=function(){
                fscape.loadURL()
            }
            document.head.appendChild(sr)
            //$.getScript(ss[1]).then(function(){
            //    fscape.loadURL()
            //})
        }else{
            fscape.loadURL()
        }
        
    }
    // load file
    localFile.onchange=function(){
        var f = this.files[0]
        var reader = new FileReader()
        reader.onload=function(x){
            fscape.loadFile(x.target.result,f.name)
        }
        reader.readAsText(f)
    }
    // load Box.com
    $.getScript("https://app.box.com/js/static/select.js").then(function(){
        $(document).ready(function(){
            var boxSelect = new BoxSelect();
            $('#loadingBox').remove()
            // Register a success callback handler
            boxSelect.success(function(response) {
                //console.log(response);
                fscape.loadBox(response)
            });
            // Register a cancel callback handler
            boxSelect.cancel(function() {
                console.log("The user clicked cancel or closed the popup");
            });
        });
    })

    // load DropBox

    var s = document.createElement('script')
    s.src="https://www.dropbox.com/static/api/2/dropins.js"
    s.id="dropboxjs"
    s.type="text/javascript"
    s.setAttribute("data-app-key","9vv5y78aguqu4pl")
    s.onload=function(){
        console.log('loaded dropbox file picker')
        var button = Dropbox.createChooseButton(options);
        document.getElementById("dropBox-select").appendChild(button);
        $('#loadingDropbox').remove()
    }
    document.body.appendChild(s)

    options = {
        success: function(files) {
            //console.log("Files", files)
            var url=files[0].link
            fscape.loadDropbox(url)
        },
        cancel: function() {},
        linkType: "direct",
        multiselect: false,
        //extensions: ['.json', '.txt', '.csv'],
    };

    // load Google Drive

    $.getScript('https://apis.google.com/js/api.js?onload=onApiLoad').then(function(){
        console.log('gapi loaded')
    })
}

fscape.loadBox=function(x){
    console.log('loading data from Box.com ...')
    var url=x[0].url
    $.getJSON(url).then(function(x){
        fscape.fun(x,url)
        //fscape.fun(x,url)
    })
    
}
fscape.loadDropbox=function(url){
    console.log('loading data from Dropbox.com ...')
    fscape.loadURL(url)
}
fscape.loadFile=function(x,fname){
    console.log('loading data from localFile ...')
    fscape.fun(JSON.parse(x),fname)
}

fscape.loadURL=function(url){
    // get URL from input
    if(!url){
        url = inputURL.value
    }
    localforage.getItem(url)
        .then(function(x){
            fscape.fun(x,url)
        })
        .catch(function(){
            $.getJSON(url).then(function(x){
                if(!fscape.dt){
                    fscape.fun(x,url)
                    localforage.setItem(url,x)
                }            
            })
        })
}

fscape.log=function(txt,color){
    featureScapeLog.innerHTML=txt
    if(!color){color='navy'}
    featureScapeLog.style.color=color
    console.log(txt)
}

fscape.cleanUI=function(){ // and create fscapeAnalysisDiv
    $(loadDataDiv).hide(400)
    $(showLoadDataDiv).show()
    // let's have some function
    if(!document.getElementById('fscapeAnalysisDiv')){
        $('<hr><div id="fscapeAnalysisDiv"><span style="color:red">processing, please wait ...</span></div>').appendTo(fscape.div)
        fscapeAnalysisDiv.hidden=true
        $(fscapeAnalysisDiv).show(1000)
    }else{
        fscapeAnalysisDiv.innerHTML='<span style="color:red">processing, please wait ...</span>'
    }
}

fscape.fun=function(x,url){
    fscape.log(x.length+' entries sampled from '+url,'blue')
    fscape.cleanUI()
    fscape.plot(x) 
}

fscape.clust2html=function(cl){
    var ind = cl[0]
    var T = cl[1]
    var cmap=jmat.colormap().map(function(ci){
        return ci.map(function(cij){return Math.round(cij*255)})
    })
    var h ='<h4 style="color:maroon">Cross-tabulated feature correlations</h4><table id="featurecrossTB">'
    ind.forEach(function(i,j){
        h+='<tr><td>'+fscape.dt.parmNum[i]+'</td>'
        T.forEach(function(c,k){
            var x = Math.pow(c[j],2) // E[0,1]
            if(isNaN(x)){x=1}
            var v = Math.round((1-x)*50)
            v=Math.min(v,50)
            v=Math.max(v,0)
            var cm = 'rgb('+cmap[v].toString()+')'
            h+='<td id="'+i+','+ind[k]+'" style="color:'+cm+';font-size:'+(14-4*c[j])+'">O</td>'
            //h+='<td style="color:rgb(255,">X</td>'
        })
        h+='</tr>'
    })
    h +='</table>'
    return h
}

// do it

fscape.plot=function(x){ // when ready to do it
    fscapeAnalysisDiv.innerHTML='<table><tr><td id="featurecrossTD">featurecross</td><td id="featuremapTD">featuremap</td></tr><tr><td id="featuremoreTD" style="color:blue">(click on symbols for densities)</td><td id="featurecompTD">featurecomp</td></tr></table><div id="featurecomputeDIV"></div>'
    //fscapeAnalysisDiv
    if(x){ // otherwise expect the data already packed in fscape.dt
        fscape.dt={
            docs:x,
            tab:{}
        }
        Object.getOwnPropertyNames(x[0]).forEach(function(p){
    	   fscape.dt.tab[p]=x.map(function(xi){
    	       return xi[p]
    	   })
        })
    }

    // featurecrossTD

    // lsit parameters
    var parmsAll = Object.getOwnPropertyNames(fscape.dt.tab)
    // numeric paramters
    var parmNum=Object.getOwnPropertyNames(fscape.dt.tab).filter(function(p){
        return typeof(fscape.dt.docs[0][p])=="number"
    })
    // string parameters
    var parmStr=Object.getOwnPropertyNames(fscape.dt.tab).filter(function(p){
        return typeof(fscape.dt.docs[0][p])=="string"
    })

    // cluster numeric paramters

    var xx = parmNum.map(function(p){
        return fscape.dt.tab[p]
    })

    // make sure they're all numbers
    ij2remove=[]
    xx.forEach(function(xi,i){
        xi.forEach(function(xij,j){
            if(typeof(xij)!='number'){
                console.log('non-numeric value at ('+i+','+j+'), '+xij)//+' - the whole row will be removed:',xi)
                ij2remove.push(j)
            }
        })
    })
    ij2remove=jmat.unique(ij2remove).sort().reverse()
    ij2remove.forEach(function(i){
        xx=xx.map(function(xi){
            xi.splice(i,1)
            return  xi // remove row i
        })
    })
    
    var cc = jmat.arrayfun(jmat.crosstab(xx),function(cij){
        return 1-Math.abs(cij)
    })
    cc.forEach(function(ci,i){
        ci[i]=0 // diagonal by defenition
    })
    var cl = jmat.cluster(cc)  // remember this has three output arguments
    fscape.dt.cl=cl // this may be better kept as a structure
    fscape.dt.parmNum=parmNum
    featurecrossTD.innerHTML=fscape.clust2html(cl)

    // featuremapTD
    featuremapTD.innerHTML='processing ...'
    setTimeout(function(){
        var tdfun=function(){
            var ij=JSON.parse('['+this.id+']')
            if(ij.length>0){
                var i = ij[0], j = ij[1]
                var fi=fscape.dt.parmNum[i]
                var fj=fscape.dt.parmNum[j]
                featuremapTD.innerHTML='zooming into <br><li style="color:blue">'+fi+'</li><li style="color:red">'+fj+'</li>'
            }
        }
        var tdover=function(){
            var ij=JSON.parse('['+this.id+']')
            if(ij.length>0){
                var i = ij[0], j = ij[1]
                var ind=fscape.dt.cl[0]
                var ii=ind.indexOf(i), jj=ind.indexOf(j)
                var fi=fscape.dt.parmNum[i]
                var fj=fscape.dt.parmNum[j]
                var cBack=JSON.parse('['+this.style.color.slice(4,-1).split(', ')+']').map(function(c){return 255-c}).toString()
                //featuremoreTD.innerHTML='<hr><p style="background-color:'+this.style.color+';color:rgb('+cBack+')">Pearson correlation between <br>'+fi+' <br>'+fj+'<br> = '+Math.round((1-fscape.dt.cl[1][j][i])*100)/100+'</p>'
                featuremoreTD.innerHTML='<hr><p style="background-color:'+this.style.color+';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p style="color:navy">Pearson correlation between <li style="color:navy">'+fi+' </li><li style="color:navy">'+fj+'</li> corr('+ii+','+jj+')= '+Math.round((1-fscape.dt.cl[1][ii][jj])*100)/100+'</p><p style="background-color:'+this.style.color+';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'
            }               
        }
        $('td',featurecrossTB).click(tdfun)
        $('td',featurecrossTB).mouseover(tdover)
    },0)


}


// ini
$(document).ready(function(){
    fscape()
})



// Reference
//
// generating reference csv file (no worries, all connection info obfuscated :-P)
// mongoexport --host xxxxxx --port xxxx --username xxxx --password xxxx  --collection Nuclei --type=csv --db=stony-brook --fields Slide,X,Y,Area,Perimeter,Eccentricity,Circularity,MajorAxisLength,MinorAxisLength,Extent,Solidity,FSD1,FSD2,FSD3,FSD4,FSD5,FSD6,HematoxlyinMeanIntensity,HematoxlyinMeanMedianDifferenceIntensity,HematoxlyinMaxIntensity,HematoxlyinMinIntensity,HematoxlyinStdIntensity,HematoxlyinEntropy,HematoxlyinEnergy,HematoxlyinSkewness,HematoxlyinKurtosis,HematoxlyinMeanGradMag,HematoxlyinStdGradMag,HematoxlyinEntropyGradMag,HematoxlyinEnergyGradMag,HematoxlyinSkewnessGradMag,HematoxlyinKurtosisGradMag,HematoxlyinSumCanny,HematoxlyinMeanCanny,CytoplasmMeanIntensity,CytoplasmMeanMedianDifferenceIntensity,CytoplasmMaxIntensity,CytoplasmMinIntensity,CytoplasmStdIntensity,CytoplasmEntropy,CytoplasmEnergy,CytoplasmSkewness,CytoplasmKurtosis,CytoplasmMeanGradMag,CytoplasmStdGradMag,CytoplasmEntropyGradMag,CytoplasmEnergyGradMag,CytoplasmSkewnessGradMag,CytoplasmKurtosisGradMag,CytoplasmSumCanny,CytoplasmMeanCanny,Boundaries,filename --limit 100000 --out nuclei100k.csv
//
// 1K reference dataset: https://opendata.socrata.com/resource/3dx7-jw2n.json
// 10K reference dataset: https://opendata.socrata.com/resource/ytu3-b8rp.json
// 100K reference dataset: https://opendata.socrata.com/resource/pbup-cums.json
// Tahsin's mongodb: https://fscape-132294.nitrousapp.com/?limit=100