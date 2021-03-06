console.log('featurescape.js loaded');
// http://localhost:8000/featurescape/?https://fscape-132294.nitrousapp.com/?limit=1000;fun/u24demo.js

fscape = function (x) {
    // being used to ini UI
    if ((!x) && (document.getElementById("featureScapeDiv"))) {
        fscape.UI()
    } else if (x) { //creating an fscape grid instance
        return new fscape.grid(x)
    } else {
        console.log('no fscape UI')
    }
};

fscape.UI = function () {
    console.log('assembling UI ...');
    var div = document.getElementById("featureScapeDiv");
    fscape.div = div;
    // load data
    $('<div id="loadDataDiv"></div>').appendTo(div);
    $('<div id="showLoadDataDiv"><a id="showLoadDataDivClick" href="javascript:void(0)" onclick="$(loadDataDiv).show(400);$(showLoadDataDiv).hide()">+ Load Data</a></div>').appendTo(div);
    $(showLoadDataDiv).hide();
    $('<h4>Load Data</h4>').appendTo(loadDataDiv);
    $('<div>URL: <input id="inputURL" style="width:50%"></div>').appendTo(loadDataDiv);
    inputURL.onkeyup = function (evt) {
        if (evt.keyCode == 13) {
            fscape.loadURL(inputURL.value)
        }
    };
    $('<div><input type="file" id="localFile" value="Local File"></div>').appendTo(loadDataDiv);
    $('<div id="dropBox-select"></div>').appendTo(loadDataDiv);
    $('<div id="loadingDropbox" style="color:red"> loading DropBox.com ... </div>').appendTo(loadDataDiv);
    $('<div id="box-select" data-link-type="direct" data-multiselect="YOUR_MULTISELECT" data-client-id="cowmrbwt1f8v3c9n2ucsc951wmhxasrb"></div>').appendTo(loadDataDiv);
    $('<div id="loadingBox" style="color:red"> loading Box.com ... </div>').appendTo(loadDataDiv);
    $('<div id="loadingDrive" style="color:navy;font-size:x-small"> we could also be using GoogleDrive, Microsoft OneDrive, Amazon S3, ... </div>').appendTo(loadDataDiv);

    // check for data URL
    if (location.search.length > 1) {
        featureScapeLog.textContent = 'loading, please wait ...';
        featureScapeLog.style.color = 'red';
        var ss = location.search.slice(1).split(';');
        inputURL.value = ss[0];
        if (ss[1]) {
            var sr = document.createElement('script');
            sr.src = ss[1];
            sr.onload = function () {
                fscape.loadURL()
            };
            document.head.appendChild(sr);
            //$.getScript(ss[1]).then(function(){
            //    fscape.loadURL()
            //})
        } else {
            fscape.loadURL()
        }

    }
    // load file
    localFile.onchange = function () {
        var f = this.files[0];
        var reader = new FileReader();
        reader.onload = function (x) {
            fscape.loadFile(x.target.result, f.name)
        };
        reader.readAsText(f)
    };
    // load Box.com
    $.getScript("https://app.box.com/js/static/select.js").then(function () {
        $(document).ready(function () {
            var boxSelect = new BoxSelect();
            $('#loadingBox').remove();
            // Register a success callback handler
            boxSelect.success(function (response) {
                //console.log(response);
                fscape.loadBox(response)
            });
            // Register a cancel callback handler
            boxSelect.cancel(function () {
                console.log("The user clicked cancel or closed the popup");
            });
        });
    });

    // load DropBox

    var s = document.createElement('script');
    s.src = "https://www.dropbox.com/static/api/2/dropins.js";
    s.id = "dropboxjs";
    s.type = "text/javascript";
    s.setAttribute("data-app-key", "9vv5y78aguqu4pl");
    s.onload = function () {
        console.log('loaded dropbox file picker');
        var button = Dropbox.createChooseButton(options);
        document.getElementById("dropBox-select").appendChild(button);
        $('#loadingDropbox').remove()
    };
    document.body.appendChild(s);

    options = {
        success: function (files) {
            //console.log("Files", files)
            var url = files[0].link;
            fscape.loadDropbox(url)
        },
        cancel: function () {
        },
        linkType: "direct",
        multiselect: false
        //extensions: ['.json', '.txt', '.csv'],
    };

    // load Google Drive

    $.getScript('https://apis.google.com/js/api.js?onload=onApiLoad').then(function () {
        console.log('gapi loaded')
    })
};

