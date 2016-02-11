console.log('fig4.js loaded')


window.onload=function(){ // to avoid poluting the DOM
    var h ='<table><tr><td id="fig4.1">Fig1.1</td></tr>'
    h +='<tr><td id="fig4_1">Fig4.2</td></tr>'
    h +='<tr><td id="fig4_1">Fig4.3</td></tr></table>'
    fig4div.innerHTML=h
}