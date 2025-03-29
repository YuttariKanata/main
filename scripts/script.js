document.addEventListener('DOMContentLoaded', function() {

    // サイトが開いたときに実行する関数
    function onSiteLoad() {
        //alert("サイトが読み込まれました");
        //alert(window.innerHeight);
        //alert(window.innerWidth);

        window.scrollTo({
            top:  ((document.documentElement.scrollHeight - window.innerHeight)/2),
            left: ((document.documentElement.scrollWidth  - window.innerWidth )/2),
            behavior: "smooth"
        });
    }

    // 関数を実行
    onSiteLoad();
});



// mediatype true:PCなど false:スマホなど
let mediatype=false;
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        mediatype = true;
        zoomlevel = 1;
    }else{
        mediatype = false;
        zoomlevel = window.innerWidth / 1000;
        
    }
    console.log('mediatype:', mediatype);
    console.log('zoomlevel:', zoomlevel);
    console.log('wd',window.innerWidth);

    document.body.style.transform = `scale(${zoomlevel})`;
});


function updateElementPosition() {
    // 要素を取得
    var element = document.getElementById('myElement');
    
    // 要素の位置を取得
    var rect = element.getBoundingClientRect();

    // scale()を考慮する
    var x;
    var y;
    if (mediatype) {
        x = (-1)*rect.left + window.innerWidth / 2;
        y = (-1)*rect.top + window.innerHeight / 2;
        x = Math.round(x / zoomlevel);
        y = Math.round(y / zoomlevel);
    } else {
        x = (-1)*rect.left + window.innerWidth / 2;
        y = (-1)*rect.top + window.innerHeight / 2;
    }

    
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

    if (mediatype) {// for PC
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
    if (mediatype) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = window.scrollX;
        scrollTop = window.scrollY;
    }
});

// ドラッグ中
document.addEventListener('mousemove', (e) => {
    if (mediatype) {
        if (!isDragging) return;
        const deltaX = startX - e.clientX;
        const deltaY = startY - e.clientY;
        // scale()による移動量の変化を考慮する
        window.scrollTo(scrollLeft + deltaX / zoomlevel, scrollTop + deltaY / zoomlevel);
    }
});

// ドラッグ終了
document.addEventListener('mouseup', () => {
    if (mediatype) {
        isDragging = false;
    }
});



// マウスホイールでのスクロールによる拡大縮小
document.addEventListener('wheel', function(event) {
    if (mediatype) {
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
    } 
});


// scale()を使うと<a>によるサイト内の移動がおかしくなるのでそれ用の関数
document.addEventListener('DOMContentLoaded', () => {
    // `mediatype` が true なら実行（PC でのみ）
    if (!mediatype) return;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});