fscape.loadBox = function (x) {
    console.log('loading data from Box.com ...');
    var url = x[0].url;
    $.getJSON(url).then(function (x) {
        fscape.fun(x, url);
        //fscape.fun(x,url)
    })

};
fscape.loadDropbox = function (url) {
    console.log('loading data from Dropbox.com ...');
    fscape.loadURL(url)
};
fscape.loadFile = function (x, fname) {
    console.log('loading data from localFile ...');
    fscape.fun(JSON.parse(x), fname)
};

fscape.loadURL = function (url) {
    // get URL from input
    if (!url) {
        url = inputURL.value
    }
    localforage.getItem(url)
        .then(function (x) {
            if (!x) {
                $.getJSON(url).then(function (x) {
                    if (!fscape.dt) {
                        fscape.fun(x, url);
                        localforage.setItem(url, x)
                    }
                })
            } else {
                fscape.fun(x, url)
            }

        })
        .catch(function () {
            $.getJSON(url).then(function (x) {
                if (!fscape.dt) {
                    fscape.fun(x, url);
                    localforage.setItem(url, x)
                }
            })
        })
};

fscape.log = function (txt, color) {
    featureScapeLog.innerHTML = txt;
    if (!color) {
        color = 'navy'
    }
    featureScapeLog.style.color = color;
    console.log(txt)
};

fscape.cleanUI = function () { // and create fscapeAnalysisDiv
    $(loadDataDiv).hide(400);
    $(showLoadDataDiv).show();
    // let's have some function
    if (!document.getElementById('fscapeAnalysisDiv')) {
        $('<hr><div id="fscapeAnalysisDiv"><span style="color:red">processing, please wait ...</span></div>').appendTo(fscape.div);
        fscapeAnalysisDiv.hidden = true;
        $(fscapeAnalysisDiv).show(1000)
    } else {
        fscapeAnalysisDiv.innerHTML = '<span style="color:red">processing, please wait ...</span>'
    }
};

fscape.fun = function (x, url) {
    fscape.log(x.length + ' entries sampled from ' + url, 'blue');
    fscape.cleanUI();
    // make sure only numeric parameters go forward
    var alwaysNum = {};
    Object.getOwnPropertyNames(x[0]).forEach(function (p) {
        if (typeof(parseFloat(x[0][p]) == 'number')) {
            alwaysNum[p] = true
        }
    });
    var pp = Object.getOwnPropertyNames(alwaysNum);
    pp.forEach(function (p) {
        x.forEach(function (xi, i) {
            if (alwaysNum[p]) {
                alwaysNum[p] = (!isNaN(parseFloat(xi[p])))
            }
        })
    });
    // remove non-numeric parameters
    var ppn = [], ppnan = [];
    pp.forEach(function (p) {
        if (alwaysNum[p]) {
            ppn.push(p)
        }
        else {
            ppnan.push(p)
        }
    });
    var y = [], z = [];
    x.forEach(function (xi, i) {
        y[i] = {};
        z[i] = {};
        ppn.forEach(function (p) {
            y[i][p] = parseFloat(xi[p])
        });
        ppnan.forEach(function (p) {
            z[i][p] = xi[p]
        })
    });
    fscape.plot(y, z)
};

