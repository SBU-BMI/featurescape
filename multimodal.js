console.log('fig4.js loaded')


window.onload=function(){
    //$.getJSON('https://tahsin175.informatics.stonybrook.edu:4500/?collection=patients&limit=100').then(function(x){
    //$.getJSON('http://129.49.249.175:3000/?collection=patients&limit=1000').then(function(x){
    $.getJSON('multimodal/patients.json').then(function(x){
    	$.getJSON('fig4/patients.json').then(function(f4){
        // create dictionaire to borrow months_followup from fig4
        var dic ={}
        f4.forEach(function(xi){
        	dic[xi.bcr_patient_barcode]=xi
        })

        console.log('loaded '+x.length+' reccords')
        // wrangle
        x = x.map(function(xi){
        	if(xi.days_to_death=='NotApplicable'){
        		xi.status=0
        	} else{
        		xi.status=1
        	}
        	xi.months_followup=xi.days_to_last_followup/30
        	if(!xi.months_followup){
        		xi.months_followup=xi.days_to_death/30
        	}
        	
        	//xi.months_followup=xi.days_to_last_followup/30
        	//xi.months_followup
        	//dic[xi.patient_id]
        	
        	return xi
        })
        4

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
        			h+='<h4 style="color:navy" id="fig4_1_PTEN">PTEN</h4>'
        			h+='<h4 style="color:navy" id="fig4_1_STK11">STK11</h4>'
        			h+='<h4 style="color:navy" id="fig4_1_TP53">TP53</h4>'
        		h +='</td>'
        		h +='<td id="fig4_2" style="vertical-align:top">'
        			h +='<h3 style="color:maroon">Morphology, Epi, etc</h3>'
        			h +='<p style="color:maroon">'
        				h +='Var 1: <select id="morphParm1"></select><br>'
        				h +='Var 2: <select id="morphParm2"></select><br>'
        				h +='Slide mouse click to select ranges<br>Xaxis: parameter value<br>Yaxis: #patients'
        			h +='</p>'
        			h +='<div id="fig4_2_1"><span style="color:blue">Var 1: </span></div>'
        			h +='<div id="fig4_2_2"><span style="color:blue">Var 1 Zoom: </span></div>'
        			h +='<div id="fig4_2_3"><span style="color:blue">Var 2: </span></div>'
        		h +='</td>'
        		h +='<td id="fig4_3" style="vertical-align:top">'
        			h +='<h3 style="color:maroon">Survival<h3>'
        			//h +='...'
        			h +='<div id="survival"></div>'
        			h +='<p style="font-size:small">Zoomable KM estimator (i.e. select ranges, each dot is a patient)</p>'
        			h +='<div id="dcSurvival"></div>'
        			h +='<div id="dcStatus"></div>'


        		h +='</td>'
        	h +='</tr></table>'
        fig4div.innerHTML=h

        // Parameterization
        //var morphParms = ["NumberOfPixels_median", "PhysicalSize_median", "NumberOfPixelsOnBorder_median", "FeretDiameter_median", "PrincipalMoments0_median", "PrincipalMoments1_median", "Elongation_median", "Perimeter_median", "Roundness_median", "EquivalentSphericalRadius_median", "EquivalentSphericalPerimeter_median", "EquivalentEllipsoidDiameter0_median", "EquivalentEllipsoidDiameter1_median", "Flatness_median", "MeanR_median", "MeanG_median", "MeanB_median", "StdR_median", "StdG_median", "StdB_median","age_at_initial_pathologic_diagno","est_days_to_remission","K17_group","Stage","Tumor","gender_code","hist_code"]
        var allParms=["_id","patient_id","days_to_last_followup","days_to_death","EGFR","KRAS","PTEN","STK11","TP53","CT_image_name","compactness","energy","run_length","run_length_of_wavelet","NumberOfPixels_25","PrincipalMoments0_25","PrincipalMoments1_25","Elongation_25","Perimeter_25","Roundness_25","EquivalentSphericalRadius_25","EquivalentSphericalPerimeter_25","EquivalentEllipsoidDiameter0_25","EquivalentEllipsoidDiameter1_25","Flatness_25","MeanR_25","MeanG_25","MeanB_25","StdR_25","StdG_25","StdB_25","NumberOfPixels_50","PrincipalMoments0_50","PrincipalMoments1_50","Elongation_50","Perimeter_50","Roundness_50","EquivalentSphericalRadius_50","EquivalentSphericalPerimeter_50","EquivalentEllipsoidDiameter0_50","EquivalentEllipsoidDiameter1_50","Flatness_50","MeanR_50","MeanG_50","MeanB_50","StdR_50","StdG_50","StdB_50","NumberOfPixels_75","PrincipalMoments0_75","PrincipalMoments1_75","Elongation_75","Perimeter_75","Roundness_75","EquivalentSphericalRadius_75","EquivalentSphericalPerimeter_75","EquivalentEllipsoidDiameter0_75","EquivalentEllipsoidDiameter1_75","Flatness_75","MeanR_75","MeanG_75","MeanB_75","StdR_75","StdG_75","StdB_75","bcr_patient_barcode","vital_status","karnofsky_performance_score","primary_therapy_outcome_success","person_neoplasm_cancer_status","days_to_birth","age_at_initial_pathologic_diagnosis","status","months_followup"]


        var morphParms = ["NumberOfPixels_50", "PhysicalSize_50", "NumberOfPixelsOnBorder_50", "FeretDiameter_50", "PrincipalMoments0_50", "PrincipalMoments1_50", "Elongation_50", "Perimeter_50", "Roundness_50", "EquivalentSphericalRadius_50", "EquivalentSphericalPerimeter_50", "EquivalentEllipsoidDiameter0_50", "EquivalentEllipsoidDiameter1_50", "Flatness_50", "MeanR_50", "MeanG_50", "MeanB_50", "StdR_50", "StdG_50", "StdB_50","age_at_initial_pathologic_diagno","est_days_to_remission","K17_group","Stage","Tumor","gender_code","hist_code"]
        morphParms.sort(function(a,b){
        	var val = (a.toUpperCase()>b.toUpperCase())
        	if(val){
        		return 1
        	}else{
        		return -1
        	}
        })
        searchParms={}
        location.search.slice(1).split('&').forEach(function(pp){
			pp=pp.split('=')
        	searchParms[pp[0]]=pp[1]
        })
        // add search parms to list if they are not there
        if(searchParms.morph1){
        	if(morphParms.indexOf(searchParms.morph1)==-1){
        		morphParms.push(searchParms.morph1)
        	}
        }
        if(searchParms.morph2){
        	if(morphParms.indexOf(searchParms.morph2)==-1){
        		morphParms.push(searchParms.morph2)
        	}
        }

        morphParms.forEach(function(p){
        	var op1 = document.createElement('option')
        	op1.value=op1.textContent=p
        	morphParm1.appendChild(op1)
        	var op2 = document.createElement('option')
        	op2.value=op2.textContent=p
        	morphParm2.appendChild(op2)
        })
        morphParm1.style.width=morphParm2.style.width=200
        // harvest search parameters if any

        if(searchParms.morph1){
        	morphParm1.value=searchParms.morph1
        }else{morphParm1.value="Roundness_50"}
        if(searchParms.morph2){
        	morphParm2.value=searchParms.morph2
        }else{morphParm2.value="StdR_50"}
        morphParm1.onchange=morphParm2.onchange=function(){
        	location.search='?morph1='+morphParm1.value+'&morph2='+morphParm2.value
        }
        4
        // Add survival information

        survivalPlot=function(){
        	trace0={
        		x:tab.months_followup,
        		y:tab.status,
        		mode:'lines'
        	}
        	// remove NaN <-- this was not needed before ...
        	var nx = [], ny=[]
        	trace0.x.forEach(function(xi,i){
        		if(!isNaN(xi)){
        			nx.push(xi)
        			ny.push(trace0.y[i])
        		}
        	})
        	trace0.x=nx;trace0.y=ny
        	// sort it <-- this was not needed before ...
        	var ind = jmat.sort(trace0.x)
        	var nx = [], ny=[]
        	ind[1].forEach(function(i){
        		nx.push(trace0.x[i])
        		ny.push(trace0.y[i])
        	})
        	trace0.x=nx;trace0.y=ny
        	
        	4



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
				title: 'Blue - whole population; Orange - selected cohort',
				showlegend: false,
				xaxis:{
					range:[0,250],
					type:"linear",
					title:"months followup"
				},
				yaxis:{
					range:[0,1],
					type:"linear",
					title:"Survival (Kaplan Meier estimator)"
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
        	//console.log('plotly',new Date)

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
				if(d[gn]===0){
					return 'no mutation'
				}else if(d[gn]===1){
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
		genePlot('PTEN')
		genePlot('STK11')
		genePlot('TP53')

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

    	morphPlot("fig4_2_1",morphParm1.value)
    	morphPlot("fig4_2_2",morphParm1.value)
    	morphPlot("fig4_2_3",morphParm2.value)

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

        // Parameterization



        4

    })
    })





}
