var panels = ['scrn_eventList','scrn_inventoryList'];
var segments = [{'title':'EMERALD', 'evt':'1000'},{'title':'RUBY', 'evt':'1001'},{'title':'SAPPHIRE', 'evt':'1002'},{'title':'DIAMOND', 'evt':'1003'}];

function loadEventInventory(event){
	$('#inventoryListTitle').html(segments[event].title);
	showPanel('scrn_inventoryList');
	getData('/im/items/bye/'+segments[event].evt, showInventory);
};

function showInventory(succ, data){
	if(succ){
		setContent('inventoryList-template',{'data':data.data},'inventoryOut');
	};
};