fscape.clust2html = function (cl) {
    var ind = cl[0];
    var T = cl[1];
    var cmap = jmat.colormap().map(function (ci) {
        return ci.map(function (cij) {
            return Math.round(cij * 255)
        })
    });
    var h = '<h4 style="color:maroon">Cross-tabulated feature correlations</h4>'
    h +='<table id="featurecrossTB">';
    //header
    h += '<thead>'
        h +='<tr style="height:100px;vertical-align:bottom">'
            h +='<td style="color:navy">Variable</td>'
            ind.forEach(function(i,j){
                h +='<td><span><div class="textColVertical" style="width:12px;transform:rotate(-90deg);font-size:12px">'+fscape.dt.parmNum[i]+'</div></span></td>'
                4
            })
        h +='</tr>'
    h += '</thead>'
    //class="textColVertical"
    //style = document.createElement("style");
    //style.appendChild(document.createTextNode("")) // WebKit hack :(
    //document.head.appendChild(style);
    //style.insertRule("textColVertical {color:red}", 1);
    // body
    h += '<tbody>'
    ind.forEach(function (i, j) {
        h += '<tr><td>' + fscape.dt.parmNum[i] + '</td>';
        T.forEach(function (c, k) {
            var x = Math.pow(c[j], 2); // E[0,1]
            if (isNaN(x)) {
                x = 1
            }
            var v = Math.round((1 - x) * 50);
            v = Math.min(v, 50);
            v = Math.max(v, 0);
            var cm = 'rgb(' + cmap[v].toString() + ')';
            h += '<td id="' + i + ',' + ind[k] + '" style="color:' + cm + ';font-size:' + (14 - 4 * c[j]) + ';background-color:'+cm+'">O</td>';
            //h+='<td style="color:rgb(255,">X</td>'
        });
        h += '</tr>'
    });
    h += '</tbody>'
    h += '</table><p id="featuremoreTD" style="color:blue">(click on symbols for densities)</p>&nbsp;<div id="featureNet">Similar neighbor network</div><div id="featureNetSlider"></div>';
    return h
};

// do it

