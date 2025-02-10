// テキストセクションの構造
// まず、個別河川か ? true->説明文が来る : false->何も来ない
// 続いて、「詳細設定」などが来る。その詳細設定を作るのがここ

let allRiverFlag = (riverNameHere == 'all')

let allRiverButtonHTML =
`
<form action="index.html" method="get">
  <button type="submit" id="returnButton" class="largebtn">全河川表示に戻る</button>
</form>
`

let filterHTML =
`
<details id="controlPanel"><summary class="showDetails">詳細な表示設定</summary>
  <div id="innerControlPanel">
  ${(allRiverFlag ? `
    <span class="filterTitle">河川の絞り込み</span>
    <button class="btn" onclick="toggleFilterPanel()">河川名から</button>
    <button class="btn" onclick="toggleColorPanel()">埋め立て時期から</button>
    <button class="btn" onclick="resetRiver()">初期表示に戻す</button>` : ''
    //全河川表示の場合はこれらのフィルタを表示する
  )}
  <span class="filterTitle">スポットの絞り込み</span>
  <label><input type="checkbox" class="sightType" id="橋" unchecked onclick="displaySightUpdate()">橋</label>
  <label><input type="checkbox" class="sightType" id="博物館等" unchecked onclick="displaySightUpdate()">博物館等</label>
  <label><input type="checkbox" class="sightType" id="others" unchecked onclick="displaySightUpdate()">史跡等</label>
  ${(allRiverFlag ? '' :
    '<label><input type="checkbox" id="difriver" unchecked onclick="nearRiver()">他の河川の周辺も表示</label>'
  )}
  </div>
</details>
`

let readmeButtonHTML = `
<form action="https://github.com/ML24sinatori/chuorivermap/blob/main/README.md" method="get">
  <button type="submit" class="largebtn">利用規約</button>
</form>
`

wantToInsert = (allRiverFlag ? '' : allRiverButtonHTML) + filterHTML + readmeButtonHTML;
textSectionSite.insertAdjacentHTML('beforeend',wantToInsert);