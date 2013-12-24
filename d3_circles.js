/* 
 * Data Driven D3 Circles Example
 * Copyright SJ Hindmarch 2013
 * All Rights Reserved
 */

function create(dataPoints){
    svg=d3.select("#svg");

    var circle=svg.selectAll("circle");
    circle.data(dataPoints).enter().append("circle")
    .attr("cx",function(d){return (2*d)})
    .attr("cy",function(d,i){return (50+10*i)})
    .attr("r",20)
    .style("fill","none");

    var text=svg.selectAll("text");
    text.data(dataPoints).enter().append("text")
    .text(function(d,i){return "("+d+","+i+")"})
    .attr("text-anchor","middle").attr("dy",".30em").attr("font-size","75%")
    .attr("x",function(d){return (2*d)})
    .attr("y",function(d,i){return (50+10*i)})
    ;

}

function cfill(colour){
    svg=d3.select("#svg");
    var circle=svg.selectAll("circle");
    circle.style("fill",colour);
}
	
function cyalign(state){
    svg=d3.select("#svg");
    var circle=svg.selectAll("circle");
    var text=svg.selectAll("text");
    if(state){
	circle.attr("cy",90);
	text.attr("y",90);
    }else{
	var p=function(d,i){return (50+10*i)};
	circle.attr("cy",p);
	text.attr("y",p);
    }
}

function cxalign(state){
    svg=d3.select("#svg");
    var circle=svg.selectAll("circle");
    var text=svg.selectAll("text");
    if(state){
	circle.attr("cx",180);
	text.attr("x",180);
    }else{
	var p=function(d,i){return (2*d)};
	circle.attr("cx",p);
	text.attr("x",p);
    }
}

function csize(state){
    svg=d3.select("#svg");
    var circle=svg.selectAll("circle");
    if(state){
	var a=function(d,i){return 5*Math.sqrt(d)};
	circle.attr("r",a);
    }else{
	circle.attr("r",20);
    }
}

function init(){
    var data=[10,25,60,94];
    create(data);
}