fscape.plot = function (x) { // when ready to do it
    fscapeAnalysisDiv.innerHTML = '<table id="fscapeAnalysisTab"><tr><td id="featurecrossTD" style="vertical-align:top">featurecross</td><td id="featuremapTD" style="vertical-align:top">featuremap</td></tr><tr><td id="featureElseTD" style="vertical-align:top"></td><td id="featurecompTD" style="vertical-align:top"></td></tr></table><div id="featurecomputeDIV"></div>';
    //fscapeAnalysisDiv
    if (x) { // otherwise expect the data already packed in fscape.dt
        fscape.dt = {
            docs: x,
            tab: {}
        };
        Object.getOwnPropertyNames(x[0]).forEach(function (p) {
            fscape.dt.tab[p] = x.map(function (xi) {
                return xi[p]
            })
        })
    }

    // featurecrossTD

    // lsit parameters
    var parmsAll = Object.getOwnPropertyNames(fscape.dt.tab);
    // numeric paramters
    var parmNum = Object.getOwnPropertyNames(fscape.dt.tab).filter(function (p) {
        return typeof(fscape.dt.docs[0][p]) == "number"
    });
    // string parameters
    var parmStr = Object.getOwnPropertyNames(fscape.dt.tab).filter(function (p) {
        return typeof(fscape.dt.docs[0][p]) == "string"
    });

    // cluster numeric paramters

    var xx = parmNum.map(function (p) {
        return fscape.dt.tab[p]
    });

    // make sure they're all numbers
    ij2remove = [];
    xx.forEach(function (xi, i) {
        xi.forEach(function (xij, j) {
            if (typeof(xij) != 'number') {
                console.log('non-numeric value at (' + i + ',' + j + '), ' + xij); //+' - the whole row will be removed:',xi)
                ij2remove.push(j);
            }
            
        })
    });
    ij2remove = jmat.unique(ij2remove).sort().reverse();
    ij2remove.forEach(function (i) {
        xx = xx.map(function (xi) {
            xi.splice(i, 1);
            return xi; // remove row i
        })
    });

    var cc = jmat.arrayfun(jmat.crosstab(xx), function (cij) {
        return 1 - Math.abs(cij)
    });
    cc.forEach(function (ci, i) {
        ci[i] = 0; // diagonal by defenition
    });
    var cl = jmat.cluster(cc);  // remember this has three output arguments
    fscape.dt.cl = cl; // this may be better kept as a structure
    fscape.dt.parmNum = parmNum;
    featurecrossTD.innerHTML = fscape.clust2html(cl);
    // styling column names
    //$('.textColVertical').css('transform','rotate(-90deg)')
    //$('.textColVertical').css('transform-origin','left bottom 0')
    //$('.textColVertical').css('font-size','12px')

    // featuremapTD
    featuremapTD.innerHTML = 'processing ...';
    setTimeout(function () {
        var tdfun = function () {
            var ij = JSON.parse('[' + this.id + ']');
            if (ij.length > 0) {
                var i = ij[1], j = ij[0];
                var fi = fscape.dt.parmNum[i];
                var fj = fscape.dt.parmNum[j];
                if ($('#featuremapTD > table').length == 0) {
                    featuremapTD.innerHTML = 'zooming into <br><li style="color:blue">' + fi + '</li><li style="color:blue">' + fj + '</li><span style="color:red">processing ...</red>'
                }
                // place an X on selected td, after clearing it all to "O"
                for (var tri = 0; tri < this.parentElement.parentElement.children.length; tri++) {
                    for (var tdj = 1; tdj < this.parentElement.parentElement.children[tri].children.length; tdj++) {
                        var txtC = this.parentElement.parentElement.children[tri].children[tdj];
                        if (txtC.textContent.length == 1) {
                            txtC.textContent = 'O'
                            txtC.style.border=''
                            txtC.align="center"
                            txtC.style.color=txtC.style.backgroundColor
                        }
                    }
                }
                this.style.color = 'rgb('+this.style.backgroundColor.match(/[0123456789]+/g).map(function(x){return 255-parseInt(x)}).join(',')+')'
                this.textContent = "X";
                this.style.border='solid'
                setTimeout(function () {
                    fscape.scatterPlot("featuremapTD", i, j);
                    //fscape.featuremap(i,j) // not a mistake, the axis need to be switched to fulfll right hand rule
                }, 0)
            }
        };
        var tdover = function (cut) {
            var ij = JSON.parse('[' + this.id + ']');
            if (ij.length > 0) {
                var i = ij[1], j = ij[0];
                var ind = fscape.dt.cl[0];
                var ii = ind.indexOf(i), jj = ind.indexOf(j);
                var fi = fscape.dt.parmNum[i];
                var fj = fscape.dt.parmNum[j];
                var cBack = JSON.parse('[' + this.style.color.slice(4, -1).split(', ') + ']').map(function (c) {
                    return 255 - c
                }).toString();
                //featuremoreTD.innerHTML='<hr><p style="background-color:'+this.style.color+';color:rgb('+cBack+')">Pearson correlation between <br>'+fi+' <br>'+fj+'<br> = '+Math.round((1-fscape.dt.cl[1][j][i])*100)/100+'</p>'
                featuremoreTD.innerHTML = '<hr><p style="background-color:' + this.style.color + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p style="color:navy">Pearson correlation between <li style="color:navy">' + fi + ' </li><li style="color:navy">' + fj + '</li> |corr(' + ii + ',' + jj + ')|= ' + jmat.toPrecision(1 - fscape.dt.cl[1][ii][jj]) + '</p><p style="background-color:' + this.style.color + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>';
                $(this).tooltip()[0].title = '< ' + fi + ' , ' + fj + ' >';
                this.parentElement.children[0].style.backgroundColor="yellow"
                this.parentElement.parentElement.parentElement.tHead.children[0].children[ii+1].style.backgroundColor="yellow"
            }
        };
        var tdleave = function(){
            this.parentElement.children[0].style.backgroundColor=""
            var jj = parseInt(this.id.split(',')[1])
            var ind=fscape.dt.cl[0]
            var j = ind.indexOf(jj)
            this.parentElement.parentElement.parentElement.tHead.children[0].children[j+1].style.backgroundColor=""
        }

        $('td', featurecrossTB).click(tdfun);
        $('td', featurecrossTB).mouseover(tdover);
        $('td', featurecrossTB).mouseleave(tdleave);
        //featuremapTD.innerHTML='<span style="color:blue">(click on symbols for densities)</span>'
        featuremoreTD.innerHTML = '<span style="color:blue"></span>';
        featuremoreTD.style.width=featurecrossTB.offsetWidth
        featuremapTD.innerHTML = '<span style="color:blue">(click on symbols for densities)</span>';
        setTimeout(function () {
            //featureNet.innerHTML='featureNet :-)'
            var doNet = function (cut) {
                //var sz = Math.round(window.innerWidth);
                //var width = 960, height = 500;
                //var width = sz*0.6, height = sz*0.5;
                var width = featurecrossTB.offsetWidth, height= featurecrossTB.offsetWidth*0.5
                height=Math.max(height,500);
                var color = d3.scale.category20();
                var force = d3.layout.force()
                    .charge(-120)
                    .linkDistance(30)
                    .size([width, height]);
                featureNet.innerHTML = '';
                var svg = d3.select(featureNet).append("svg")
                    .attr("width", width)
                    .attr("height", height);
                // assemble network JSON
                var graph = {
                    nodes: [],
                    links: []
                };
                // node
                fscape.dt.parmNum.forEach(function (p) {
                    graph.nodes.push({
                        //name:p,
                        group: 1
                    })
                });

                // links
                graph.links = [];
                // {"source":1,"target":0,"value":1},
                var ij = 0;
                fscape.dt.cl[1].forEach(function (dd, i) {
                    dd.forEach(function (d, j) {
                        ij++;
                        //var cut = 0.75
                        if ((d < cut) & (i < j)) {
                            graph.links.push({
                                source: i,
                                target: j,
                                value: cut - d
                            })
                        }
                    })
                });


                force
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .start();

                var link = svg.selectAll(".link")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function (d) {
                        return 10 * d.value / cut;
                    });

                var gnodes = svg.selectAll('g.gnode')
                    .data(graph.nodes)
                    .enter()
                    .append('g')
                    .classed('gnode', true);

                // Add one circle in each group
                var node = gnodes.append("circle")
                    .attr("class", "node")
                    .attr("r", function (d) {
                        //return d.r
                        return 5
                    })
                    .style("fill", function (d) {
                        return color(d.group);
                    })
                    .call(force.drag);

                // index labels
                if (!fscape.dt.L) {
                    fscape.dt.L = [];
                    fscape.dt.cl[0].forEach(function (ind, i) {
                        fscape.dt.L[i] = fscape.dt.parmNum[ind]
                    })
                }

                // Append the labels to each group
                var labels = gnodes.append("text")
                    .attr("dx", ".55em")
                    //.attr("dy", ".35em")
                    .text(function (d) {
                        return fscape.dt.L[d.index]
                    });


                force.on("tick", function () {
                    // Update the links
                    link.attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });
                    // Translate the groups
                    gnodes.attr("transform", function (d) {
                        return 'translate(' + [d.x, d.y] + ')';
                    });

                });

                jQuery('.node').css('stroke', 'navy');
                jQuery('.node').css('stroke-width', '1.5px');
                jQuery('.link').css('stroke', '#999');
                jQuery('.link').css('stroke', '.6')
            };
            // threshold slider

            /*
            d3.select('#featureNetSlider').call(
                d3.slider()
                    .scale(
                        (d3.scale.linear()
                        .domain([0, 1]))
                    )
                    .axis(
                        d3.svg.axis()
                            .orient("top")
                            .ticks(10)
                    )
                    .value(0.5)
                    .on("slide", function (evt, value) {
                        //console.log(value)
                        doNet(1 - value)
                    })
            );
            doNet(1 - 0.5);
            */
            d3.select('#featureNetSlider')
             .call(
                d3.slider()
                 .axis(true)
                 .min(0)
                 .max(1)
                 .step(0.01)
                 .value(0.5)
                 .on("slide", function (evt, value) {
                    //console.log(value)
                    doNet(1 - value)
                 })
            ).style('width',featurecrossTB.offsetWidth+'px')
            doNet(0.5)

        }, 1000)

    }, 0)
};