// 表に行を追加する関数
function addRow(key, value) {
    const table = document.getElementById("infoTable").querySelector("tbody");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${key}</td><td>${value}</td>`;
    table.appendChild(row);
}

// 既存の情報を更新する関数
function updateRow(label, value) {
    let table = document.getElementById("dataTable").querySelector("tbody"); // 表を取得
    let row = document.getElementById(label); // IDで既存の行を探す

    if (row) {
        // 既存の行があれば、値を更新
        row.querySelector('.value').textContent = value;
    } else {
        // 行がなければ、新しく作成して追加
        const newRow = document.createElement("tr");
        newRow.id = label; // 行にラベルをIDとして使用
        newRow.innerHTML = `<td>${label}</td><td class="value">${value}</td>`;
        table.appendChild(newRow);
    }
}


// ぜんぶのじょうほう
function get_your_all_information() {

    // 変更された#data2のスタイルを設定
    const data2Element = document.getElementById('data2');
    data2Element.style.height = '4000px';
    data2Element.style.top = '11850px';

    // get your all infoボタンを消す
    const oldbutton = data2Element.querySelector('.getInfo');
    if (oldbutton) {
        oldbutton.remove();
    }

    // 新しい<h2>要素を作成
    const newH2 = document.createElement('h2');
    newH2.innerHTML = `
        <button class="reflect_button" onclick="getGeolocation()">Reflects location information</button>
        <button class="reflect_button" onclick="get_camera_info()">Reflects camera information</button>`;
    // 新しい<h2>を#data2に追加
    data2Element.appendChild(newH2);

    

    // 1. デバイス・ブラウザ情報を取得
    addRow("User Agent", navigator.userAgent);
    addRow("Platform (OS)", navigator.platform);
    const userAgent = navigator.userAgent.toLowerCase();
    let deviceType = "PC";

    if (/mobile/i.test(userAgent)) {
    deviceType = "smart phone";
    } else if (/tablet/i.test(userAgent)) {
    deviceType = "tablet";
    }
    addRow("Device Type", deviceType);
    addRow("Language", navigator.language);
    addRow("Languages", navigator.languages.join(", "));
    addRow("Device Memory (GB)", navigator.deviceMemory);
    addRow("Screen Size", `${screen.width}x${screen.height}`);
    addRow("Color Depth", screen.colorDepth);
    addRow("Touch Points", navigator.maxTouchPoints);
    addRow("Pointer (Coarse)", window.matchMedia("(pointer: coarse)").matches ? 'Yes' : 'No');
    addRow("Pointer (Fine)", window.matchMedia("(pointer: fine)").matches ? 'Yes' : 'No')


    // 2. ネットワーク情報を取得
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        addRow("Network Type", connection.effectiveType || "Unknown");
        addRow("Downlink (Mbps)", connection.downlink || "Unknown");
        addRow("RTT (ms)", connection.rtt || "Unknown");
    } else {
        addRow("Network Info", "Not supported");
    }

    // WebRTCでローカルIPを取得 (ブラウザ互換性強化)
    function getLocalIP() {
        return new Promise((resolve, reject) => {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // STUNサーバーを利用
            });

            pc.onicecandidate = (event) => {
                if (event && event.candidate) {
                    const candidate = event.candidate.candidate;
                    // ローカルIPを抽出
                    const ipMatch = candidate.match(/\d+\.\d+\.\d+\.\d+/);
                    if (ipMatch) {
                        resolve(ipMatch[0]);
                        pc.close();
                    }
                } else if (!event.candidate) {
                    reject("No local IP found");
                    pc.close();
                }
            };

            pc.createDataChannel("");               // データチャネルを作成
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(reject);

            // タイムアウトを設定 (5秒で失敗と判断)
            setTimeout(() => {
                reject("Local IP fetch timed out");
                pc.close();
            }, 5000);
        });
    }

    // ローカルIPを取得して表示
    getLocalIP()
        .then(ip => addRow("Local IP Address", ip))
        .catch(() => addRow("Local IP Address", "Unavailable"));


    // グローバルIPアドレスの取得 (外部APIを使用)
    function getGlobalIP() {
        fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => addRow("Global IP Address", data.ip))
            .catch(() => addRow("Global IP Address", "Unavailable"));
    }
    getGlobalIP();

    // 3. ユーザーの操作情報




    // 一度追加
    updateRow("Key Pressed", "");
    updateRow("Page Focus", "Focused");
    updateRow("Click Position", `X:  Y: `);
    updateRow("Scroll Position X", `X: `);
    updateRow("Scroll Position Y", `Y: `);
    updateRow("Action", "");

    // キーボード入力の取得
    document.addEventListener("keydown", function(event) {
        updateRow("Key Pressed", event.key);
    });

    // ページフォーカス状態の取得
    window.addEventListener("focus", function() {
        updateRow("Page Focus", "Focused");
    });
    window.addEventListener("blur", function() {
        updateRow("Page Focus", "Unfocused");
    });


    // クリック位置の取得
    document.addEventListener("click", function(event) {
        updateRow("Click Position", `X: ${event.clientX} Y: ${event.clientY}`);
    });


    // スクロール位置の取得
    window.addEventListener("scroll", function() {
        updateRow("Scroll Position X", `X: ${window.scrollX}`);
        updateRow("Scroll Position Y", `Y: ${window.scrollY}`);
    });

    // コピー・ペースト・印刷
    document.addEventListener('copy', function () {
        updateRow("Action", "Copying has been executed.");
    });
    document.addEventListener('paste', function () {
        updateRow("Action", "Paste has been executed.");
    });
    document.addEventListener('beforeprint', function () {
        updateRow("Action", "beforeprint");
    });


    // 1. 同一オリジン内での履歴
    function getHistoryDetails() {
        const historyLength = window.history.length;
        const currentUrl = window.location.href;
        const previousUrl = document.referrer;

        updateRow("History Length", historyLength);
        updateRow("Current URL", currentUrl);
        updateRow("Previous URL (Referrer)", previousUrl ? previousUrl : "No referrer");
    }

    // 2. ページのロード時間
    function getPageLoadTime() {
        const timing = performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;

        updateRow("Page Load Time (ms)", pageLoadTime);
        updateRow("DOM Content Loaded Time (ms)", domContentLoadedTime);
    }

    // 3. ユーザーの滞在時間・アクティブ時間
    let startTime = Date.now();
    let activeTime = 0;
    let active = true;

    window.addEventListener("focus", function() {
        active = true;
        startTime = Date.now();
    });
    window.addEventListener("blur", function() {
        active = false;
        activeTime += Date.now() - startTime;
        updateRow("Total Active Time (ms)", activeTime);
    });

    setInterval(function() {
        if (active) {
            activeTime += Date.now() - startTime;
            startTime = Date.now();
            updateRow("Total Active Time (ms)", activeTime);
        }
    }, 1000); // 1秒ごとに更新

    // 呼び出し
    getHistoryDetails();
    getPageLoadTime();





    // 5. OSレベル情報

    // 5. OS-Level Information

    // バッテリー状態 (Battery API)
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            addRow("Battery Level", (battery.level * 100) + "%");
            addRow("Charging", battery.charging ? "Yes" : "No");
            addRow("Charging Time", battery.chargingTime + "s");
            addRow("Discharging Time", battery.dischargingTime + "s");
        });
    } else {
        addRow("Battery", "Not supported");
    }

    // 加速度センサー (DeviceMotionEvent)
    if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', event => {
            if (event.acceleration) {
                addRow("Acceleration X", event.acceleration.x || "N/A");
                addRow("Acceleration Y", event.acceleration.y || "N/A");
                addRow("Acceleration Z", event.acceleration.z || "N/A");
            }
        });
    } else {
        addRow("Acceleration Sensor", "Not supported");
    }

    // 方位・ジャイロセンサー (DeviceOrientationEvent)
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', event => {
            addRow("Orientation Alpha", event.alpha || "N/A");
            addRow("Orientation Beta", event.beta || "N/A");
            addRow("Orientation Gamma", event.gamma || "N/A");
        });
    } else {
        addRow("Orientation Sensor", "Not supported");
    }

    // 照度センサー (AmbientLightSensor)
    if ('AmbientLightSensor' in window) {
        try {
            const sensor = new AmbientLightSensor();
            sensor.addEventListener('reading', () => {
                addRow("Ambient Light", sensor.illuminance + " lx");
            });
            sensor.start();
        } catch (error) {
            addRow("Ambient Light Sensor", "Permission denied or unsupported");
        }
    } else {
        addRow("Ambient Light Sensor", "Not supported");
    }

    // 仮想キーボードの可視状態 (navigator.virtualKeyboard)
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.addEventListener('geometrychange', () => {
            addRow("Virtual Keyboard Visible", "Yes");
        });
    } else {
        addRow("Virtual Keyboard", "Not supported");
    }


    // 6. Storage and Cache Information

    // Cookie
    addRow("Cookies", document.cookie || "None");

    // LocalStorage
    addRow("LocalStorage Items", localStorage.length);
    for (let i = 0; i < localStorage.length; i++) {
        addRow(`LocalStorage`, `${localStorage.key(i)} : ${localStorage.getItem(localStorage.key(i))}`);
    }

    // SessionStorage
    addRow("SessionStorage Items", sessionStorage.length);
    for (let i = 0; i < sessionStorage.length; i++) {
        addRow(`SessionStorage`, `${sessionStorage.key(i)} : ${sessionStorage.getItem(sessionStorage.key(i))}`);
    }

    // IndexedDB
    if ('indexedDB' in window) {
        addRow("IndexedDB", "Supported");
        indexedDB.databases().then(dbs => {
            dbs.forEach(db => {
                addRow(`IndexedDB: ${db.name}`, `Version: ${db.version}`);
            });
        });
    } else {
        addRow("IndexedDB", "Not supported");
    }

    // Cache API (Service Worker Cache)
    if ('caches' in window) {
        caches.keys().then(keys => {
            addRow("Cache API", keys.length ? keys.join(", ") : "None");
        });
    } else {
        addRow("Cache API", "Not supported");
    }

    // PWA Installation Status (beforeinstallprompt event is needed to track eligibility)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        addRow("PWA Installed", "Yes");
    } else {
        addRow("PWA Installed", "No");
    }

    // Storage Quota (navigator.storage.estimate)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            addRow("Storage Usage", `${(estimate.usage / 1048576).toFixed(2)} MB`);
            addRow("Storage Quota", `${(estimate.quota / 1048576).toFixed(2)} MB`);
        });
    } else {
        addRow("Storage Estimate", "Not supported");
    }

    // Service Worker Status
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            addRow("Service Workers", registrations.length ? "Registered" : "None");
        });
    } else {
        addRow("Service Worker", "Not supported");
    }

    // Clipboard Permission
    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'clipboard-read' }).then(permissionStatus => {
            addRow("Clipboard Read Permission", permissionStatus.state);
        });
        navigator.permissions.query({ name: 'clipboard-write' }).then(permissionStatus => {
            addRow("Clipboard Write Permission", permissionStatus.state);
        });
    } else {
        addRow("Clipboard Permission", "Not supported");
    }


    // 7. Environment Detection

    // WebRTC support
    addRow("WebRTC Support", 'RTCPeerConnection' in window ? "Yes" : "No");

    // WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    addRow("WebGL Support", gl ? "Yes" : "No");

    // WebGPU support (experimental)
    if ('gpu' in navigator) {
        addRow("WebGPU Support", "Yes");
    } else {
        addRow("WebGPU Support", "No");
    }

    // Dark Mode / Color Scheme support
    if (window.matchMedia) {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
        addRow("Dark Mode Supported", darkMode.matches ? "Yes" : "No");
        darkMode.addListener(e => {
            addRow("Dark Mode Active", e.matches ? "Yes" : "No");
        });
    } else {
        addRow("Dark Mode Supported", "No");
    }

    // Mobile device detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    addRow("Mobile Device", isMobile ? "Yes" : "No");

    // Push Notifications support
    if ('Notification' in window) {
        addRow("Push Notifications Supported", "Yes");
    } else {
        addRow("Push Notifications Supported", "No");
    }


    // 8. メディアデバイス

    // Screen capture support
    if ('getDisplayMedia' in navigator.mediaDevices) {
        addRow("Screen Capture Supported", "Yes");
    } else {
        addRow("Screen Capture Supported", "No");
    }

    // Audio & Video device input types
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            let audioDevices = devices.filter(device => device.kind === 'audioinput');
            let videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            addRow("Audio Device Types", audioDevices.length ? audioDevices.map(device => device.kind).join(", ") : "None");
            addRow("Video Device Types", videoDevices.length ? videoDevices.map(device => device.kind).join(", ") : "None");
        })
        .catch(err => addRow("Device Enumeration Error", err.message));




    // 9. 時間・地域情報

    // ローカル時間 (Date)
    const now = new Date();
    addRow("Local Time", now.toString());

    // UTC 時間 (Date)
    addRow("UTC Time", now.toUTCString());

    // タイムゾーン (Intl.DateTimeFormat)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    addRow("Time Zone", timeZone);

    // タイムゾーンオフセット (ミリ秒 → 分に変換)
    addRow("Time Zone Offset", `${-now.getTimezoneOffset()} minutes`);

    // 時刻の国際形式 (Intl.DateTimeFormat を使用)
    const intlTime = new Intl.DateTimeFormat(navigator.language, { timeStyle: "full", dateStyle: "full" }).format(now);
    addRow("International Time Format", intlTime);

    // サマータイム (DST) 判定
    const janOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
    const julOffset = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
    const isDST = Math.min(janOffset, julOffset) !== now.getTimezoneOffset();
    addRow("Daylight Saving Time", isDST ? "Active" : "Inactive");

    // Unixタイムスタンプ (1970-01-01からの経過秒数)
    addRow("Unix Timestamp", Math.floor(now.getTime() / 1000));

    // ISO 8601 形式の日時
    addRow("ISO 8601 Time", now.toISOString());

    // マイクロ秒精度の高精度時間 (performance.now)
    if (performance.now) {
        addRow("High Precision Time", `${performance.now().toFixed(2)} ms`);
    } else {
        addRow("High Precision Time", "Not supported");
    }

    // 年度の週番号 (ISO 8601 準拠)
    function getISOWeekNumber(date) {
        const tempDate = new Date(date.valueOf());
        tempDate.setHours(0, 0, 0, 0);
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
        const week1 = new Date(tempDate.getFullYear(), 0, 4);
        return Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) + 1;
    }
    addRow("ISO Week Number", getISOWeekNumber(now));

    // GMTオフセットを詳細表示
    const offsetHours = -now.getTimezoneOffset() / 60;
    addRow("GMT Offset", `GMT${offsetHours >= 0 ? "+" : ""}${offsetHours}`);

    // ブラウザのタイムゾーン名
    if (Intl.DateTimeFormat().resolvedOptions().timeZoneName) {
        addRow("Time Zone Name", Intl.DateTimeFormat().resolvedOptions().timeZoneName);
    }



    // 10. WASM Specific Information

    // SIMD Support (Check if WebAssembly SIMD is supported)
    if ('SIMD' in WebAssembly) {
        addRow("SIMD Support", "Yes");
    } else {
        addRow("SIMD Support", "No");
    }

    // Memory usage in WebAssembly (Performance memory API)
    if (performance.memory) {
        const memory = performance.memory;
        addRow("Memory Usage (JS Heap)", `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`);
        addRow("Memory Limit", `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`);
    } else {
        addRow("Memory Usage", "Not available");
    }

    // CPU information (Number of logical cores)
    const cpuCores = navigator.hardwareConcurrency || "Not available";
    addRow("CPU Cores", cpuCores);

    // Checking if WASM is supported
    if ('WebAssembly' in window) {
        addRow("WebAssembly Supported", "Yes");
    } else {
        addRow("WebAssembly Supported", "No");
    }



    // 11. CSS-specific Information

    // 2. OS settings (prefers-reduced-motion)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Reduced Motion' : 'Normal Motion';
    addRow("OS Motion Settings", reducedMotion);

    // 3. Device Pixel Density (min-resolution, dppx)
    const pixelDensity = window.devicePixelRatio || "Not available";
    addRow("Device Pixel Density (dppx)", pixelDensity);

    // 4. Visual display preference (prefers-contrast)
    if (window.matchMedia) {
        const contrastMode = window.matchMedia('(prefers-contrast: high)').matches ? 'High Contrast' : 'Normal Contrast';
        addRow("User's Contrast Preference", contrastMode);
    } else {
        addRow("User's Contrast Preference", "Not available");
    }

    // 5. User's font size preference (prefers-font)
    if (window.matchMedia) {
        const fontSize = window.matchMedia('(prefers-font: large)').matches ? 'Large Font' : 'Normal Font';
        addRow("User's Font Size Preference", fontSize);
    } else {
        addRow("User's Font Size Preference", "Not available");
    }
}




// 4. 位置情報 (Geolocation API)

function getGeolocation() {
    const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
    };
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const coords = position.coords;
            updateRow("Latitude", coords.latitude);
            updateRow("Longitude", coords.longitude);
            updateRow("Altitude", coords.altitude || "No information");
            updateRow("Speed", coords.speed || "No information");
            updateRow("Accuracy (m)", coords.accuracy);
            if (coords.altitudeAccuracy) {
                updateRow("Altitude Accuracy", coords.altitudeAccuracy);
            }
        }, function(error) {
            updateRow("Geolocation", error.message);
        },
            options
        );
    } else {
        updateRow("Geolocation", "Not available");
    }
}

// Get available media devices (camera, microphone)
function get_camera_info() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            let cameras = [];
            let microphones = [];
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    cameras.push(device);
                } else if (device.kind === 'audioinput') {
                    microphones.push(device);
                }
            });
            addRow("Available Cameras", cameras.length ? cameras.map(device => device.label).join(", ") : "None");
            addRow("Available Microphones", microphones.length ? microphones.map(device => device.label).join(", ") : "None");
            // Get camera resolution and framerate info
            cameras.forEach(camera => {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: camera.deviceId } })
                    .then(stream => {
                        const track = stream.getVideoTracks()[0];
                        const settings = track.getSettings();
                        addRow(`Camera: ${camera.label}`, `Resolution: ${settings.width}x${settings.height}, Frame Rate: ${settings.frameRate}`);
                        stream.getTracks().forEach(track => track.stop());
                    });
            });
        })
        .catch(err => addRow("Media Devices Error", err.message));
}