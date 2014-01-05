/* 
 * D3 Bar Chart Example
 * Copyright SJ Hindmarch 2013-2014
 * Distributed under the GNU General Public License
 */

function init(){
    var dataset=[20,24,32,45,32,21,65,78,101,102,54,156,44,12,18,99];
    var svg=d3.select('#workarea').append('svg');
    process(svg,dataset);
}

function new_chart(){
    var s_data=d3.select('#indata').property('value').split(" ");
    var i_data=s_data.map(function(x){return parseInt(x,10)});
    
    d3.select('#workarea').select('svg').remove();
    var svg=d3.select('#workarea').append('svg').attr('class','chart');
    process(svg,i_data);
}

function process(svg,dataset){
    var h=180;
    var w=360;
    var bar_padding=1;

    var bar_space=w/dataset.length;
    var bar_width=bar_space-bar_padding;
    var d_max=dataset.slice().sort(function(a,b){return b-a})[0];
    var y_scale=d3.scale.linear().domain([0,d_max]).range([h,0])

    svg.selectAll('rect').data(dataset).enter().append('rect')
    .attr('x',function(d,i){return i*bar_space})
    .attr('y',function(d,i){return y_scale(d)})
    .attr('width',bar_width)
    .attr('height',h)
    .attr('fill',function(d,i){return 'rgba(0,0,'+(255-d)+',1)'});

    svg.selectAll('text').data(dataset).enter().append('text')
    .text(function(d,i){return d})
    .attr('x',function(d,i){return i*bar_space+bar_width/2})
    .attr('y',function(d,i){return y_scale(d)+10})
    .attr('font-family','sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'white')
    .attr("text-anchor", "middle");
}