// fscape.featuremap

fscape.featuremap = function (i, j) {
    // cross filter from hereon
    //cf = crossfilter(fscape.dt.docs)
    var ind = fscape.dt.cl[0];
    var ii = ind.indexOf(i), jj = ind.indexOf(j);
    var fi = fscape.dt.parmNum[i];
    var fj = fscape.dt.parmNum[j];
    if (!fscape.dt.dtmemb) { // if the data was not normalized already
        fscape.dt.dtmemb = {}; // distributions
        fscape.dt.parmNum.forEach(function (p) {
            fscape.dt.dtmemb[p] = jmat.memb(fscape.dt.tab[p])
        })
    }
    if (!fscape.dt.tabmemb) {
        fscape.dt.tabmemb = {}
    }
    if (!fscape.dt.tabmemb[fi]) {
        fscape.dt.tabmemb[fi] = jmat.memb(fscape.dt.tab[fi], fscape.dt.dtmemb[fi])
    }
    if (!fscape.dt.tabmemb[fj]) {
        fscape.dt.tabmemb[fj] = jmat.memb(fscape.dt.tab[fj], fscape.dt.dtmemb[fj])
    }
    //
    if ($('#featuremapTD > table').length == 0) { // assemblemap
        fscape.dt.n = 20//fscape.dt.docs.length/100  // for a n x n table
        var h = '<div id="2DscatterPlot" style="color:red">processing 2D plot ...</div>';
        h += '<table id="quantileMap" style="visibility:hidden">'; // notice it starts hidden
        h += '<tr><td id="legendFj">fj</td><td></td></tr>';
        h += '<tr><td id="featuremapTableTD"></td><td id="legendFi">fi</td></tr>';
        //h+='<tr><td id="legendFj">fj</td><td></td><td id="featuremapTableTD"></td><td id="legendFi">fi</td></tr>'
        h += '</table><div id="featuremapMoreDiv"><div>';
        featuremapTD.innerHTML = h;
        // 2d scatter plot
        fscape.scatterPlot(document.getElementById("2DscatterPlot"), i, j);

        // featuremapTableTD
        var hh = '<table id="featureheatmapTable">';
        var tii = jmat.range(0, fscape.dt.n - 1);
        var tjj = jmat.range(0, fscape.dt.n - 1);
        tii.forEach(function (ti) {
            hh += '<tr>';
            tjj.forEach(function (tj) {
                hh += '<td id="fm_' + (fscape.dt.n - ti - 1) + '_' + (tj) + '">&nbsp;&nbsp;&nbsp;</td>'
            });
            hh += '</tr>'
        });
        hh += '</table>';
        featuremapTableTD.innerHTML = hh;
        var mapTDover = function () {
            featuremapMoreDiv.innerHTML = this.id;
            var qij = JSON.parse('[' + this.id.slice(3).replace('_', ',') + ']').map(function (q) {
                return q / fscape.dt.n
            });
            var vi = jmat.interp1(fscape.dt.dtmemb[fi][1], fscape.dt.dtmemb[fi][0], [qij[0], qij[0] + 1 / fscape.dt.n]);
            var vj = jmat.interp1(fscape.dt.dtmemb[fj][1], fscape.dt.dtmemb[fj][0], [qij[1], qij[1] + 1 / fscape.dt.n]);
            var c = this.style.backgroundColor;
            var h = '<hr><p style="background-color:' + c + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            h += '<li>' + fj + ' = [' + jmat.toPrecision(vj) + ']</li>';
            h += 'Quantile = [' + jmat.toPrecision([qij[1], qij[1] + 1 / fscape.dt.n]) + ']';
            h += '<li>' + fi + ' = [' + jmat.toPrecision(vi) + ']</li>';
            h += 'Quantile = [' + jmat.toPrecision([qij[0], qij[0] + 1 / fscape.dt.n]) + ']';
            h += '<p style="color:blue">distribution density: ' + jmat.toPrecision(this.d) + '</p>';
            h += '<p style="background-color:' + c + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            featuremapMoreDiv.innerHTML = h
        };
        $('#featureheatmapTable >>> td').mouseover(mapTDover);
        legendFi.style.transform = "rotate(-90deg)";
        quantileMap.style.visibility = "visible";
        //legendFi.style.transformOrigin="center 100px"
        //<table id="featuremapTable">'
    } else {
        fscape.scatterPlot(document.getElementById("2DscatterPlot"), i, j)
    }
    // legends
    legendFi.textContent = fi;
    legendFj.textContent = fj;
    // calculate densities
    var M = jmat.zeros(fscape.dt.n, fscape.dt.n);
    var N = fscape.dt.n - 1 / fscape.dt.tab[fi].length; // to shave the ceiling
    //var tii=jmat.range(0,fscape.dt.n-1)
    //var tjj=jmat.range(0,fscape.dt.n-1)
    var s = fscape.dt.n / (fscape.dt.tabmemb[fi].length); // step increase
    jmat.transpose([fscape.dt.tabmemb[fi], fscape.dt.tabmemb[fj]]).forEach(function (xij) {
        M[Math.floor(xij[0] * N)][Math.floor(xij[1] * N)] += s
    });
    // prepare the colormap
    var cmap = jmat.colormap().map(function (ci) {
        return ci.map(function (cij) {
            return Math.round(cij * 255)
        })
    });
    var ij = jmat.range(0, fscape.dt.n - 1);
    ij.forEach(function (ti) {
        ij.forEach(function (tj) {
            var td = document.getElementById('fm_' + ti + '_' + tj);
            var d = M[ti][tj]; // density
            td.d = d;
            var v = Math.round(63 * d);
            v = Math.min(63, v);
            var c = 'rgb(' + cmap[v].toString() + ')';
            //td.textContent=Math.round(M[ti][tj]*100)
            td.style.backgroundColor = c
        })
    });

    // mouse over anywhere in the map refocuses correlation info
    featureheatmapTable.onmouseover = function () {
        var c = featurecrossTB.tBodies[0].children[ii].children[jj + 1].style.color;
        var cBack = JSON.parse('[' + this.style.color.slice(4, -1).split(', ') + ']').map(function (c) {
            return 255 - c
        }).toString();
        featuremoreTD.innerHTML = '<hr><p style="background-color:' + c + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p style="color:navy">Pearson correlation between <li style="color:navy">' + fi + ' </li><li style="color:navy">' + fj + '</li> corr(' + ii + ',' + jj + ')= ' + Math.round((1 - fscape.dt.cl[1][ii][jj]) * 1000) / 1000 + '</p><p style="background-color:' + c + ';font-size:3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'
        
    };


    4
};

