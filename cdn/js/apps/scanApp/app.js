var mkid;
var panels										= ['consultantInput','consultantDisplay','changeAwardOut','consultantFinal'];

var repdata, repachievements 	= [];
var repachorig					= [];
var allItems 					= [];

var recordUpdated				= false;

function consultantSearch(){
	mkid 										= $('#con_id').val().toUpperCase();
	if(mkid.length < 6){
		$('#err').html('<p>please enter a valid id.</p>');
		$("#con_id").focus();
	} else {
		window.location	 							= "?cid=" + mkid;
	};
};

function loadConsultant(succ, data){
	if(succ){
		if(data.success){
			repdata								= data.data.rep;
			repachievements						= data.data.plist;
			repachorig							= data.data.plist;

			setContent('consultantOut-template', {data:repdata}, 'repInfoOut');
			setContent('inventoryList-template', {plist:repachievements}, 'repAchOut');
			getData('/im/items', loadedInventory);
		} else {
			$('#con_id').val("")
			$('#err').html(data.data);
			$("#con_id").focus();
		};
	} else {
		$('#err').html('Failed to call service');
	};
};

function loadedInventory(succ, data){
	if(succ){
		allItems = data.data;
		backToConsultant();
	};
};


function updateAward(){
	var selected = $("#prizeSelect").val();
	if(selected == "select"){
		alert("Please Update Selection");
	} else {
		/*update logic - kill curitem, replace with new item*/
		var newitem;
		for(var i = 0; i < allItems.length; i++){
			if(allItems[i]._id == selected)
			{
				newitem 									= allItems[i];
				newitem.pickedup							= true;
				newitem.method								= "ship";
				newitem.pickupdate							= Date.now();
			};
		};
		var data = { 'consultant':repdata, 'curach': curitem, 'newach': newitem };
		postData( data, '/im/award/cawd', changeDone);
	};
};

function changeDone(succ, data){
	if(succ){
		getData('/im/con/get/' + getUrlVars()["cid"], loadConsultant);
	} else {
		$('#err').html(data.data);
	}
};

function changePrize(id){
	showPanel('changeAwardOut');
	var str = "<option value='select'>SELECT ACHIEVEMENT</option>";
	for(var i = 0; i < allItems.length; i++){
		var obj = allItems[i];

		if(allItems[i]._id == id){			
			curitem = allItems[i];
			setContent('consultantOut-template', {rep:repdata}, 'changeRepData');
			setContent('singleitem-template', {data:curitem}, 'changeInventoryOut');
			str += "<option value='" + obj._id + "'' disabled style='color:#f00;'> CURRENT "  + obj.cname + " " +  obj.part + " " + obj.attr + " " +  obj.pname + "</option>";	
		} else {
			str += "<option value='" + obj._id + "''>" + obj.ccode + " " + obj.cname + " " +  obj.part + " " + obj.attr + " " +  obj.pname + "</option>";	
		};
	};
	showPanel('changeAwardOut');
	$("#prizeSelect").html(str);
};



function updatedConsultant(){
	var ready = true;
	for(var i = 0; i < repachievements.length; i++){
		var obj 								= repachievements[i];
		if(!obj.pickedup){
			var selected = $("#"+obj._id).val();
			var row = $("#ob_" + obj._id);

			if(selected == "select"){
				row.removeClass('requiredSelected');
				row.removeClass('requiredSelect');
        		row.addClass('requiredSelect');
        		ready = false;
			} else {
				row.removeClass('requiredSelected');
				row.removeClass('requiredSelect');
        		row.addClass('requiredSelected');
			}
		};
	};
	if(ready){displayFinal();};
};


function confirmRecord(){
	var ready 										= true;
	for(var i = 0; i < repachievements.length; i++){
		var o 										= repachievements[i];
		var selected = $("#"+o._id).val();
		if(selected == "select"){
			var row = $("#ob_" + o._id);
			row.removeClass('requiredSelected');
			row.removeClass('requiredSelect');
        	row.addClass('requiredSelect');
        	ready									= false;
		}
	};
	if(ready){
		var data = { 'consultant' : repdata, 'parts' : repachievements};
		postData(data, '/im/award/conf', updatedConsultant);		
	};
};

function updateSelect(id){
	var selected = $("#"+id).val();
	var row = $("#ob_" + id);
	if(selected != "select"){
		var b = true;
		if(selected == "later"){b = false;};
		row.removeClass('requiredSelected');
		row.removeClass('requiredSelect');    
        row.addClass('requiredSelected');
		for(var i = 0; i < repachievements.length; i++){
			var obj 								= repachievements[i];
			if(obj._id == id){			
				obj.method							= selected;
				obj.pickedup						= b;
				obj.pickupdate						= Date.now();
			};	
		};
	} else {
		row.removeClass('requiredSelected');
		row.removeClass('requiredSelect');
        row.addClass('requiredSelect');
	};
};

function displayFinal(succ, data){
	showPanel('consultantFinal');
};

function backToConsultant(){
	for(var i = 0; i < repachievements.length; i++)
	{
		var o = repachievements[i];
		if(!o.pickedup){
			var selected = $("#"+o._id).val();
		}
	};
	showPanel('consultantDisplay');
};

function backToMain(){
	window.location = "/app/default.html";
};