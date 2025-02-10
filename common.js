//地図の読み込み(座標は河川ごと)
var map = L.map('map').setView(defaultPlace, defaultZ);
//L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
}).addTo(map);
map.setMaxBounds([nanseiBound,hokutoBound]);

L.control.scale({
    imperial: false,
    metric: true
}).addTo(map);
map.zoomControl.setPosition("bottomleft");

//河川の着色ルール
var timeSeriesFilter = false;
function coloringRule(thisLayer) {
    let time = thisLayer.feature.properties.time;
    let name = thisLayer.feature.properties.name;
    if(riverNameHere != 'all'){
        if(eraseNumber(name)==riverNameHere){
            thisLayer.setStyle({color: 'blue', fillOpacity: 0.2});
        }
        else if(time=='現存'){
            thisLayer.setStyle({color: 'aqua', opacity: 0, fillOpacity: 0});
        }
        else{
            thisLayer.setStyle({color: 'aqua', fillOpacity: 0.1});
        }
        return;
    }
    if(time=='現存'){
        thisLayer.setStyle({color: 'aqua', opacity: 0, fillOpacity: 0});
        return;
    }
    var elem = document.getElementById(name+time);
    if(!elem.checked){
        thisLayer.setStyle({color: 'aqua', opacity: 0, fillOpacity:0});
        return;
    }
    let col;
    if(!timeSeriesFilter)col='blue';
    else if(time === '震災復興まで')col = 'red';
    else if(time === '戦災復興まで')col = 'purple';
    else if(time === '東京オリンピックまで')col = 'black';
    else col = 'orange';
    //switch-case文にすると動かない？
    thisLayer.setStyle({color:col,opacity: 1.0, fillOpacity: 0.2});
}

function eraseNumber(str){
    return str.split('-')[0];
}
function eraseHyphen(str){
    return str.replace('-','');
}

//河川のオーバーレイ
let geoJsonLayer;
fetch(geoJsonURL)
.then(response => response.json())
.then(data => {
    var riverList = document.getElementById('allRiver');
    geoJsonLayer = L.geoJSON(data, {
        style : { weight: 2 },
        onEachFeature: (feature, layer) => {
            var riverName = feature.properties.name;
            var riverRomaji = feature.properties.romaji;
            var riverTime = feature.properties.time;
            var riverEra = feature.properties.era;
            
            if(riverNameHere == 'all'){
                //全河川表示の時は色分け
                var river = document.createElement('input');
                river.type = 'checkbox';
                river.checked = true;
                river.setAttribute('value', riverName);
                river.setAttribute('id', riverName + riverTime);

                if(riverTime == '現存'){
                    river.setAttribute('disabled', "");
                }
                else{
                    river.setAttribute('class','defaultChecked');
                    river.setAttribute('onclick','displayRiverUpdate()');
                }

                var riverLabel = document.createElement('label');
                riverLabel.appendChild(river);
                riverLabel.appendChild(document.createTextNode(eraseHyphen(riverName)));
                riverList.appendChild(riverLabel);
            }

            var setContentHTML = `<b>河川名:</b> ${eraseHyphen(riverName)}<br> <b>埋め立て時期:</b> ${(riverEra == null ? riverTime : riverEra)}`;
            if(riverTime != '現存'){
                setContentHTML += `<br>
                <form action="${riverRomaji}.html" method="get">
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
                layer.setStyle({color: 'yellow', opacity: 1.0, fillOpacity:0.2});
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
    if(iconType == '橋')newIconUrl='icon/bridge.png';
    else if(iconType == '博物館等')newIconUrl='icon/museum.png';
    else if(iconType == '現在地')newIconUrl='icon/maru.png';
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

function riverInProperties(searchName,setOfName){
    return setOfName.split('/').includes(searchName);
}

//観光地の表示
let dotJsonLayer;
fetch(dotJsonURL)
.then(response => response.json())
.then(data => {
    dotJsonLayer = L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            var setContentHTML=feature.properties.name;
            if(feature.properties.time){
                var timeList=feature.properties.time.split('/');

                if(timeList.length==1) setContentHTML+=`<br>時期：${timeList[0]}`;
                else setContentHTML+=`<br>時期：${timeList[0]}～${timeList[timeList.length-1]}`;
            }
            var imageNumber=feature.properties.image;
            var imageTitle=feature.properties.title;
            if(imageNumber){
                setContentHTML+=`<br><img class="popupImg" src="https://kawalbum.sakura.ne.jp/img/${imageNumber}.JPG" alt="${imageTitle}" onclick="modalOpen(${"'"+imageNumber+"','"+imageTitle+"'"})">`;
            }
            var newpopup = L.popup({
                closeOnClick: false,
                autoClose: false
            }).setContent(setContentHTML);
            
            var newMarker = layer.addTo(map);
            newMarker.setIcon(L.icon(iconObject(map.getZoom(),feature.properties.type)));
            if(riverNameHere != 'all' && !riverInProperties(riverNameHere,feature.properties.river)){
                newMarker.setOpacity(0.2);
            }
            newMarker.bindPopup(newpopup);

            // newMarker.getPopup().on('remove', function() {
            // });
            
            // layer.on('click', function() {
            // });
            
            layer.on('dblclick', function() {
                layer.closePopup();
            });
        }
    });
    if(riverNameHere != 'all')toggleSight(false);
    else displaySightUpdate(true);
});

let moveCounter = 0;

map.on('moveend', function(e) {
    var z = map.getZoom();
    dotJsonLayer.eachLayer((layer)=>{
        layer.setIcon(L.icon(iconObject(z, layer.feature.properties.type)));
    });
    if(trackingUpdated){
        moveCounter--;
        if(moveCounter<0)finishTracking();
    }
    else moveCounter=0;
});
map.on('click', function(e) {
    geoJsonLayer.eachLayer((layer)=>{
        layer.closePopup();
    });
    dotJsonLayer.eachLayer((layer)=>{
        layer.closePopup();
    });
});