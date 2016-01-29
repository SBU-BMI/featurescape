console.log('u24Preview.js loaded')


u24p=function(){
    // ini
    u24p.buildUI('u24PreviewDiv')
    
}

u24p.cases=["TCGA-05-4395-01Z-00-DX1", "TCGA-05-4415-01Z-00-DX1", "TCGA-05-4417-01Z-00-DX1", "TCGA-35-3615-01Z-00-DX1", "TCGA-38-4627-01Z-00-DX1", "TCGA-38-4628-01Z-00-DX1", "TCGA-44-2661-01Z-00-DX1", "TCGA-44-6779-01Z-00-DX1", "TCGA-44-7671-01Z-00-DX1", "TCGA-49-4487-01Z-00-DX1", "TCGA-49-4494-01Z-00-DX1", "TCGA-49-4501-01Z-00-DX1", "TCGA-50-7109-01Z-00-DX1", "TCGA-53-7813-01Z-00-DX1", "TCGA-55-1596-01Z-00-DX1", "TCGA-55-6970-01Z-00-DX1", "TCGA-55-6980-01Z-00-DX1", "TCGA-55-6981-01Z-00-DX1", "TCGA-55-6983-01Z-00-DX1", "TCGA-55-7574-01Z-00-DX1", "TCGA-64-5774-01Z-00-DX1", "TCGA-67-3772-01Z-00-DX1", "TCGA-67-6217-01Z-00-DX1", "TCGA-73-7498-01Z-00-DX1", "TCGA-75-5146-01Z-00-DX1", "TCGA-75-6212-01Z-00-DX1", "TCGA-75-7025-01Z-00-DX1", "TCGA-75-7031-01Z-00-DX1", "TCGA-78-7148-01Z-00-DX1", "TCGA-78-7158-01Z-00-DX1", "TCGA-78-7160-01Z-00-DX1", "TCGA-78-7161-01Z-00-DX1", "TCGA-78-7166-01Z-00-DX1", "TCGA-78-7167-01Z-00-DX1", "TCGA-78-7535-01Z-00-DX1", "TCGA-78-7536-01Z-00-DX1", "TCGA-80-5608-01Z-00-DX1", "TCGA-86-7713-01Z-00-DX1"]
u24p.ftrs=["NumberOfPixels", "PhysicalSize", "NumberOfPixelsOnBorder", "FeretDiameter", "PrincipalMoments0", "PrincipalMoments1", "Elongation", "Perimeter", "Roundness", "EquivalentSphericalRadius", "EquivalentSphericalPerimeter", "EquivalentEllipsoidDiameter0", "EquivalentEllipsoidDiameter1", "Flatness", "MeanR", "MeanG", "MeanB", "StdR", "StdG", "StdB"]

u24p.buildUI=function(id){ // build User Interface
    var div = document.getElementById(id)
    div.innerHTML='<h3> preview Case IDs</h3>'
    var ol = document.createElement('ol')
    div.appendChild(ol)
    u24p.cases.forEach(function(c){
        var li = document.createElement('li')
        ol.appendChild(li)
        li.innerHTML='<a href="http://reserve4.informatics.stonybrook.edu/dev1/osdCamicroscope.php?tissueId='+c+'" target="_blank">'+c+'</a>, (<a href="http://www.cbioportal.org/case.do?cancer_study_id=luad_tcga&case_id='+c.slice(0,12)+'" target="_blank" style="color:red">cbio</a>) random seed:'
        var sp = document.createElement('span')
        li.appendChild(sp)
        //http://www.cbioportal.org/case.do?cancer_study_id=luad_tcga&case_id=TCGA-05-4395
        var v = 0.95*Math.random()
        sp.textContent=v.toString().slice(0,5)
        sp.style.fontWeight='bold'
        var spSize = document.createElement('span')
        spSize.innerHTML=', feature sample size:<input value=1000 size=5> '
        li.appendChild(spSize)
        var btFeature = document.createElement('button')
        li.appendChild(btFeature)
        btFeature.textContent="feature scape of sampled features"
        btFeature.style.color="blue"
        var spMsg = document.createElement('span')
        spMsg.style.color='red'
        li.appendChild(spMsg)
        spSize.onkeyup=function(evt){
            var ip=$('input',this)[0]
            var v = parseInt(ip.value)
            var msg=this.parentElement.children[this.parentElement.children.length-1]
            if((v>=100)&(v<=10000)){
                ip.value=v
                msg.textContent=''
            }else{
                msg.textContent=' sample size needs to be an integer between 100 and 10000'
            }
        }
        setInterval(function(){
            var v = 0.95*Math.random()
            sp.textContent=v.toString().slice(0,5)
            sp.style.color='rgb('+Math.round(255*v)+','+Math.round(255*(1-v))+',0)'
        },(1000+Math.random()*1000))
        btFeature.onclick=function(){
            var caseId=c
            // http://129.49.249.191:3000/?limit=10&find={%22randval%22:{%22$gte%22:0.9},%22image.caseid%22:%22TCGA-12-3653-01Z-00-DX1%22}
            var sz=$('input',spSize)[0].value
            window.open('http://sbu-bmi.github.io/featurescape/?http://129.49.249.191:3000/?limit='+sz+'&find={%22randval%22:{%22$gte%22:'+sp.textContent+'},%22image.caseid%22:%22TCGA-12-3653-01Z-00-DX1%22};fun/u24demo.js')
            4
        }
    })

}



// ini
$(document).ready(function(){
    u24p()
})