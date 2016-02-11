console.log('fig4.js loaded')


window.onload=function(){
    $.getJSON('fig4/patients.json').then(function(x){
        console.log('loaded '+x.length+' reccords');
        var msg = function(txt,clr){
            if(!clr){clr="blue"}
            fig4msg.textContent='> '+txt
            fig4msg.style.color=clr
            setTimeout(function(){
                fig4msg.innerHTML='&nbsp;'
            },3000)
        }
        msg('loaded '+x.length+' reccords')


        // build table
        var h ='<table><tr><td id="fig4_1">Fig4.1</td></tr>'
        h +='<tr><td id="fig4_2">Fig4.2</td></tr>'
        h +='<tr><td id="fig4_3">Fig4.3</td></tr></table>'
        fig4div.innerHTML=h

        var C_fig4_1 = dc.barChart("#fig4_1")
        var C_fig4_2 = dc.barChart("#fig4_2")
        var C_fig4_3 = dc.barChart("#fig4_3")

    })





}