/*
<div id="locationAlert"></div>
<button id="toggleButton" onclick="toggleSight()"><img src="icon/spot.png" style="max-width: 5vh;"></button>
<button id="locationButton" onclick="locationTracking()"><img src="icon/cross.png" style="max-width: 5vh;"></button>

のように、観光地一括表示ボタン・現在位置の表示ボタンと、それに付随して発生する警告文を表示するのが目的

*/

let message = document.createElement('div');
message.setAttribute('id','locationAlert');

let sightbtn=document.createElement('button');
sightbtn.setAttribute('id','toggleButton');
sightbtn.setAttribute('onclick','toggleSight()');
let sightbtnImage=document.createElement('img');
sightbtnImage.setAttribute('src','icon/spot.png');
sightbtnImage.setAttribute('style','max-width: 5vh;');
sightbtn.appendChild(sightbtnImage);

let locbtn=document.createElement('button');
locbtn.setAttribute('id','locationButton');
locbtn.setAttribute('onclick','locationTracking()');
let locbtnImage=document.createElement('img');
locbtnImage.setAttribute('src','icon/cross.png');
locbtnImage.setAttribute('style','max-width: 5vh;');
locbtn.appendChild(locbtnImage);

document.body.appendChild(message);
document.body.appendChild(sightbtn);
document.body.appendChild(locbtn);

//現在位置を取得
var anySightDisplayed = false;
var isTracking = false;
var watchID;

function pushStyle(btnelem, pushing, nowon){
    var col;
    if(nowon){
        col='rgb(152, 80, 58)';
        btnelem.style.backgroundColor='orange';
    }
    else{
        col='rgb(59, 120, 144)';
        btnelem.style.backgroundColor='skyblue';
    }

    if(pushing){
        btnelem.style.boxShadow='0 2px 0 ' + col;
        btnelem.style.transform='translate(0, 3px)';
    }
    else{
        btnelem.style.boxShadow='0 5px 0 ' + col;
        btnelem.style.transform='translate(0, 0)';
    }
}

function toggleSight(showmessage = true){
    anySightDisplayed = !anySightDisplayed;
    var elems = document.getElementsByClassName('sightType');
    for(let i = 0;i < elems.length; i++){
        elems[i].checked = anySightDisplayed;
    }
    displaySightUpdate(true);
    pushStyle(sightbtn, true, anySightDisplayed);
    setTimeout(()=>{pushStyle(sightbtn,false,anySightDisplayed);},100);

    if(!showmessage)return;

    if(anySightDisplayed)showAlert('観光地を全表示');
    else showAlert('観光地を非表示');
}


// locbtn.addEventListener('mousedown',(e)=>{
//     pushStyle(locbtn,true,isTracking);
// });

// locbtn.addEventListener('click',(e)=>{
//     pushStyle(locbtn,false,isTracking);
// });


function displaySightUpdate(thruSightButton = false){
    var btcheck = false;
    dotJsonLayer.eachLayer((layer)=>{
        var elem = document.getElementById(layer.feature.properties.type);
        if(!elem){
            elem=document.getElementById('others');
        }
        if(elem.checked){
            btcheck = true;
            map.addLayer(layer);
        }
        else{
            map.removeLayer(layer);
        }
    });
    if(thruSightButton)return;
    if(anySightDisplayed == btcheck)return;
    anySightDisplayed=btcheck;
    
    pushStyle(sightbtn,true,anySightDisplayed);
    setTimeout(()=>{pushStyle(sightbtn,false,anySightDisplayed);},100);
}

let transparency = 0;
function showAlert(messageContent) {
    message.style.transition='opacity 0.5s';
    message.textContent = messageContent;
    message.style.opacity = '1';
    message.style.padding = '10px';

    // 文字をフェードアウトさせる
    transparency++;
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            transparency--;
            if(transparency == 0){
                message.style.padding = 'none';
                message.style.transition = 'none';
                message.textContent = '';
            }
        }, 1000);
    }, 1000);
}
var urHere;
var trackingUpdated = null;
function locationTracking(disabled = false, hidealert = false){
    if(disabled)return;
    if(isTracking){
        navigator.geolocation.clearWatch(watchID);
        if(urHere)map.removeLayer(urHere);
        urHere = null;
        trackingUpdated = null;
        if(!hidealert)showAlert('追従を解除');
    }
    else{
        watchID = navigator.geolocation.watchPosition((position) => {
            var pos = [position.coords.latitude, position.coords.longitude];
            trackingUpdated = pos;
            map.setView(pos);
            if(urHere)map.removeLayer(urHere);
            urHere=L.marker(pos,{
                icon: L.divIcon({
                    html: '',
                    className:'pinIcon',
                    iconAnchor: [10 / 2, 10 / 2], // point of the icon which will correspond to marker's location
                    iconSize: [10, 10]}),
                interactive: false
            }).addTo(map);
        });
        showAlert('現在地を追従');
    }
    isTracking = !isTracking;
    pushStyle(locbtn,true,isTracking);
    setTimeout(()=>{pushStyle(locbtn,false,isTracking);},100);
}