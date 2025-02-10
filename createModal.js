wantToInsert =
'<span id="modalClose">&times;</span>\
<img id="modalImage" alt="拡大写真">\
<p id="modalCaption"></p>\
<p id="modalCaptionDetail"></p>';

modalSite.insertAdjacentHTML('beforeend',wantToInsert);

//モーダル
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');
const modalCaptionDetail = document.getElementById('modalCaptionDetail');

function modalOpen(num,title){
    modalSite.style.display = 'flex';
    modalImage.src = 'https://kawalbum.sakura.ne.jp/img/'+num+'.JPG';
    modalCaption.textContent = title + (num[0]!='0' ? "（サイト管理者撮影）":"（写真提供：中央区立京橋図書館）");
    modalCaptionDetail.textContent = "";
}

// モーダルを閉じる
modalSite.addEventListener('click', (e) => {
    if (e.target === modalSite || e.target === modalClose) {
        modalSite.style.display = 'none';
    }
});