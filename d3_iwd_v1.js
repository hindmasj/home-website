/* 
 * iWD Priority Visualisation With D3
 * Copyright SJ Hindmarch 2013
 * All Rights Reserved
 *
 * Basic chart drawing and priority flow modelling
 *
 */

/* Create a priority class that stores priority data */
function Priority(name,color,initialPriority,transitions){
    this.name=name;
    this.color=color;
    this.initP=initialPriority;
    this.transitions=transitions;
};

/* Function to turn the priority values into a line array */
Priority.prototype.getPriorityLine=function(startTime,endTime){
    var line=[];

    /* If transitions not set return flat line */
    if(this.transitions==null || this.transitions.length==0){
	line.push([startTime,this.initP]);
	line.push([endTime,this.initP]);
	return line;
    }

    /* Find start of line */
    var i=0;
    var currP=this.initP;
    while(line.length==0 && i<this.transitions.length){
	var p=this.transitions[i++];
	if(p[0]>startTime){
	    line.push([startTime,currP]);
	    currP=p[1];
	}
    }
    for(var j=i-1;j<this.transitions.length;j++){
	var p=this.transitions[j];
	if(p[0]<endTime){
	    line.push(p);
	    currP=p[1];
	}
    }
    line.push([endTime,currP]);
    
    return line;
}

/* Create a chart class that can draw a basic chart */
function PriorityChart(chartName,tableName){
    /* Store the priority objects */
    this.priorities={};

    /* Set dimensions of area we will be drawing in */
    this.h=480;
    this.w=800;
    this.padding=10;
    this.x_padding=40;

    /* Select graphical area  */
    this.g=d3.select(chartName);
    this.table=d3.select(tableName);

    /* Create drawing scales */
    this.dx_min=-300;
    this.dx_max=150;
    this.dy_min=0;
    this.dy_max=4200;

    this.x_scale=d3.scale.linear().domain([this.dx_min,this.dx_max])
    .range([this.padding,this.w-this.padding])
    this.y_scale=d3.scale.linear().domain([this.dy_min,this.dy_max])
    .range([this.h-this.x_padding,this.padding])

    /* Create axes */
    this.x_axis=d3.svg.axis().scale(this.x_scale);
    this.y_axis=d3.svg.axis().scale(this.y_scale).orient('left');

    /* Create line drawing generator */
    this.lineG=d3.svg.line()
    .x(function(d){return this.x_scale(d[0])})
    .y(function(d){return this.y_scale(d[1])})
    .interpolate("step-after");

    this.drawChart();
};

/* Add a method to draw the empty chart */
PriorityChart.prototype.drawChart=function(){
    /* Expand drawing area to required size */
    this.g.style('width',this.w).style('height',this.h);
    this.drawGrid();
    this.drawAxes();
};

/* Add a method to draw the grid */
PriorityChart.prototype.drawGrid=function(){
    /* x grid */
    this.g.append('g').attr('class','axis').attr('id','x_axis')
    .attr('transform','translate(0,'+(this.h - this.x_padding)+')')
    .call(this.x_axis);

    /* y grid */
    this.g.append('g').attr('class','grid')
    .attr('transform', 'translate('+this.padding+',0)')
    .call(
	this.y_axis.tickSize((2*this.padding)-this.w,0,0).tickFormat('')
	);
}

/* Add a method to draw the axes */
PriorityChart.prototype.drawAxes=function(){

    /* x axis */
    this.g.append('g').attr('class','grid')
    .attr('transform', 'translate(0,'+this.y_scale(this.dy_max)+')')
    .call(
	this.x_axis.tickSize(
	    this.y_scale(this.dy_min)-this.y_scale(this.dy_max),0,0).
	tickFormat('')
	);

    /* y axis */
    this.g.append('g').attr('class','axis').attr('id','y_axis')
    .attr('transform','translate('+this.x_scale(0)+',0)')
    .call(this.y_axis.tickSize(5,0,0).tickFormat(d3.format('>4d')));

};

/* Draw the label for an individual priority */
PriorityChart.prototype.drawLabel=function(item){
    this.g.append("text").text(item.name).attr('label',item.name)
    .attr("x",this.x_scale(this.dx_min))
    .attr("y",this.y_scale(item.initP))
    .attr("text-anchor","start").attr("dy","-0.5em")
    .attr("font-size","75%");
};

/* Draw the graphics for an individual priority */
PriorityChart.prototype.drawLine=function(item){
    /* Get the priority line from the priority item */
    var lineD=item.getPriorityLine(this.dx_min,this.dx_max);

    /* Draw the line */
    this.g.append("path").attr('label',item.name)
    .attr('stroke-width',2).attr('fill','none')
    .attr('stroke',item.color)
    .attr('d',this.lineG(lineD));

};

/* Add a priority to the chart and draw it */
PriorityChart.prototype.addPriority=function(){
    var chart=this;
    for(var i=0;i<arguments.length;i++){
	item=arguments[i];
	chart.priorities[item.name]=item;
	chart.drawLabel(item);
	chart.drawLine(item);
    }
};

PriorityChart.prototype.updatePriority=function(){
    var chart=this;
    for(var i=0;i<arguments.length;i++){
	item=arguments[i];
	this.g.selectAll("[label='"+item.name+"']").remove();
	chart.priorities[item.name]=item;
	chart.drawLabel(item);
	chart.drawLine(item);
    }
};
    
PriorityChart.prototype.outputData=function(){
    var header=this.table.insert('tr');
    header.append('th').text('Name');
    header.append('th').text('Colour');
    header.append('th').text('Initial Priority');
    header.append('th').text('Transitions');
    for(var key in this.priorities){
	var item=this.priorities[key];
	var row=this.table.insert('tr');
	row.insert('td').text(item.name).attr('class','name');
	row.insert('td').text(item.color).attr('class','color');
	row.insert('td').text(item.initP).attr('class','initp');
	var tRow=row.insert('td').attr('class','priorities');
	if(item.transitions){
	    tText="";
	    item.transitions.forEach(function(x){
		    tText+=" "+x[1]+"@"+x[0]+";";
		});
	    tRow.text(tText);
	}else{
	    tRow.text("-").style('text-align','center');
	}
	    
    }
}
