document.addEventListener("DOMContentLoaded", function() {

    // サイトが開いたときに実行する関数
    function onSiteLoad() {
        //alert("サイトが読み込まれました");
        //alert(window.innerHeight);
        //alert(window.innerWidth);
        document.documentElement.scrollWidth
        window.scrollTo({
            top:  ((document.documentElement.scrollHeight - window.innerHeight)/2),
            left: ((document.documentElement.scrollWidth  - window.innerWidth )/2),
            behavior: "smooth"
        });
    }

    // 関数を実行
    onSiteLoad();
});



function updateElementPosition() {
    // 要素を取得
    var element = document.getElementById('myElement');
    
    // 要素の位置を取得
    var rect = element.getBoundingClientRect();

    // scale()を考慮する
    var x = (-1)*rect.left + window.innerWidth / 2
    var y = (-1)*rect.top + window.innerHeight / 2
    x = Math.round(x / zoomlevel);
    y = Math.round(y / zoomlevel);
    
    // 要素の位置をコンソールに出力
    //console.log('要素の位置:');
    //console.log('上からの距離 (top):', rect.top);
    //console.log('左からの距離 (left):', rect.left);
    //console.log('下からの距離 (bottom):', rect.bottom);
    //console.log('右からの距離 (right):', rect.right);
    //console.log('幅 (width):', rect.width);
    //console.log('高さ (height):', rect.height);

    // 取得した座標を表示
    document.getElementById('coordinates2').textContent = "Your coordinates: (" + x + ", " + y + ")";

    // 「今表示されている画面の中心」を取得
    let centerX = window.scrollX + window.innerWidth / 2;
    let centerY = window.scrollY + window.innerHeight / 2;

    // bodyにtransformとtransform-originを設定
    document.body.style.transformOrigin = `${centerX}px ${centerY}px`;

    // scale()を使うとposition:fixed;の挙動がおかしくなる(包含ブロックが変わるせい)ので、位置を移動するたびにcoordinatesの位置も移動させる あと大きさも一定になるように変える
    let coo = document.getElementById('coordinates2');
    coo.style.fontSize = `${10 / zoomlevel}px`;
    coo.style.padding = `${5 / zoomlevel}px`;
    coo.style.width = `${170 / zoomlevel}px`;
    coo.style.borderRadius = `${5 / zoomlevel}px`;
    coo.style.left = `${centerX - window.innerWidth / (zoomlevel * 2)}px`; // - で左端 (+なら右端)
    coo.style.top = `${centerY + window.innerHeight / (zoomlevel * 2) - coo.offsetHeight - 10 / zoomlevel}px`; // - で上端 (+なら下端)
}

// ページが読み込まれたときに位置を更新
document.addEventListener('DOMContentLoaded', updateElementPosition);

// スクロールイベントで位置を更新
window.addEventListener('scroll', updateElementPosition);

// リサイズイベントで位置を更新
window.addEventListener('resize', updateElementPosition);



// クリック&ドラッグでの移動
let isDragging = false;
let startX = 0, startY = 0;
let scrollLeft = 0, scrollTop = 0;

let totalScroll = 0;
let zoomlevel = 1;

// ドラッグ開始
document.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  scrollLeft = window.scrollX;
  scrollTop = window.scrollY;
});

// ドラッグ中
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = startX - e.clientX;
  const deltaY = startY - e.clientY;
  // scale()による移動量の変化を考慮する
  window.scrollTo(scrollLeft + deltaX / zoomlevel, scrollTop + deltaY / zoomlevel);
});

// ドラッグ終了
document.addEventListener('mouseup', () => {
    isDragging = false;
});



// マウスホイールでのスクロールによる拡大縮小
document.addEventListener('wheel', function(event) {
    // deltaYを336*10で割って加算(336は俺のマウスホイールのノッチ1つ分でのevent.deltaYの値(実測値))
    totalScroll += event.deltaY / 3360;

    // zoomlevelをeの-totalScroll乗にする 人間工学?
    zoomlevel = Math.exp(-totalScroll);

    //console.log('Total Scroll:', totalScroll);
    console.log('Zoom Level:', zoomlevel);

    /*
    zoom中心となるdocument.body.style.transformOriginの更新はここではなくupdateElementPosition関数内に書いた。
    なぜなら

    // スクロールイベントで位置を更新
    window.addEventListener('scroll', updateElementPosition);

    // リサイズイベントで位置を更新
    window.addEventListener('resize', updateElementPosition);
    
    と書いておいているからupdateElementPositionの中のほうがいい
    (この関数内でOriginの更新をすると変な挙動になった)
    */

    // zoomプロパティを使えば簡単かもしれないし、綺麗になるかもしれない(実際に綺麗に拡大縮小される)
    // しかし欠点として、origin(拡大するときの中心)をページの左上から変えられない
    // なので仕方なくscale()を使っている。そのせいでいろんなところを動かすたびに変えないといけない
    
    document.body.style.transform = `scale(${zoomlevel})`;

    updateElementPosition();
});


// scale()を使うと<a>によるサイト内の移動がおかしくなるのでそれ用の関数
document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();  // デフォルトのリンク動作を防止

        const targetId = this.getAttribute('href');  // クリックされたリンクのhref属性
        const targetElement = document.querySelector(targetId);  // 対象の要素を取得

        if (targetElement) {
            // 目標の要素が存在する場合、スクロール位置を補正
            const targetRect = targetElement.getBoundingClientRect();
            
            // targetRectが返すtop,leftは現在のビューポートからの相対位置なのでscrollBy
            window.scrollBy({
                left: (targetRect.left + targetRect.width / 2 - window.innerWidth / 2) / zoomlevel,
                top: (targetRect.top - 40) / zoomlevel,
                behavior: 'smooth'  // スムーズスクロール
            });
        }
    });
});
