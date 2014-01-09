/* 
 * iWD Priority Visualisation With D3
 * Copyright SJ Hindmarch 2013, 2014
 * Distributed under the GNU General Public License
 *
 * Create priority objects by reading from a table
 *
 */

/* Create a profile function */
function DefaultProfileFunction(basePriority,baseWeight){
    this.name="default";
    this.basePriority=basePriority;
    this.baseWeight=baseWeight;
}

DefaultProfileFunction.prototype.getInitialPriority=function(bv){
    return this.basePriority+(bv*this.baseWeight);
};

DefaultProfileFunction.prototype.getTransitions=function(bv){
    return [];
};

DefaultProfileFunction.prototype.createTransitionsFromShape=function(shape,bv){
    var transitions=[];
    var base=this.basePriority;
    var weight=this.baseWeight;
    shape.forEach(function(x){
	    var t=x[0];
	    var p=x[1]+base+(bv*weight);
	    transitions.push([t,p]);
	});
    return transitions;
};

/* Subclass the profile functions */
function FastPeakProfileFunction(basePriority,baseWeight){
    DefaultProfileFunction.call(this,basePriority,baseWeight);
}
FastPeakProfileFunction.prototype=new DefaultProfileFunction();
FastPeakProfileFunction.constructor=DefaultProfileFunction;

function SlowPeakProfileFunction(basePriority,baseWeight){
    DefaultProfileFunction.call(this,basePriority,baseWeight);
}
SlowPeakProfileFunction.prototype=new DefaultProfileFunction();
SlowPeakProfileFunction.constructor=DefaultProfileFunction;

function HighTailProfileFunction(basePriority,baseWeight){
    DefaultProfileFunction.call(this,basePriority,baseWeight);
}
HighTailProfileFunction.prototype=new DefaultProfileFunction();
HighTailProfileFunction.constructor=DefaultProfileFunction;

function LowTailProfileFunction(basePriority,baseWeight){
    DefaultProfileFunction.call(this,basePriority,baseWeight);
}
LowTailProfileFunction.prototype=new DefaultProfileFunction();
LowTailProfileFunction.constructor=DefaultProfileFunction;

/* A fast peak reaches a peak quickly and then subsides slowly */
FastPeakProfileFunction.prototype.getTransitions=function(bv){
    this.shape=[[-30,1000],[5,800],[30,600],[60,400],[120,200]];
    return this.createTransitionsFromShape(this.shape,bv)
};
/* A slow peak reaches a peak slowly and then subsides quickly */
SlowPeakProfileFunction.prototype.getTransitions=function(bv){
    this.shape=[[-120,400],[-90,600],[-60,800],[-30,1000],[5,200]];
    return this.createTransitionsFromShape(this.shape,bv)
};
/* A high tail has long past past due item higher than due now */
HighTailProfileFunction.prototype.getTransitions=function(bv){
    this.shape=[[-30,800],[5,600],[60,1000]];
    return this.createTransitionsFromShape(this.shape,bv)
};
/* A low tail has long past past due item lower than due now */
LowTailProfileFunction.prototype.getTransitions=function(bv){
    this.shape=[[-30,1000],[5,600],[60,800]];
    return this.createTransitionsFromShape(this.shape,bv)
};

/* Create a child priority that uses a profile function to determine
 * transitions */
function ProfilePriority(name,color,profile,bv){
    this.basePriority=1000;
    this.baseWeight=1;

    var name=name;
    //console.log('ProfilePriority::constructor: '+name);
    var color=color;
    this.profile=profile;
    this.bv=+bv;
    this.profileFunction=this.createProfileFunction();
    var initP=this.profileFunction.getInitialPriority(this.bv);
    var transitions=this.profileFunction.getTransitions(this.bv);
    Priority.call(this,name,color,initP,transitions);
}

/* Set up inheritance */
ProfilePriority.prototype=new Priority();
ProfilePriority.constructor=ProfilePriority;

ProfilePriority.prototype.createProfileFunction=function(){
    //console.log('ProfilePriority::createProfileFunction: '+this.profile);
    switch(this.profile){
      case "fast peak":
	return new FastPeakProfileFunction(this.basePriority,this.baseWeight);
      case "slow peak":
	return new SlowPeakProfileFunction(this.basePriority,this.baseWeight);
      case "high tail":
	return new HighTailProfileFunction(this.basePriority,this.baseWeight);
      case "low tail":
	return new LowTailProfileFunction(this.basePriority,this.baseWeight);
      default:
	return new DefaultProfileFunction(this.basePriority,this.baseWeight);
    }
}

/* A Child of ProfilePriority that can be created from a row selector */
function ProfileRowPriority(row){
    this.row=row;
    var name=row.select('.name').text();
    var color=row.select('.color').text();
    var profile=row.select('.profile').node().value;
    var bv=row.select('.bv').node().value;
    ProfilePriority.call(this,name,color,profile,bv);
}

/* Set up inheritance */
ProfileRowPriority.prototype=new ProfilePriority();
ProfileRowPriority.constructor=ProfileRowPriority;

/* Create the selector for the profile */
function appendProfileSelector(row,profile){
    var profileNames=["default","fast peak","slow peak","high tail","low tail"];

    if(!profile){
	profile="default";
    }
    var select=row.append('select').attr('class','profile');
    profileNames.forEach(function(profileName){
	    var option=select.append('option').text(profileName);
	    if(profileName==profile){
		option.attr('selected','true');
	    }
	});
}  

/* Create the table from initial data */
function createProfilePrioritiesTable(tableId,priorities){
    var table=d3.select(tableId);
    priorities.forEach(function(priority){
	    var row=table.append('tr').attr('class','priority');
	    row.append('td').attr('class','name').text(priority.name);
	    row.append('td').attr('class','color').text(priority.color);
	    appendProfileSelector(row,priority.profile);
	    var bv=priority.bv;
	    if(!bv){
		bv=1000;
	    }
	    row.append('td').append('input').attr('class','bv')
	    .attr('value',bv);
	    row.append('td').text('\xA0'); // non-breaking space
	});

}

/* add a row to the table */
function addProfilePriorityRow(chart,tableId,formId){

    var form=d3.select(formId);
    var name=form.select('.name').node().value;
    var color=form.select('.color').node().value;
    var profile=form.select('.profile').node().value;
    var bv=form.select('.bv').node().value;
    
    var table=d3.select(tableId);
    var row=table.append('tr').attr('class','priority');
    row.append('td').attr('class','name').attr('name',name).text(name);
    row.append('td').attr('class','color').text(color);
    appendProfileSelector(row,profile);
    row.append('td').append('input').attr('class','bv').attr('value',bv);

    row.append('td').append('button').attr('type','button').text('Delete')
    .attr('onclick','deleteProfilePriorityRow(\''+chart+
	  '\',\''+tableId+'\',\''+name+'\')');
}

/* delete a row from the table */
function deleteProfilePriorityRow(chart,tableId,name){
    var cell=d3.select(tableId).selectAll('td[name='+name+']');
    cell[0].forEach(function(d,i){
	    d.parentElement.remove();
	});
}
