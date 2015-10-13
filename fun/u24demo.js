console.log('u24demo.js loaded')

/*  // the default script, in featurescape.js
fscape.fun=function(x,url){
	//console.log('the same old story')
    fscape.log(x.length+' entries loaded from '+url,'blue')
    fscape.cleanUI() 
}
*/

fscape.fun=function(x,url){
	console.log('the new story')
	x=x.map(function(xi){
		return xi.features
	})
    fscape.log(x.length+' entries loaded from '+url,'blue')
    fscape.cleanUI()
    // assemble table
    fscape.dt={
    	docs:x,
    	tab:{}
    }

    Object.getOwnPropertyNames(x[0]).forEach(function(p){
    	fscape.dt.tab[p]=x.map(function(xi){return xi[p]})
    })
    4


    fscape.plot()
}






