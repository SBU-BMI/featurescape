console.log('u24demo.js loaded')

/*  // the default script, in featurescape.js
fscape.fun=function(x,url){
	//console.log('the same old story')
    fscape.log(x.length+' entries loaded from '+url,'blue')
    fscape.cleanUI() 
}
*/

fscape.fun=function(x,url){
	//console.log('the new story')
	x=x.map(function(xi){
		return xi.features
	})
	var atrs={} // get them all first
	x.forEach(function(xi){
		Object.getOwnPropertyNames(xi).forEach(function(p){
			atrs[p]=true
		})
	})
	// flag those that fail to exist even if only once
	x.forEach(function(xix){
		Object.getOwnPropertyNames(atrs).forEach(function(p,i){
			if((!xix[p])){
				atrs[p]=false
			}
		})
	})
	var xx=x.map(function(xxi){
		var xii={}
		Object.getOwnPropertyNames(xxi).forEach(function(p){
			if(atrs[p]){xii[p]=xxi[p]}
		})
		return xii
	})
	//lala=x
    fscape.log(xx.length+' entries sampled from '+url,'blue')
    fscape.cleanUI()
    // assemble table
    /*
    fscape.dt={
    	docs:x,
    	tab:{}
    }

    Object.getOwnPropertyNames(x[0]).forEach(function(p){
    	fscape.dt.tab[p]=x.map(function(xi){return xi[p]})
    })
    4
    */


    fscape.plot(xx)
}






