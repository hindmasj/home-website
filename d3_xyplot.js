/* 
 * D3 XY Plot Example
 * Copyright SJ Hindmarch 2013, 2014
 * Distributed under the GNU General Public License
 */

function init(){
    var dataset=[[0,0],[10,25],[60,42],[94,97],[99,27],[200,100]];

    var h=180;
    var w=360;
    var ax_padding=20;
    var ay_padding=30;
    var padding=10;

    var dx_max=dataset.slice().sort(function(a,b){return b[0]-a[0]})[0][0];
    var dy_max=dataset.slice().sort(function(a,b){return b[1]-a[1]})[0][1];
    var x_scale=d3.scale.linear().domain([0,dx_max])
    .range([ay_padding,w-padding])
    var y_scale=d3.scale.linear().domain([0,dy_max])
    .range([h-ax_padding,padding])

    var x_axis=d3.svg.axis().scale(x_scale);
    var y_axis=d3.svg.axis().scale(y_scale).orient('left');

    var svg=d3.select("#workarea svg");
    svg.append('g').attr('class','axis').attr('id','x_axis')
    .attr('transform','translate(0,'+(h - ax_padding)+')')
    .call(x_axis);
    svg.append('g').attr('class','axis').attr('id','y_axis')
    .attr('transform','translate('+ay_padding+',0)')
    .call(y_axis);

    points=svg.selectAll('circle').data(dataset).enter().append('circle')
    .attr('r',2)
    .attr('cx',function(d){return x_scale(d[0])})
    .attr('cy',function(d){return y_scale(d[1])})

}
