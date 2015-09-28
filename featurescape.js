console.log('featurescape.js loaded')

fscape=function(){
    // ini
    fscape.UI()
}

fscape.UI=function(){
    console.log('assembling UI ...')
    var div = document.getElementById("featureScapeDiv")
    // load data
    $('<div id="loadDataDiv"></div>').appendTo(div)
    $('<h4>Load Data</h4>').appendTo(loadDataDiv)
    $('<div>URL: <input id="inputURL" style="width:50%"></div>').appendTo(loadDataDiv)
    $('<div><input type="file" id="localFile" value="Local File"></div>').appendTo(loadDataDiv)
    $('<div id="dropBox-select"></div>').appendTo(loadDataDiv)
    $('<div id="loadingDropbox" style="color:red"> loading DropBox.com ... </div>').appendTo(loadDataDiv)
    $('<div id="box-select" data-link-type="direct" data-multiselect="YOUR_MULTISELECT" data-client-id="cowmrbwt1f8v3c9n2ucsc951wmhxasrb"></div>').appendTo(loadDataDiv)
    $('<div id="loadingBox" style="color:red"> loading Box.com ... </div>').appendTo(loadDataDiv)
    $('<div id="loadingDrive" style="color:navy;font-size:x-small"> we could also be using GoogleDrive, Microsoft OneDrive, Amazon S3, ... </div>').appendTo(loadDataDiv)
    
    // check for data URL
    if(location.search.length>1){
        inputURL.value=location.search.slice(1)
        fscape.loadURL()
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
    $.getJSON(url).then(function(x){
        fscape.fun(x,url)
    })
        

}

fscape.fun=function(x,url){
    console.log('retrieved array with '+x.length+' entries from '+url)
}




// ini
fscape()


// Reference
//
// generating reference csv file (no worries, all connection info obfuscated :-P)
// mongoexport --host xxxxxx --port xxxx --username xxxx --password xxxx  --collection Nuclei --type=csv --db=stony-brook --fields Slide,X,Y,Area,Perimeter,Eccentricity,Circularity,MajorAxisLength,MinorAxisLength,Extent,Solidity,FSD1,FSD2,FSD3,FSD4,FSD5,FSD6,HematoxlyinMeanIntensity,HematoxlyinMeanMedianDifferenceIntensity,HematoxlyinMaxIntensity,HematoxlyinMinIntensity,HematoxlyinStdIntensity,HematoxlyinEntropy,HematoxlyinEnergy,HematoxlyinSkewness,HematoxlyinKurtosis,HematoxlyinMeanGradMag,HematoxlyinStdGradMag,HematoxlyinEntropyGradMag,HematoxlyinEnergyGradMag,HematoxlyinSkewnessGradMag,HematoxlyinKurtosisGradMag,HematoxlyinSumCanny,HematoxlyinMeanCanny,CytoplasmMeanIntensity,CytoplasmMeanMedianDifferenceIntensity,CytoplasmMaxIntensity,CytoplasmMinIntensity,CytoplasmStdIntensity,CytoplasmEntropy,CytoplasmEnergy,CytoplasmSkewness,CytoplasmKurtosis,CytoplasmMeanGradMag,CytoplasmStdGradMag,CytoplasmEntropyGradMag,CytoplasmEnergyGradMag,CytoplasmSkewnessGradMag,CytoplasmKurtosisGradMag,CytoplasmSumCanny,CytoplasmMeanCanny,Boundaries,filename --limit 100000 --out nuclei100k.csv
//
// 1K reference dataset: https://opendata.socrata.com/resource/3dx7-jw2n.json
// 10K reference dataset: https://opendata.socrata.com/resource/ytu3-b8rp.json
// 100K reference dataset: https://opendata.socrata.com/resource/pbup-cums.js