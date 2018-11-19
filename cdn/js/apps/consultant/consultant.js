var achievements = [];
var allPrizes = [];
var panels = ['consultantInput', 'consultantContainer','confirmDelete', 'deleteSuccess','addAwardOut','changeAwardOut','prizeSwap'];
var mkid;
var availPrizes = [];
var repdata;
var curitem;

function consultantSearch(){
	mkid = $('#con_id').val().toUpperCase();
	window.location = "?cid=" + mkid;
};

function loadConsultant(succ, data){
	if(succ){
		if(data.success){
			$('#err').html('');
			showPanel('consultantContainer');
			achievements 			= data.data.plist;
			allPrizes 				= data.data.plist;
			mkid 					= data.data.mkid;
			repdata 				= data.data.rep;
			setContent("repdata-template", data.data, "repOut");
			setContent("inventoryList-template", data.data, "achievementOut");
			getData('/im/items', showInventory);
		} else {
			$('#err').html(data.data);
		};
	} else {
		$('#err').html('Failed to call service');
	}
};

function showInventory(succ, data){
	if(succ){
		availPrizes = data.data;
	};
};

function startConsultant(){
	getData('/im/items', showInventory)
};

function showInventory(succ, data){
	if(succ){
		allPrizes = data.data;
	};
};


function toggleCheckbox(me){
	//alert( $("#"+me).is(':checked')+ " " +  me);
	if($("#"+me).is(':checked')){
		for(var j = 0; j < allPrizes.length; j++){
			if(allPrizes[j]._id == me){
				achievements.push(allPrizes[j]);
			}
		};
	} else {
		for(var i=0; i < achievements.length; i++){
			if(achievements[i]._id == me){
				achievements.splice( i, 1 );
			}
		};
	}
	alert(achievements + " " + allPrizes);
};

function cancelDelete(){
	showPanel('consultantContainer');
}

function deleteConsultant(id){
	mkid = id;
	showPanel('confirmDelete');
};

function removeThis(id){
	postData({'id':id}, '/im/award/rem', deletedAward);
};

function changePrize(id){
	var str = "<option value='select'>SELECT ACHIEVEMENT</option>";
	
	for(var i = 0; i < allPrizes.length; i++){
		var obj = allPrizes[i];
		if(allPrizes[i]._id == id){			
			curitem = allPrizes[i];
			setContent('addrepdata-template', {rep:repdata}, 'changeRepData');
			setContent('singleitem-template', {data:curitem}, 'changeInventoryOut');
			str += "<option value='" + obj._id + "'' disabled> CURRENT " +  obj.part + " " + obj.attr + " " +  obj.pname + "</option>";
		} else {
			
			str += "<option value='" + obj._id + "''>" +  obj.part + " " + obj.attr + " " +  obj.pname + "</option>";
		}
	};
	showPanel('changeAwardOut');
	$("#prizeSelect").html(str);	
};

function changeAwardConfirm(){
	var selected = $("#prizeSelect").val();
	if(selected == "select"){
		alert("Please Update Selection");
	} else {
		/*update logic - kill curitem, replace with new item*/
		var newitem;
		for(var i = 0; i < allPrizes.length; i++){
			if(allPrizes[i]._id == selected)
			{
				newitem 									= allPrizes[i];
			}
		}
		var data = { 'consultant':repdata, 'curach': curitem, 'newach': newitem };
		postData( data, '/im/award/upd', changeDone);
	};
};

function changeDone(succ, data){
	if(succ){
		getData('/im/con/get/' + getUrlVars()["cid"], loadConsultant);
	} else {
		alert("There was an error updating the achievement code.\n" + data.data);
	}
};

function addPrize(){
	showPanel('addAwardOut');
	setContent('addrepdata-template', {rep:repdata}, 'addRepData');
	setContent('inventory-template', {data:allPrizes}, 'inventoryOut');
};

function appendAward(id){
	for(var i = 0; i < allPrizes.length; i++){
		if(allPrizes[i]._id == id){
			
			postData( {'consultant':repdata, 'parts':[allPrizes[i]]} ,'/im/award/add', addedAward);
		}
	}
};


function addedAward(succ, data){
	if(succ){
		getData('/im/con/get/' + getUrlVars()["cid"], loadConsultant);
	}
}

function confirmRemoval(){
	postData({'mkid':mkid}, '/im/con/del', deletedConsultant)
};

function deletedConsultant(succ, data){
	//alert(succ + " " + data);
	if(succ){
		showPanel('deleteSuccess');
	};
};

function deletedAward(succ, data){
	if(succ){
		getData('/im/con/get/' + getUrlVars()["cid"], loadConsultant);
	} else {

	};
};

function prizeSwap(id){
	var str = "<option value='select'>SELECT ACHIEVEMENT</option>";
	setContent('addrepdata-template', {rep:repdata}, 'swapRepData');
	var rep;
	for(var i = 0; i < allPrizes.length; i++){
		var obj = allPrizes[i];
		if(obj._id == id){			
			curitem = allPrizes[i];
			console.log(curitem);
			setContent('singleitem-template', {data:curitem}, 'swapInventoryOut');
			if(obj.attr == "null"){ rep = "0";} else { rep = obj.attr;};
			str += "<option value='" + obj._id + "'' disabled> CURRENT  " + obj.attr + " " +  obj.pname + "</option>";
		} else {
			if(obj.attr == "null"){ rep = "0";} else { rep = obj.attr;};
			str += "<option value='" + obj._id + "''>" + obj.part + " " + obj.attr + " " +  obj.pname + "</option>";
		}
	};
	showPanel('prizeSwap');
	$("#prizeSelect").html(str);
};

function swapAwardConfirm(){
	var selected = $("#prizeSelect").val();
	if(selected == "select"){
		alert("Please Update Selection");
	} else {
		/*update logic - kill curitem, replace with new item*/
		var newitem;
		for(var i = 0; i < allPrizes.length; i++){
			if(allPrizes[i]._id == selected)
			{
				newitem 									= allPrizes[i];
			}
		}
		//alert(propIter(curitem) + " \n\n" + propIter(newitem));
		var data = { 'consultant':repdata, 'curach': curitem, 'newach': newitem, 'method': $("#swapDelivery").val() };
		postData( data, '/im/award/change', changeDone);
	};
};

function backToMain(){
	window.location = "/adm/default.html";
};