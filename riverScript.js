document.title=riverNameHere+'を歩く';

function insertImageAndCaption(){
  const slider = document.getElementById('easy-slider');
  Object.entries(capTextDict).forEach(([key,value])=>{
    const newImgDiv=document.createElement('div');
    newImgDiv.setAttribute('class','slide');
    const newImg=document.createElement('img');
    newImg.setAttribute('src','img/'+key+'.jpg');
    newImg.setAttribute('data-srcnumber',key);
    if(key[0]!='0')newImg.setAttribute('data-ours',true);
    newImg.setAttribute('alt',value[0]);

    newImgDiv.appendChild(newImg);
    slider.appendChild(newImgDiv);
  });
}
insertImageAndCaption();

const slides = document.querySelectorAll('.slide');

//モーダル
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');
const modalCaptionDetail = document.getElementById('modalCaptionDetail');

// モーダルを開く
slides.forEach(slide => {
  slide.addEventListener('click', (e) => {
    modal.style.display = 'flex';
    modalImage.src = e.target.src;
    modalCaption.textContent = e.target.alt + (e.target.dataset.ours ? "(サイト管理者撮影)":"(中央区立京橋図書館所蔵)");
    modalCaptionDetail.textContent = capTextDict[e.target.dataset.srcnumber][1];
  });
});

// モーダルを閉じる
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target === modalClose) {
    modal.style.display = 'none';
  }
});

var isOpened = false;
const detailButton = document.getElementById('detailButton');
const detailBunsho = document.getElementById('detailBunsho');
function extendDetail(){
  if(isOpened){
    isOpened = false;
    detailButton.textContent = '▼詳細表示';
    detailBunsho.style.display = 'none';
  }
  else{
    isOpened = true;
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