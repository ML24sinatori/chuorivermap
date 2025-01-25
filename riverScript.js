document.title=riverNameHere+'を歩く';

function insertImageAndCaption(){
  const slider = document.getElementById('easy-slider');

  Object.entries(capTextDict).forEach(([key,value])=>{
    const newImgDiv=document.createElement('div');
    newImgDiv.setAttribute('class','slide');
    const newImg=document.createElement('img');
    newImg.setAttribute('src','img/'+key+'.JPG');
    newImg.setAttribute('alt',value[0]);

    newImg.addEventListener('click', (e) => {
      modal.style.display = 'flex';
      modalImage.src = 'img/'+key+'.JPG';
      modalCaption.textContent = value[0] + (key[0]!='0' ? "（サイト管理者撮影）":"（中央区立京橋図書館所蔵）");
      modalCaptionDetail.textContent = value[1];
    });

    newImgDiv.appendChild(newImg);
    slider.appendChild(newImgDiv);
  });
}
insertImageAndCaption();

var isDetailOpened = false;
var isDescriptionOpened = true;
const riverDescription=document.getElementById('riverDescription');
const descriptionButton=document.getElementById('descriptionButton');
const detailButton = document.getElementById('detailButton');
const detailBunsho = document.getElementById('detailBunsho');

function toggleDescription(){
  if(isDescriptionOpened){
    isDescriptionOpened=false;
    if(tallTitle)riverDescription.style.height='calc(2.5em + 20px)';
    else riverDescription.style.height='calc(1.5em + 10px)';
    descriptionButton.textContent='説明を表示';
  }
  else{
    isDescriptionOpened=true;
    riverDescription.style.height='auto';
    descriptionButton.textContent='説明を畳む';
  }
}
toggleDescription();

function extendDetail(){
  if(isDetailOpened){
    isDetailOpened = false;
    detailButton.textContent = '▼詳細表示';
    detailBunsho.style.display = 'none';
  }
  else{
    isDetailOpened = true;
    detailButton.textContent = '▲短く表示';
    detailBunsho.style.display = 'inherit';
  }
}

let otherRiverFlag = false;
function nearRiver(){
  otherRiverFlag = !otherRiverFlag;
  if(otherRiverFlag){
    dotJsonLayer.eachLayer((layer)=>{
      layer.setOpacity(1.0);
    });
  }
  else{
    dotJsonLayer.eachLayer((layer)=>{
      if(riverInProperties(riverNameHere,feature.properties.river))layer.setOpacity(1.0);
      else layer.setOpacity(0.2);
    });
  }
}