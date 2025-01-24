let controlPanelSite = document.getElementById('innerControlPanel');

var insertHTML=
'<span class="filterTitle">スポットの絞り込み</span>\
<label><input type="checkbox" class="sightType" id="橋" unchecked onclick="displaySightUpdate()">橋</label>\
<label><input type="checkbox" class="sightType" id="博物館等" unchecked onclick="displaySightUpdate()">博物館等</label>\
<label><input type="checkbox" class="sightType" id="others" unchecked onclick="displaySightUpdate()">史跡等</label>';

if(riverNameHere != 'all'){
    insertHTML += '<label><input type="checkbox" id="difriver" unchecked onclick="nearRiver()">他の河川の周辺も表示</label>'
}

controlPanelSite.innerHTML+=insertHTML;