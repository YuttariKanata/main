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

    var x = Math.round((-1)*rect.left)
    var y = Math.round((-1)*rect.top)
    
    
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
}

// ページが読み込まれたときに位置を更新
document.addEventListener('DOMContentLoaded', updateElementPosition);

// スクロールイベントで位置を更新
window.addEventListener('scroll', updateElementPosition);

// リサイズイベントで位置を更新
window.addEventListener('resize', updateElementPosition);

