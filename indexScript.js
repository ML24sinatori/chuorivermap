//河川への色分け・表示
var timeSeriesFilter = false;

//河川名から探す
function toggleFilterPanel() {
    const panel = document.getElementById('filterPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    const panel2 = document.getElementById('colorPanel');
    panel2.style.display = 'none';
}
//河川名から探す、を閉じる
function closeFilter() {
    document.getElementById('filterPanel').style.display = 'none';
}

//埋め立て時期から探す
function toggleColorPanel() {
    const panel = document.getElementById('colorPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    const panel2 = document.getElementById('filterPanel');
    panel2.style.display = 'none';
}
//埋め立て時期から探す、を閉じる
function closeColorPanel() {
    document.getElementById('colorPanel').style.display = 'none';
}

// 色分け適用
/*
function applyColorScheme() {
    timeSeriesFilter = document.getElementById('colorByTime').checked;
    geoJsonLayer.eachLayer(layer => {
        let styleList = getColorByTime(layer.feature.properties.time);
        layer.setStyle({
            color: styleList[0]
        })
    });
}*/

function applyColorScheme() {
    timeSeriesFilter = document.getElementById('colorByTime').checked;
    geoJsonLayer.eachLayer(layer => {
      coloringRule(layer);
    });
  }

function checkAll(){
    geoJsonLayer.eachLayer(layer => {
        var elem = document.getElementById(layer.feature.properties.name + layer.feature.properties.time);
        elem.checked = true;
        layer.setStyle({opacity: 1.0, fillOpacity:0.2});
    });
}

function uncheckAll(){
    geoJsonLayer.eachLayer(layer => {
        var elem = document.getElementById(layer.feature.properties.name + layer.feature.properties.time);
        elem.checked = false;
        layer.setStyle({opacity: 0.0, fillOpacity:0.0});
    });
}

function displayRiverUpdate(){
    geoJsonLayer.eachLayer(layer => {
        var elem = document.getElementById(layer.feature.properties.name + layer.feature.properties.time);
        if(elem.checked){
        layer.setStyle({opacity: 1.0, fillOpacity:0.2});
        }
        else{
        //console.log("no"+elem.id+elem.class);
        layer.setStyle({opacity: 0.0, fillOpacity:0.0});
        }
    });
}

function buriedPeriod(elem) {
    geoJsonLayer.eachLayer(layer => {
        if(layer.feature.properties.time == elem.value){
        // 処理をする
            if(elem.checked){
                document.getElementById(layer.feature.properties.name + layer.feature.properties.time).checked = true;
            }
            else{
                document.getElementById(layer.feature.properties.name + layer.feature.properties.time).checked = false;
            }
        }
    });
    displayRiverUpdate();
}

function walkRiver(name){
    resetAll();
    geoJsonLayer.eachLayer(layer => {
        if(layer.feature.properties.name == name){
        layer.openPopup();
        layer.setStyle({ color: 'yellow' });
        }
    });
}

// 絞り込み、リセット、全河川表示などの他の関数

function resetFilter() { /* ... */ }
function resetAll() {
    timeSeriesFilter = false;
    var boxes = document.getElementsByClassName('defaultChecked');
    for(elem of boxes){
        elem.checked = true;
    };
    var boxes2 = document.getElementsByClassName('defaultUnchecked');
    for(elem of boxes2){
        elem.checked = false;
    };
    geoJsonLayer.eachLayer(layer => {
        layer.closePopup();
        layer.setStyle({color: 'blue', opacity: 1.0, fillOpacity: 0.2});
    });
    displayRiverUpdate();

    if(!isSightDisplayed)toggleSight();
}

// 位置情報取得などの他の関数
function getLocation() { /* ... */ }
