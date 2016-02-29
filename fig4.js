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
                fig4msg.textContent=""
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
        	x[i].i=i
            parms.forEach(function(p){
                tab[p][i]=xi[p]
            })
        })
        docs=x
        
        // build table
        var h ='<table>'
        		h +='<tr><td id="fig4_1" style="vertical-align:top">'
        			h+='<h3 style="color:maroon">Gene Mutation</h3>'
        			h +='<p style="color:maroon">Click on bars to select molecular cohorts,<br>Xaxis: # patients; Yaxis: mutation status<br>[<b style="color:blue">blue</b><b style="color:YellowGreen">-</b><b style="color:red">red</b>] color range indicates fraction of total.</p>'
        			h+='<h4 style="color:navy" id="fig4_1_EGFR">EGFR</h4>'
        			h+='<h4 style="color:navy" id="fig4_1_KRAS">KRAS</h4>'
        			h+='<h4 style="color:navy" id="fig4_1_STK11_LKB1">STK11_LKB1</h4>'
        			h+='<h4 style="color:navy" id="fig4_1_TP53">TP53</h4>'
              		h+='<h4 style="color:navy" id="fig4_1_NF1">NF1</h4>'
              		h+='<h4 style="color:navy" id="fig4_1_BRAF">BRAF</h4>'
              		h+='<h4 style="color:navy" id="fig4_1_SETD2">SETD2</h4>'
        		h +='</td>'
        		h +='<td id="fig4_2" style="vertical-align:top">'
        			h +='<h3 style="color:maroon">Morphology</h3>'
        			h +='<p style="color:maroon">Slide mouse click to select ranges<br>Xaxis: parameter value<br>Yaxis: #patients</p>'
        			h +='<div id="fig4_2_1"><span style="color:blue">Var 1: </span></div>'
        			h +='<div id="fig4_2_2"><span style="color:blue">Var 1 Zoom: </span></div>'
        			h +='<div id="fig4_2_3"><span style="color:blue">Var 2: </span></div>'
        		h +='</td>'
        		h +='<td id="fig4_3" style="vertical-align:top">'
        			h +='<h3 style="color:maroon">Survival<h3>'
        			//h +='...'
        			h +='<div id="survival"></div>'
        			h +='<div id="dcSurvival"></div>'
        			h +='<div id="dcStatus"></div>'
        			
        			
        		h +='</td>'
        	h +='</tr></table>'
        fig4div.innerHTML=h

        // Add survival information

        survivalPlot=function(){
        	trace0={
        		x:tab.months_followup,
        		y:tab.status,
        		mode:'lines'
        	}
        	// convert status into survival
        	var x=[], y=[], ind=[]
        	trace0.x.forEach(function(v,i){
        		var xi=trace0.x[i]
        		var yi=trace0.y[i]
        		if((typeof(xi)=='number')&&(typeof(yi)=='number')){
        			x.push(xi)
        			y.push(yi)
        			ind.push(i)
        		}
        	})
        	var jj = jmat.sort(x)[1]
        	surv0={ // calculating survival here
        		tt:[],
        		status:[], // survival, we'll have to calculate it
        		ind:[]
        	}
        	jj.map(function(j,i){
        		surv0.tt[i]=x[j]
        		surv0.status[i]=y[j] // note this is the former y value (status)
        		surv0.ind[i]=ind[j]
        	})
        	// calculating survival for unique times
        	survCalc = function(x){ // x is the status, ordered chronologically
        		var y = [x[0]]
        		var n = x.length
        		var s = [1]
        		for(var i = 1; i<n; i++){
        			y[i]=y[i-1]+x[i]
        			s[i]=s[i-1]*(1-x[i]/(n-i))	
        		}
        		return s
        	}
        	surv0.yy=survCalc(surv0.status)
        	trace0.x=surv0.tt
        	trace0.y=surv0.yy

        	surv0.yy.forEach(function(yi,i){
        		docs[surv0.ind[i]].KM=yi // recording Kaplan Meier in the original docs
        	})

        	// now only for the selected patients
        	
        	if(typeof(dcSurv)!="undefined"){
        		trace1 = (function(){
        			//console.log(9)
        			var xy = dcStatus.G.all().filter(function(xyi){return xyi.value})
        			var x = [], y = []
        			xy.map(function(xyi,i){
        				x[i]=xyi.key[0]
        				y[i]=xyi.key[1]
        			})
        			var ind=jmat.sort(x)[1]
        			x=[];y=[]
        			ind.forEach(function(i,j){
        				if(xy[i].key[0]!==""){
        					x.push(xy[i].key[0])
        					y.push(xy[i].key[1])
        				}
        			})

        			var n = x.length
					var s = [1]
					for(var i = 1; i<n; i++){
						s[i]=s[i-1]*(1-y[i]/(n-i))
					}

					return {
						x:x,
						y:s
					}
        		})()
        	}
        	

        	var layout = {
				//title: 'Warning - KM estimator under validation',
				showlegend: false,
				xaxis:{
					range:[0,250],
					type:"linear",
					title:"months followup"
				},
				yaxis:{
					range:[0,1],
					type:"linear",
					title:"Survival (KM estimator)"
				}
			};

			survival.style.width='600px'
			survival.style.height='500px'

			if(typeof(trace1)!=='undefined'){
				data = [trace0,trace1]
			}else{
				data = [trace0]
			}

			
        	Plotly.newPlot('survival', data, layout)
        	console.log('plotly',new Date)

        }
        survivalPlot()
        x=docs

        // time for cross filter
        var onFiltered=function(parm){
        	//console.log(parm,new Date,gene)
        	survivalPlot(parm)
        }

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
			  .on('filtered',function(){onFiltered(gn)})
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
    		div.innerHTML+=p+'<br>'
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
    		morph[p].G=morph[p].D.group()/*.reduce(
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
			)*/
			var xx = tab[p].filter(function(v){return typeof(v)=='number'})
			var Xmin = xx.reduce(function(a,b){return Math.min(a,b)})
			var Xmax = xx.reduce(function(a,b){return Math.max(a,b)})
			var Xn = xx.length
			morph[p].C
				.width(300)
				.height(280)
				//.x(d3.scale.linear())
				//.xUnitCount(function(){return 10})
				.xUnits(function(){return 50})
				.renderHorizontalGridLines(true)
				.renderVerticalGridLines(true)
				//.y(d3.scale.log().domain([1,100]).range([0,280]))
				.x(d3.scale.linear().domain([Xmin,Xmax]).range([0,300]))
				.y(d3.scale.linear())
				//.y(d3.scale.log().domain([1,100]).range([1,100]))
				.elasticY(true)
				//.elasticX(true)
				.dimension(morph[p].D)
				.group(morph[p].G)
				.on('filtered',function(){onFiltered(p)})
				
			
			return morph

    	}

    	morphPlot("fig4_2_1","Roundness_median")
    	morphPlot("fig4_2_2","Roundness_median")
    	morphPlot("fig4_2_3","StdR_median")
    	
    	// DC Survival

    	

    	dcSurv={
    		R:[]
    	}
    	dcSurv.C=dc.scatterPlot('#'+'dcSurvival')
    	dcSurv.D=cf.dimension(function(d){
    		return [d.months_followup,d.KM]
    	})
    	dcSurv.G=dcSurv.D.group()
    	dcSurv.C
    	 .width(500)
		 .height(300)
		 .x(d3.scale.linear().domain([0,250])) //.domain([0, 20])
		 .y(d3.scale.linear().domain([0,1]))
		 //.yAxisLabel("Survial (KM estimator)")
		 //.xAxisLabel("months followup")
		 //.symbolSize(8)
		 //.clipPadding(10)
		 .dimension(dcSurv.D)
		 .group(dcSurv.G);


		dcStatus={
    		R:[]
    	}
    	dcStatus.C=dc.scatterPlot('#'+'dcStatus')
    	dcStatus.D=cf.dimension(function(d){
    		return [d.months_followup,d.status]
    	})
    	dcStatus.G=dcStatus.D.group()
    	dcStatus.C
    	 .width(500)
		 .height(100)
		 .x(d3.scale.linear().domain([0,250])) //.domain([0, 20])
		 .y(d3.scale.linear().domain([-1,2]))
		 //.yAxisLabel("Survial (KM estimator)")
		 //.xAxisLabel("months followup")
		 //.symbolSize(8)
		 //.clipPadding(10)
		 .dimension(dcStatus.D)
		 .group(dcStatus.G);


        // ready to render
        dc.renderAll()
        $('.dc-chart g.row text').css('fill','black');

        


        4

    })





}


