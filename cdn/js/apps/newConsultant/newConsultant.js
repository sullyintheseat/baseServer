var achievements = [];
var allPrizes = [];

function startNewConsultant(){
	getData('/im/items', showInventory)
};

function showInventory(succ, data){
	if(succ){
		allPrizes = data.data;
		setContent('inventoryList-template',{'data':data.data},'inventoryOut');
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
	updateGiveList();
};

function updateGiveList(){
	setContent('achievementList-template',{'data': achievements},'achievementOut');
};

function newConsultant(){

	var id, first, last, evt;

	id 			= $("#con_id").val();
	first  		= $("#con_first").val();
	last 		= $("#con_last").val();
	evt			= $("#eventSelect").val();

	var consultant = { 'mkid':''+id+'', 'first':''+first+'','last':''+last+'', 'evt':evt};

	var parts =  [];
	

	for(var i = 0; i < achievements.length; i++){
		parts.push({part : achievements[i]});
	};

	postData( {'consultant':consultant, 'parts':parts} ,'/im/con/new', postedConsultant);
}

function postedConsultant(succ, data){
	if(succ){
		$("#con_id").val("");
		$("#con_first").val("");
		$("#con_last").val("");
		for(var i = 0; i < allPrizes.length; i++){
			var cb = $("#"+allPrizes[i]._id);
			if(cb.is(':checked')){
				cb.attr('checked', false);
			}
		}
		achievements = [];
		updateGiveList();
	} else {
		alert("Failed to add consultant\n" + data.data);
	}
};

/*

{
  "consultant": {
    "mkid": "060606",
    "first": "matt",
    "last": "sullivan"
  },
  "parts": [
    {
      "item": "data"
    }
  ]
}
*/