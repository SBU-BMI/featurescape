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
    $('<div><button>Local File</button></div>').appendTo(loadDataDiv)
    $('<div id="dropBox-select"></div>').appendTo(loadDataDiv)
    $('<div id="loadingDropbox" style="color:red"> loading DropBox.com ... </div>').appendTo(loadDataDiv)
    $('<div id="box-select" data-link-type="direct" data-multiselect="YOUR_MULTISELECT" data-client-id="cowmrbwt1f8v3c9n2ucsc951wmhxasrb"></div>').appendTo(loadDataDiv)
    $('<div id="loadingBox" style="color:red"> loading Box.com ... </div>').appendTo(loadDataDiv)
    // check for data URL
    if(location.search.length>1){
        inputURL.value=location.search.slice(1)
        fscape.loadURL()
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
            console.log("Files", files)
        },
        cancel: function() {},
        linkType: "direct",
        multiselect: false,
        //extensions: ['.json', '.txt', '.csv'],
    };
    
    





}

fscape.loadURL=function(){
    console.log('loading data from URL ...')
}
fscape.loadBox=function(){
    console.log('loading data from Box.com ...')
}




// ini
fscape()