let geoJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/mapdata/main/crdot2.geojson';
let dotJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/mapdata/main/crdot.geojson';

//地図の読み込み(座標は河川ごと)
var map = L.map('map').setView(defaultPlace, defaultZ);
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png').addTo(map);

L.control.scale({
    imperial: false,
    metric: true
}).addTo(map);
map.zoomControl.setPosition("bottomleft");

//河川の着色ルール
var timeSeriesFilter = false;
function coloringRule(thisLayer) {
    if(riverNameHere != 'all'){
        var riverName = thisLayer.feature.properties.name;
        if(eraseNumber(riverName)==riverNameHere){
            thisLayer.setStyle({color: 'blue', fillOpacity: 0.2});
        }
        else{
            thisLayer.setStyle({color: 'aqua', fillOpacity: 0.1});
        }
        return;
    }
    let col,time = thisLayer.feature.properties.time;
    if(!timeSeriesFilter) col = 'blue';
    else if(time === '震災復興')col = 'red';
    else if(time === '戦災復興')col = 'purple';
    else if(time === '東京オリンピック')col = 'black';
    else col = 'orange';
    //switch-case文にすると動かない？
    thisLayer.setStyle({color:col});
}

function eraseNumber(str){
    return str.split('-')[0];
}

//地図のポップアップと挙動の設定
let geoJsonLayer;
fetch(geoJsonURL)
.then(response => response.json())
.then(data => {
    var riverList = document.getElementById('allRiver');
    geoJsonLayer = L.geoJSON(data, {
        style : { weight: 2 },
        onEachFeature: (feature, layer) => {
            var riverName = feature.properties.name;
            var riverTime = feature.properties.time;
            var riverEra = feature.properties.era;
            
            if(riverNameHere == 'all'){
                //全河川表示の時は色分け
                var river = document.createElement('input');
                river.type = 'checkbox';
                river.checked = true;
                river.setAttribute('value', riverName);
                river.setAttribute('id', riverName + riverTime);
                river.setAttribute('class','defaultChecked');
                river.setAttribute('onclick','displayRiverUpdate()');

                var riverLabel = document.createElement('label');
                riverLabel.appendChild(river);
                riverLabel.appendChild(document.createTextNode(riverName));
                riverList.appendChild(riverLabel);
            }

            var setContentHTML = `<b>河川名:</b> ${riverName}<br> <b>埋め立て時期:</b> ${riverEra}`;
            if(riverTime != '現存'){
                setContentHTML += `<br>
                <form action="${eraseNumber(riverName)}.html" method="get">
                    <button type="submit" class="smallbtn">この河川を歩く</button>
                </form>`;
            }

            var newpopup = L.popup({
                closeOnClick: false,
                autoClose: false
            }).setContent(setContentHTML);

            var newMarker = layer.addTo(map);
            newMarker.bindPopup(newpopup, {autoClose: false});

            coloringRule(layer);
            newMarker.getPopup().on('remove', function() {
                coloringRule(layer);
            });
            
            // クリックで選択、ダブルクリックで解除
            layer.on('click', function() {
                layer.setStyle({ color: 'yellow' });
            });
            
            layer.on('dblclick', function() {
                coloringRule(layer);
                layer.closePopup();
            });
        }
    });
})
.catch(console.error);

function iconObject(s, iconType){
    s = Math.max(8,(s-12)*9);
    var newIconUrl;
    if(iconType == 'bridge')newIconUrl='icon/bridge.png';
    else if(iconType == 'museum')newIconUrl='icon/museum.png';
    else newIconUrl='icon/spot.png';

    return {
        iconUrl: newIconUrl,

        iconSize:     [s, s], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [s / 2, s / 2], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, -s / 2] // point from which the popup should open relative to the iconAnchor
    }
};

let dotJsonLayer;
fetch(dotJsonURL)
.then(response => response.json())
.then(data => {
    dotJsonLayer = L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            var newpopup = L.popup({
                closeOnClick: false,
                autoClose: false
            }).setContent(feature.properties.name);
            
            var newMarker = layer.addTo(map);
            newMarker.setIcon(L.icon(iconObject(map.getZoom(),feature.properties.type)));
            if(riverNameHere != 'all' && riverNameHere != feature.properties.river){
                newMarker.setOpacity(0.2);
            }
            newMarker.bindPopup(newpopup);

            newMarker.getPopup().on('remove', function() {
            });
            
            // クリックで選択、ダブルクリックで解除
            layer.on('click', function() {
            });
            
            layer.on('dblclick', function() {
                layer.closePopup();
            });
        }
    });
    if(riverNameHere != 'all')toggleSight(false);
    else displaySightUpdate(true);
});

function onMapClick(e) {
    geoJsonLayer.eachLayer((layer)=>{
        layer.closePopup();
    });
    dotJsonLayer.eachLayer((layer)=>{
        layer.closePopup();
    });
}
map.on('click', onMapClick);

map.on('moveend', function(e) {
    var z = map.getZoom();
    dotJsonLayer.eachLayer((layer)=>{
        layer.setIcon(L.icon(iconObject(z, layer.feature.properties.type)));//現状アイコンはランダム割り当て(仮)
    });
    if(!trackingUpdated)return;
    var mapcoord=map.getCenter();
    if(mapcoord.lat == trackingUpdated[0] && mapcoord.lng == trackingUpdated[1])return;
    console.log(trackingUpdated);
    console.log(mapcoord);
    locationTracking(false,true);
});