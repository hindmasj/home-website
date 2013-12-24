/* $URL: https://svn.coolworld.bt.co.uk/svn/sjh/trunk/websites/development/javascript/d3_joins.js $
 * $Author: sjh $
 * $Revision: 323 $
 * $Date: 2012-12-20 17:41:17 +0000 (Thu, 20 Dec 2012) $
 */

var scale_x=d3.scale.linear().domain([0,100]).range([0,360]);
var scale_r=d3.scale.linear().domain([0,10]).range([0,90]);

function init(){
    d3.select('#workarea').append('p').text('Enter data and press return');
};

function process(){
    // capture data as strings and convert to integers
    var s_data=d3.select('#indata').property('value').split(" ");
    var i_data=s_data.map(function(x){return parseInt(x,10)});

    // Organise display
    var workarea=d3.select('#workarea');
    var bararea=workarea.selectAll('[name="bararea"]');
    if(bararea.empty()){
	bararea=workarea.append('div').attr('name','bararea');
	workarea.append('br');
    }
    var boxarea=workarea.selectAll('[name="boxarea"]');
    if(boxarea.empty()){
	boxarea=workarea.append('div').attr('name','boxarea');
    }

    // Show data in text area
    workarea.select('p').text(s_data.toString());

    // Barchart can be drawn direct to the page
    var bar=bararea.selectAll('.bar').data(i_data);
    bar.enter().append('div').attr('class','bar');
    bar.exit().remove();
    bar.style('height',function(d){return d+'px'});

    // Bar labels shown underneath
    var box=boxarea.selectAll('.box').data(i_data);
    box.enter().append('div').attr('class','box');
    box.exit().remove();
    box.text(function(d){return d});

    // Circle chart requires an svg
    var svg=workarea.selectAll('svg');
    if(svg.empty()){
	svg=workarea.append('svg');
    }
    var c=svg.selectAll('circle').data(i_data);
    c.enter().append("circle");
    c.attr('cy',90)
    .attr('cx',function(d){return scale_x(d)})
    .attr('r',function(d){return scale_r(Math.sqrt(d))});
    c.exit().remove();
}
