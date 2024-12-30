/*

<div id="locationAlert"></div>
<button id="locationButton" onclick="locationTracking(false)">📍</button>

のように、現在位置の表示ボタンと、それに付随して発生する警告文を表示するのが目的

*/

let message = document.createElement('div');
message.setAttribute('id','locationAlert');

let locbtn=document.createElement('button');
locbtn.setAttribute('id','locationButton');
locbtn.setAttribute('onclick','locationTracking(false)');
locbtn.textContent='📍';
document.body.appendChild(message);
document.body.appendChild(locbtn);

//現在位置を取得
var isTracking = false;
var watchID;

function hoverStyle(hovering){
    var col;
    if(isTracking){
        col='rgb(152, 80, 58)';
        locbtn.style.backgroundColor='orange';
    }
    else{
        col='rgb(59, 120, 144)';
        locbtn.style.backgroundColor='skyblue';
    }

    if(hovering){
        locbtn.style.boxShadow='0 2px 0 ' + col;
        locbtn.style.transform='translate(0, 3px)';
    }
    else{
        locbtn.style.boxShadow='0 5px 0 ' + col;
        locbtn.style.transform='translate(0, 0)';
    }
}

locbtn.addEventListener('mousedown',(e)=>{
    hoverStyle(true);
});

locbtn.addEventListener('click',(e)=>{
    hoverStyle(false);
});

function showAlert(messageContent) {
    message.textContent = messageContent;
    message.style.opacity = '1';
    message.style.padding = '10px';
    locbtn.setAttribute('onclick','locationTracking(true)');

    // 文字をフェードアウトさせる
    setTimeout(() => {
        message.style.transition='opacity 1s';
        message.style.opacity = '0';
        setTimeout(() => {
            message.style.padding = 'none';
            message.style.transition='none';
            locbtn.setAttribute('onclick','locationTracking(false)');
            message.textContent = '';
        }, 1000);
    }, 1000);
}
var urHere;
function locationTracking(disabled){
    if(disabled){
        hoverStyle(true);
        return;
    }
    if(isTracking){
        navigator.geolocation.clearWatch(watchID);
        if(urHere)map.removeLayer(urHere);
        urHere = null;
        showAlert('追従を解除');
    }
    else{
        watchID = navigator.geolocation.watchPosition((position) => {
            var pos = [position.coords.latitude, position.coords.longitude];
            map.setView(pos);
            if(urHere)map.removeLayer(urHere);
            urHere=L.marker(pos,{
                icon: L.divIcon({
                    html: '●',
                    className:'pinIcon',
                    iconAnchor:   [50 / 2, 50 / 2], // point of the icon which will correspond to marker's location
                    iconSize: [50, 50]}),
                interactive: false
            }).addTo(map);
        });
        showAlert('現在地を追従');
    }
    isTracking = !isTracking;
    hoverStyle(true);
}