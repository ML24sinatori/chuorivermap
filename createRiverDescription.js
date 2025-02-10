//createMenusより先に読み込む
let moji = riverNameHere.length;
let mojif = riverNameFurigana.length;
let kaigyo = '<br>';
let issmall = 'furiganasmall';
if(moji*15 + mojif*12 < 151){
  tallTitle = false;
  issmall = 'furigana';
}
else if(moji*15+mojif*10 <= 151){
  tallTitle = false;
}

let riverTitleHTML = `<span class="riverTitle">${riverNameHere}</span> ${(tallTitle ? '<br>' : '-')} <span class="${issmall}">${riverNameFurigana}</span>`;

let bunshoHTML = `<span>${bunsho[0]}</span>`;
if(bunsho.length>1){
  bunshoHTML+=`<br>
  <span id="detailBunsho">${bunsho[1]}</span>
  <span id="detailButton" onclick="extendDetail()">▼詳細表示</span>
  `;
}

wantToInsert = `
<div id="riverFeature">
  <div id="riverDescription">
    <div style="display: flex; justify-content: space-between;">
      <span>${riverTitleHTML}</span>
      <button id="descriptionButton" class="smallbtn" onclick="toggleDescription()">説明を表示</button>
    </div>
    
    <p id="allBunsho">
      ${bunshoHTML}
    </p>
    
    <div style="display: flex;">
      <div id="easy-slider">
      </div>
    </div>
  </div>
</div>
`

textSectionSite.insertAdjacentHTML('beforeend',wantToInsert);