console.log('zoomin.js loaded');

// add-on to http://sbu-bmi.github.io/FeatureScapeApps/featurescape/
// developed to add download button and zoom in data sections
// dev load: $.getScript('http://localhost:8000/featurescapeBMI/fun/zoomin.js')

zoomin=function(){ // ini
    if((resampleBt)&&(!btDownload)){ // if resample bt exists and btDownload does't
        var p = resampleBt.parentElement // paragraph with buttons
        var btDownload = document.createElement('button')
        btDownload.id='btDownload'
        var btZoomIn = document.createElement('button')
        btZoomIn.id='btZoomIn'
        p.appendChild(btDownload)
        //p.appendChild(btZoomIn)  <-- TO BE DEVELOPED
        // Download Button
        btDownload.textContent='Download Data'
        btDownload.className='btn btn-primary'        
        btDownload.onclick=function(){
            var plty=document.getElementsByClassName('js-plotly-plot')[0]
            console.log(plty._fullLayout.xaxis,plty._fullLayout.yaxis)
            console.log('opening download window')
            window.open('http://localhost:8000/featurescapeBMI/fun/download.html?url='+encodeURIComponent(location.search.slice(1))+'&xTitle='+plty._fullLayout.xaxis.title+'&yTitle='+plty._fullLayout.yaxis.title+'&xmin='+plty._fullLayout.xaxis._r[0]+'&xmax='+plty._fullLayout.xaxis._r[1]+'&ymin='+plty._fullLayout.yaxis._r[0]+'&ymax='+plty._fullLayout.yaxis._r[1])
        }
    }
}

zoomin()

