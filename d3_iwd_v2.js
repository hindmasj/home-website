/* 
 * iWD Priority Visualisation With D3
 * Copyright SJ Hindmarch 2013-2014
 * Distributed under the GNU General Public License
 *
 * Create priority objects by reading from a table
 *
 */

/* Create a child priority class that gets its values from a table row */
function SimpleRowPriority(row){
    this.row=row;
    var name=row.select('.name').text();
    var color=row.select('.color').text();
    var initP=row.select('.initp').node().value;
    var transitions=this.scanTransitions(row);
    Priority.call(this,name,color,initP,transitions);
}

/* Set up inheritance */
SimpleRowPriority.prototype=new Priority();
SimpleRowPriority.constructor=SimpleRowPriority;

/* Add function to process the transitions */
SimpleRowPriority.prototype.scanTransitions=function(row){
    var transitions=[];
    row.selectAll('input.transition').each(function(d,i){
	var item=d3.select(this);
	var time=item.attr('time');
	var value=item.node().value;
	if(value!=""){
	    transitions.push([time,value]);
	}
    });
    return transitions;
}

/* A table scanning function. Pass in table name and 
 * type of priority to be scanned for.
 */
function scanPrioritiesTable(tableName,type){
    rows=d3.select(tableName).selectAll('tr.priority');
    priorities=[];
    rows.each(function(d,i){
	priorities.push(new type(d3.select(this)));
    });
    return priorities;
}

/* Create the table from initial data */
function createSimpleRowPrioritiesTable(tableId,priorities){
    var times=['-120','-60','-30','0','30','60','120'];

    var table=d3.select(tableId);
    priorities.forEach(function(priority){
	    var row=table.append('tr').attr('class','priority');
	    row.append('td').attr('class','name').text(priority.name);
	    row.append('td').attr('class','color').text(priority.color);
	    row.append('td').append('input').attr('type','text')
            .attr('class','initp').attr('maxlength','4').attr('size','8')
	    .attr('value',priority.initP);
	    times.forEach(function(d,i){
		    var value=priority.getTransition(d);
		    var cell=row.append('td').append('input')
		    .attr('type','text')
		    .attr('class','transition').attr('maxlength','4')
		    .attr('size','8').attr('time',d)
		    if(value){
			cell.attr('value',value);
		    }
		});
	});
    
}

/* Add a row to the table */
function addSimplePriorityRow(tableId,nameId,colorId,initpId){
    var times=['-120','-60','-30','0','30','60','120'];

    var name=d3.select(nameId).node().value;
    var color=d3.select(colorId).node().value;
    var initp=d3.select(initpId).node().value;

    var table=d3.select(tableId);
    var row=table.append('tr').attr('class','priority');
    row.append('td').attr('class','name').text(name);
    row.append('td').attr('class','color').text(color);
    row.append('td').append('input').attr('type','text').attr('class','initp')
    .attr('maxlength','4').attr('size','8').attr('value',initp);
    times.forEach(function(x){
	    row.append('td').append('input').attr('type','text')
	    .attr('class','transition').attr('maxlength','4').attr('size','8')
	    .attr('time',x);
	});
}

/* redraw the chart from the current table */
function redrawPriorityChart(chart,tableId,pFunction){
    var priorities=scanPrioritiesTable(tableId,pFunction);
    console.log('redraw: priorities.length='+priorities.length);
    priorities.forEach(function(x){
	    //console.log('redraw: priority: '+x.name+','+x.profile);
	    chart.updatePriority(x);
	});
}
