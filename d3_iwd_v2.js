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
    this.name=row.select('.name').text();
    this.color=row.select('.color').text();
    this.initP=row.select('.initp').text();
    this.priorities=null;
    Priority.call(this);
}

/* Set up inheritance */
SimpleRowPriority.prototype=new Priority();
SimpleRowPriority.constructor=SimpleRowPriority;