fscape.scatterPlot = function (div0, i, j) {
    // feature names
    if (typeof(div0) == 'string') {
        div0 = document.getElementById(div0)
    }
    div0.innerHTML = '';
    var div = document.createElement('div');
    //div.id="lala"
    div0.appendChild(div);
    var fi = fscape.dt.parmNum[i];
    var fj = fscape.dt.parmNum[j];
    var x = fscape.dt.tab[fi];
    var y = fscape.dt.tab[fj];
    div.style.width = '600px';
    div.style.height = '500px';
    var trace0 = {
        mode: 'markers',
        type: 'scatter',
        symbol: 'cross-thin',
        marker: {
            size: 3
        },
        x: x,
        y: y
    };
    var layout = {
        //title: 'Quarter 1 Growth',
        xaxis: {
            title: fi,
            showline: false,
            showgrid: true
        },
        yaxis: {
            title: fj,
            showline: false,
            showgrid: true
        }
    };
    fscape.plt = Plotly.newPlot(div, [trace0], layout);
    window.scrollTo(window.innerWidth, window.scrollY);

    //console.log(fscape.plt._result._fullLayout.xaxis._tmin, fscape.plt._result._fullLayout.xaxis._tmax, fscape.plt._result._fullLayout.yaxis._tmin, fscape.plt._result._fullLayout.yaxis._tmax);
    console.log(div._fullLayout.xaxis._tmin, div._fullLayout.xaxis._tmax, div._fullLayout.yaxis._tmin, div._fullLayout.yaxis._tmax);

                /*
            // Nuclear Mugshots standalone is deprecated.  If you want to use mugshots, the new one is located in FeatureScapeApps.
    if (location.search.match(config.findAPI)) {
        var divZ = document.createElement('div');
        var bt = divZ.innerHTML = '<p><button id="resampleBt" style="color:red">Resample from selected region (under development)</button></p><p id="resampleMsg"></p>';
        div.appendChild(divZ);
        resampleBt.onclick = function () {
            var round = function (x) {
                return Math.round(x * 10000000000) / 10000000000
            };


            // Plotly will attach the plot information to the div that you specify.
            var xmin = div._fullLayout.xaxis._tmin;
            var xmax = div._fullLayout.xaxis._tmax;
            var ymin = div._fullLayout.yaxis._tmin;
            var ymax = div._fullLayout.yaxis._tmax;


            var h = '<h3 style="color:maroon">resampling (under development)</h3>';
            h += '<p style="color:blue">' + fi + ': ' + xmin + ' , ' + xmax + '</p>';
            h += '<p style="color:blue">' + fj + ': ' + ymin + ' , ' + ymax + '</p>';
            resampleMsg.innerHTML = h;
            
            var urlTammy = config.domain + "/nuclei-mugshots/#caseid=" + location.search.match('TCGA-[^%]+')[0] + "&fx=" + fi + '&xmin=' + xmin + '&xmax=' + xmax + "&fy=" + fj + '&ymin=' + ymin + '&ymax=' + ymax + '&url=' + location.search.match(config.findAPI + '[^\;]+')[0];
            window.open(urlTammy);
            

        }
    }
*/
};


