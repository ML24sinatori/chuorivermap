let geoJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/chuorivermap/smartphone/CHUORIVER.geojson';
let dotJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/chuorivermap/smartphone/CHUORIVERDOT.geojson';

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
    console.log(str);
    return str.replace('-','');
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

//モーダル
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');
const modalCaptionDetail = document.getElementById('modalCaptionDetail');

function modalOpen(num,title){
    modal.style.display = 'flex';
    modalImage.src = 'img/'+num+'.JPG';
    modalCaption.textContent = title + (num[0]!='0' ? "（サイト管理者撮影）":"（中央区立京橋図書館所蔵）");
    modalCaptionDetail.textContent = "";
}

// モーダルを閉じる
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === modalClose) {
    modal.style.display = 'none';
    }
});

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
                setContentHTML+=`<br><img class="popupImg" src="img/${imageNumber}.JPG" alt="${imageTitle}" onclick="modalOpen(${"'"+imageNumber+"','"+imageTitle+"'"})">`;
            }
            console.log(setContentHTML);
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

var bridgeDict={
    "001700597":["白魚橋"],
    "001700600":["松幡橋"],
    "001700606":["海運橋"],
    "001700765":["朝日橋"],
    "001700776":["荒布橋"],
    "001700778":["永久橋"],
    "001700782":["今川橋"],
    "001700812":["親父橋"],
    "001700826":["女橋"],
    "001700830":["鍛冶橋"],
    "001700831":["蛎浜橋"],
    "001700864":["兜橋"],
    "001700865":["紀伊国橋"],
    "001701214":["新幸橋"],
    "001701362":["川口橋"],
    "001701374":["呉服橋"],
    "001701378":["桜橋"],
    "001701380":["思案橋"],
    "001701398":["新橋"],
    "001701412":["新場橋"],
    "001701413":["新場橋"],
    "001701415":["有楽橋"],
    "001701423":["数寄屋橋"],
    "001701430":["千代田橋"],
    "001701441":["土州橋"],
    "001701445":["三吉橋"],
    "001701702":["丸ノ内橋"],
    "001701718":["八重洲橋"],
    "001701731":["新桜橋"],
    "001701843":["暁橋"],
    "001701988":["龍閑橋"],
    "001702863":["新永久橋"],
    "001703229":["新橋"],
    "001703375":["新京橋"],
    "001703377":["城辺橋"],
    "001703381":["炭屋橋"],
    "001989460":["火除橋"],
    "001989463":["甚兵衛橋"],
    "001989481":["新川橋(二ノ橋)"],
    "001989483":["三ノ橋"],
    "001989488":["萬橋"],
    "002265814":["柳原橋"],
    "002265820":["岩井橋"],
    "002265823":["大和橋"],
    "002265825":["橋本橋"],
    "002265827":["緑橋"],
    "002265830":["千鳥橋"],
    "002265842":["栄橋"],
    "002266094":["明治橋"],
    "002266097":["小川橋"],
    "002266112":["箱崎橋"],
    "002266184":["菖蒲橋"],
    "002266363":["千代橋"],
    "002266376":["千代田橋"],
    "002266378":["備前橋"],
    "002266402":["起生橋"],
    "002266405":["木挽橋"],
    "002266407":["豊玉橋"],
    "002266751":["三原橋"],
    "002266762":["萬年橋"],
    "002266773":["難波橋"],
    "002267197":["親父橋"],
    "002267198":["兜橋"],
    "002267212":["門跡橋"],
    "002267242":["東新川橋"],
    "002267248":["土橋"],
    "002267269":["弾正橋"],
    "002267279":["鞍掛橋"],
    "002267653":["采女橋"],
    "002267683":["蓬莱橋"],
    "002267702":["開国橋"],
    "002267707":["尾張橋"],
    "002268243":["京橋"],
    "002630084":["築地橋"],
    "002668226":["男橋"],
};