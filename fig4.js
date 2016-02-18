console.log('fig4.js loaded')


window.onload=function(){
    $.getJSON('fig4/patients.json').then(function(x){
    //$.getJSON('http://129.49.249.175:3000/?collection=patients&limit=1000').then(function(x){
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
        		h +='<tr><td id="fig4_1" style="vertical-align:top">'
        			h+='<h3 style="color:maroon">Gene Mutation</h3> <span style="color:maroon">Click on bars to select molecular cohorts,<br>Xaxis: # patients; Yaxis: mutation status<br>[<b style="color:blue">blue</b><b style="color:YellowGreen">-</b><b style="color:red">red</b>] color range indicates fraction of total.</span>'
        			h+='<h4 style="color:navy">EGFR</h4><div id="fig4_1_EGFR"></div>'
        			h+='<h4 style="color:navy">KRAS</h4><div id="fig4_1_KRAS"></div>'
        			h+='<h4 style="color:navy">STK11_LKB1</h4><div id="fig4_1_STK11_LKB1"></div>'
        			h+='<h4 style="color:navy">TP53</h4><div id="fig4_1_TP53"></div>'
              		h+='<h4 style="color:navy">NF1</h4><div id="fig4_1_NF1"></div>'
              		h+='<h4 style="color:navy">BRAF</h4><div id="fig4_1_BRAF"></div>'
              		h+='<h4 style="color:navy">SETD2</h4><div id="fig4_1_SETD2"></div>'
        		h +='</td>'
        		h +='<td id="fig4_2" style="vertical-align:top">'
        			h +='<h3 style="color:maroon">Morphology</h3>'
        			h +='<span style="color:maroon">Slide mouse click to select ranges<br>Xaxis: parameter value<br>Yaxis: # patients</span>'
        			h +='<div id="fig4_2_1"></div>'
        			h +='<div id="fig4_2_2"></div>'
        			h +='<div id="fig4_2_3"></div>'
        		h +='</td>'
        		h +='<td id="fig4_3" style="vertical-align:top"><h3 style="color:maroon">Survival<h3></td>'
        	h +='</tr></table>'
        fig4div.innerHTML=h

        //var C_fig4_1_EGFR = dc.rowChart("#fig4_1_EGFR")
        //var C_fig4_2 = dc.barChart("#fig4_2")
        //var C_fig4_3 = dc.barChart("#fig4_3")

        var cf=crossfilter(x)

        var gene={}

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

		genePlot('EGFR')
		genePlot('KRAS')
		genePlot('STK11_LKB1')
		genePlot('TP53')
    	genePlot('NF1')
    	genePlot('BRAF')
    	genePlot('SETD2')

    	// morphPlot

    	morph = {}

    	morphPlot=function(divId,p){
    		var div = document.getElementById(divId)
    		div.textContent=p
    		div.style.color='navy'
    		div.style.fontWeight='bold'
    		morph[p]={}
    		morph[p].R={}
    		morph[p].C=dc.barChart('#'+divId)
    		morph[p].D=cf.dimension(function(d){
    			var v = d[p]
    			if(v!==""){
    				return v
    			}else{
    				4
    			}
    		})
    		morph[p].G=morph[p].D.group().reduce(
				// reduce in
				function(p,v){
					return p+1	
				},
				// reduce out
				function(p,v){
					return p-1	
				},
				// ini
				function(p,v){
					return 0
				}
			)
			morph[p].C
				.width(300)
				.height(290)
				.x(d3.scale.linear())
				.xUnits(function(){return 30})
				.renderHorizontalGridLines(true)
				.renderVerticalGridLines(true)
				.y(d3.scale.linear())
				.elasticY(true)
				.elasticX(true)
				.dimension(morph[p].D)
				.group(morph[p].G)
			
			return morph

    	}

    	morphPlot("fig4_2_1","StdR_median")
    	morphPlot("fig4_2_2","StdG_median")
    	morphPlot("fig4_2_3","StdB_median")




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
