console.log('fig4.js loaded')


window.onload=function(){
    //$.getJSON('fig4/patients.json').then(function(x){
    $.getJSON('http://129.49.249.175:3000/?collection=patients&limit=1000').then(function(x){  
        console.log('loaded '+x.length+' reccords')
        //y=x
        var msg = function(txt,clr){
            if(!clr){clr="blue"}
            fig4msg.textContent='> '+txt
            fig4msg.style.color=clr
            setTimeout(function(){
                fig4msg.innerHTML='&nbsp;'
            },5000)
        }
        msg('loaded '+x.length+' reccords')

        //unpack data into table, tab
        tab = {}
        var parms = Object.getOwnPropertyNames(x[0])
        parms.forEach(function(p){
            tab[p]=[]
        })
        x.forEach(function(xi,i){
            parms.forEach(function(p){
                tab[p][i]=xi[p]
            })
        })
        

        4



        // build table
        var h ='<table>'
        		h +='<tr><td id="fig4_1">'
        			h+='<h3 style="color:maroon">Gene Mutation</h3>'
        			h+='<h4 style="color:navy">EGFR</h4><div id="fig4_1_EGFR"></div>'
        			h+='<h4 style="color:navy">KRAS</h4><div id="fig4_1_KRAS"></div>'
        			h+='<h4 style="color:navy">STK11_LKB1</h4><div id="fig4_1_STK11_LKB1"></div>'
        			h+='<h4 style="color:navy">TP53</h4><div id="fig4_1_TP53"></div>'
        		h +='</td></tr>'
        		h +='<tr><td id="fig4_2">Fig4.2</td></tr>'
        		h +='<tr><td id="fig4_3">Fig4.3</td></tr>'
        	h +='</table>'
        fig4div.innerHTML=h

        //var C_fig4_1_EGFR = dc.rowChart("#fig4_1_EGFR")
        //var C_fig4_2 = dc.barChart("#fig4_2")
        //var C_fig4_3 = dc.barChart("#fig4_3")

        var cf=crossfilter(x)

        gene={}
        
        genePlot=function(gn){ // gene name
        	gene[gn]={}
        	gene[gn].R={
				low:0,
				high:0,
				NA:0	
        	}
        	gene[gn].C=dc.rowChart("#fig4_1_"+gn)
        	gene[gn].D=cf.dimension(function(d){
				if(d[gn+'_mutations_code']===0){
					return 'no mutation'
				}else if(d[gn+'_mutations_code']===1){
					return 'mutation present'
				}else {
					return 'NA'
				}
			})
			gene[gn].G=gene[gn].D.group().reduce(
				// reduce in
				function(p,v){
					if(v[gn+'_mutations_code']===0){
						gene[gn].R.low+=1
						return gene[gn].R.low
					}else if(v[gn+'_mutations_code']===1){
						gene[gn].R.high+=1
						return gene[gn].R.high
					}else{
						gene[gn].R.NA+=1
						return gene[gn].R.NA
					}
				},
				// reduce out
				function(p,v){
					if(v[gn+'_mutations_code']===0){
						gene[gn].R.low-=1
						return gene[gn].R.low
					}else if(v[gn+'_mutations_code']===1){
						gene[gn].R.high-=1
						return gene[gn].R.high
					}else{
						gene[gn].R.NA-=1
						return gene[gn].R.NA
					}
				},
				//ini
				function(){return 0}
			)
			gene[gn].C
			  .width(500)
			  .height(100)
			  .margins({top: 10, right: 50, bottom: 30, left: 40})
			  .dimension(gene[gn].D)
			  .group(gene[gn].G)
			  .elasticX(true)
			  .colors(d3.scale.linear().domain([0,0.5,1]).range(["blue","yellow","red"]))
			  .colorAccessor(function(d, i){
			  	return d.value/(gene[gn].R.NA+gene[gn].R.high+gene[gn].R.low)
			  })

        	return gene
        }
 

        /*
        var R_fig4_1_EGFR = { // reduce object
        	low:0,
        	high:0,
        	NA:0
        }
        var D_fig4_1_EGFR = cf.dimension(function(d){
        	if(d.EGFR_mutations_code===0){
        		return 'Low'
        	}else if(d.EGFR_mutations_code===1){
        		return 'High'
        	}else {
        		return 'NA'
        	}
        })
        var G_fig4_1_EGFR = D_fig4_1_EGFR.group().reduce(
            // reduce in
            function(p,v){
                if(v.EGFR_mutations_code===0){
                	R_fig4_1_EGFR.low+=1
                	return R_fig4_1_EGFR.low
                }else if(v.EGFR_mutations_code===1){
                	R_fig4_1_EGFR.high+=1
                	return R_fig4_1_EGFR.high
                }else{
                	R_fig4_1_EGFR.NA+=1
                	return R_fig4_1_EGFR.NA
                }
            },
            // reduce out
            function(p,v){
                if(v.EGFR_mutations_code===0){
                	R_fig4_1_EGFR.low-=1
                	return R_fig4_1_EGFR.low
                }else if(v.EGFR_mutations_code===1){
                	R_fig4_1_EGFR.high-=1
                	return R_fig4_1_EGFR.high
                }else{
                	R_fig4_1_EGFR.NA-=1
                	return R_fig4_1_EGFR.NA
                }
            },
            //ini
            function(){return 0}
        )
        C_fig4_1_EGFR
		  .width(500)
		  .height(100)
		  .margins({top: 10, right: 50, bottom: 30, left: 40})
		  .dimension(D_fig4_1_EGFR)
		  .group(G_fig4_1_EGFR)
		*/
		genePlot('EGFR')  
		genePlot('KRAS')
		genePlot('STK11_LKB1')
		genePlot('TP53')


        // ready to render
        dc.renderAll()
        $('.dc-chart g.row text').css('fill','black');


        4

    })





}



/*

incidentChart
                .width(360)
                .height(180)
                .margins({top: 40, right: 50, bottom: 30, left: 60})
                .dimension(years)
                .group(crimeIncidentByYear, "Non-Violent Crime")
                .valueAccessor(function(d) {
                    return d.value.nonViolentCrimeAvg;
                })
                .stack(crimeIncidentByYear, "Violent Crime", function(d){return d.value.violentCrimeAvg;})
                .x(d3.scale.linear().domain([1997, 2012]))
                .renderHorizontalGridLines(true)
                .centerBar(true)
                .elasticY(true)
                .brushOn(false)
                .legend(dc.legend().x(250).y(10))
                .title(function(d){
                    return d.key
                            + "\nViolent crime per 100k population: " + Math.round(d.value.violentCrimeAvg)
                            + "\nNon-Violent crime per 100k population: " + Math.round(d.value.nonViolentCrimeAvg);
                })

*/