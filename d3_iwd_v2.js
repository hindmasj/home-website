/* 
 * iWD Priority Visualisation With D3
 * Copyright SJ Hindmarch 2013
 * All Rights Reserved
 *
 * Create priority objects by reading from a table
 *
 */

/* Create a child priority class that gets its values from a table row */
function SimpleRowPriority(row){
    this.row=row;
    var name=row.select('.name').text();
    var color=row.select('.color').text();
    var initP=row.select('.initp').attr('value');
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
	var value=item.attr('value');
	if(value!=null){
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
