const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const totalSlides = slides.length;
const slideWidth = 50; // 1スライドの幅（%）
let currentIndex = 1;


// スライドアニメーション
function animateSlider(startOffset, endOffset) {
  track.style.setProperty('--start-offset', `${startOffset}%`);
  track.style.setProperty('--end-offset', `${endOffset}%`);
  track.style.animation = 'slide 0.5s ease-in-out forwards';
}

function moveToIndex(newIndex) {
  currentIndex = newIndex;
  const offset = -currentIndex * slideWidth;
  track.style.animation = 'none'; // アニメーションを一旦無効化
  track.style.transform = `translateX(${offset}%)`;
}

prevButton.addEventListener('click', () => {
  if (currentIndex === 0) {
    currentIndex = totalSlides - 2; // 最初の実スライドにジャンプ
  }
  moveToIndex(currentIndex);
  setTimeout(() => animateSlider(-(currentIndex + 1) * slideWidth, -currentIndex * slideWidth), 0);
  track.style.animation = 'none';
  currentIndex--;
});

nextButton.addEventListener('click', () => {
  if (currentIndex === totalSlides - 2) {
    currentIndex = 0; // 最初の実スライドにジャンプ
  }
  moveToIndex(currentIndex);
  setTimeout(() => animateSlider(-(currentIndex - 1) * slideWidth, -currentIndex * slideWidth), 0);
  track.style.animation = 'none';
  currentIndex++;
});

// 初期化
moveToIndex(currentIndex);

//モーダル
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');

// モーダルを開く
slides.forEach(slide => {
  slide.addEventListener('click', (e) => {
    modal.style.display = 'flex';
    modalImage.src = e.target.src;
    modalCaption.textContent = captionDict[e.target.alt];
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