// ini
$(document).ready(function () {
    fscape()
});


// Reference
//
// generating reference csv file (no worries, all connection info obfuscated :-P)
// mongoexport --host xxxxxx --port xxxx --username xxxx --password xxxx  --collection Nuclei --type=csv --db=stony-brook --fields Slide,X,Y,Area,Perimeter,Eccentricity,Circularity,MajorAxisLength,MinorAxisLength,Extent,Solidity,FSD1,FSD2,FSD3,FSD4,FSD5,FSD6,HematoxlyinMeanIntensity,HematoxlyinMeanMedianDifferenceIntensity,HematoxlyinMaxIntensity,HematoxlyinMinIntensity,HematoxlyinStdIntensity,HematoxlyinEntropy,HematoxlyinEnergy,HematoxlyinSkewness,HematoxlyinKurtosis,HematoxlyinMeanGradMag,HematoxlyinStdGradMag,HematoxlyinEntropyGradMag,HematoxlyinEnergyGradMag,HematoxlyinSkewnessGradMag,HematoxlyinKurtosisGradMag,HematoxlyinSumCanny,HematoxlyinMeanCanny,CytoplasmMeanIntensity,CytoplasmMeanMedianDifferenceIntensity,CytoplasmMaxIntensity,CytoplasmMinIntensity,CytoplasmStdIntensity,CytoplasmEntropy,CytoplasmEnergy,CytoplasmSkewness,CytoplasmKurtosis,CytoplasmMeanGradMag,CytoplasmStdGradMag,CytoplasmEntropyGradMag,CytoplasmEnergyGradMag,CytoplasmSkewnessGradMag,CytoplasmKurtosisGradMag,CytoplasmSumCanny,CytoplasmMeanCanny,Boundaries,filename --limit 100000 --out nuclei100k.csv
//
// 1K reference dataset: https://opendata.socrata.com/resource/3dx7-jw2n.json
// 10K reference dataset: https://opendata.socrata.com/resource/ytu3-b8rp.json
// 100K reference dataset: https://opendata.socrata.com/resource/pbup-cums.json
// Tahsin's mongodb: https://fscape-132294.nitrousapp.com/?limit=100
