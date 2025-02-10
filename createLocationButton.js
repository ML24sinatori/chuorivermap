document.body.insertAdjacentHTML('beforeend',`
    <div id="locationAlert"></div>
    <button id="toggleButton" onclick="toggleSight()"><img src="icon/spot.png" style="max-width: 5vh;"></button>
    <button id="locationButton" onclick="locationTracking()"><img src="icon/cross.png" style="max-width: 5vh;"></button>
`);
let message = document.getElementById('locationAlert');
let sightbtn = document.getElementById('toggleButton');
let locbtn = document.getElementById('locationButton');

//現在位置を取得
var anySightDisplayed = false;
var isTracking = false;

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
var watchID;

function finishTracking(alert=true){
    moveCounter=0;
    navigator.geolocation.clearWatch(watchID);
    if(urHere)map.removeLayer(urHere);
    urHere = null;
    trackingUpdated = null;
    pushStyle(locbtn, false, false);
    if(alert)showAlert('追従を解除');
}
function startTracking(){
    watchID = navigator.geolocation.watchPosition((position) => {
        var pos = [position.coords.latitude, position.coords.longitude];
        if(nanseiBound[0]<=pos[0] && pos[0]<=hokutoBound[0] && nanseiBound[1]<=pos[1] && pos[1]<=hokutoBound[1]){
            moveCounter=1;
            //OK
            if(!trackingUpdated){
                showAlert('現在地を追従');
            }
            trackingUpdated = pos;
            pushStyle(locbtn, false, true);
            map.setView(pos);
            if(urHere)map.removeLayer(urHere);
            urHere=L.marker(pos,{
                icon: L.icon(iconObject(map.getZoom(),'現在地')),
                interactive: false
            }).addTo(map);
        }
        else{
            showAlert('中央区から遠すぎます');
            finishTracking(false);
            return;
        }
    });
}

function locationTracking(){
    if(trackingUpdated){
        finishTracking();
    }
    else{
        startTracking();
    }
    isTracking = !isTracking;
    pushStyle(locbtn,true,Boolean(trackingUpdated));
    setTimeout(()=>{pushStyle(locbtn,false,Boolean(trackingUpdated));},100);
}