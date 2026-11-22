// ==UserScript==
// @name         Google Images Quick Viewer
// @namespace    https://github.com/efem360
// @version      1.1
// @description  Google Görseller'e F1 tuşuyla hızlı görüntüleme butonları ekler. Tek tıkla orijinal görseli açın.
// @author       Kemal Kalender
// @homepageURL  https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button
// @supportURL   https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button/issues
// @icon         https://www.google.com/favicon.ico
// @license      GPL-3.0
// @match        *://www.google.com/*
// @match        *://www.google.com.tr/*
// @match        *://google.com/*
// @match        *://google.com.tr/*
// @match        *://*.google.*/search*
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!location.href.includes('tbm=isch') && !location.href.includes('udm=2')) return;

    let processed = new Set(); // İşlenen linkleri hatırla
    let totalAdded = 0;

    function butonlariEkle() {
        let added = 0;
        let links = document.querySelectorAll('a[href*="imgurl"]');

        links.forEach(link => {
            // Daha önce işlendiyse atla
            if (processed.has(link)) return;

            const match = link.href.match(/imgurl=([^&]+)/);
            if (!match) return;

            const url = decodeURIComponent(match[1]);
            if (!url || url.includes('gstatic')) return;

            if (
            !location.search.includes('tbm=isch') &&
            !location.search.includes('udm=2')
            ) {
        return;
       }

            // İşlendi olarak işaretle
            processed.add(link);

            const btn = document.createElement('button');
            btn.innerHTML = '📷';
            btn.title = 'Resmi Görüntüle';
            btn.className = 'google-view-btn';
            btn.style.cssText = `
                position: absolute;
                right: 2px;
                bottom: 2px;
                background: rgba(0,0,0,0.7);
                color: white;
                border: none;
                padding: 2px 5px;
                border-radius: 10px;
                font-size: 12px;
                cursor: pointer;
                z-index: 999;
                transition: all 0.2s;
            `;

            btn.onmouseenter = () => btn.style.background = 'rgba(0,0,0,0.9)';
            btn.onmouseleave = () => btn.style.background = 'rgba(0,0,0,0.7)';

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(url, '_blank');
                return false;
            };

            const container = link.closest('[jsname], [data-attrid]');
            if (container) {
                if (getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                container.appendChild(btn);
                added++;
            }
        });

        totalAdded += added;

        // Bildirim göster
        if (added > 0) {
            GM_notification({
                text: `✨ ${added} yeni buton eklendi (Toplam: ${totalAdded})`,
                title: '📷 Google Görsel',
                timeout: 1500
            });
            console.log(`✅ F1 tuşu: ${added} buton eklendi (Toplam: ${totalAdded})`);
        } else {
            GM_notification({
                text: `⚠️ Yeni buton yok (Toplam: ${totalAdded})`,
                title: '📷 Google Görsel',
                timeout: 1000
            });
        }
    }

    // F1 tuşunu yakala
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault(); // Tarayıcının yardım sayfasını açmasını engelle
            butonlariEkle();
        }
    });

    // Sayfaya bilgi ekranı
    const info = document.createElement('div');
    info.innerHTML = `
        <div style="position:fixed; bottom:20px; right:20px; background:#1a73e8; color:white; padding:8px 16px; border-radius:8px; font-size:13px; z-index:10000; font-family:Arial; box-shadow:0 2px 5px rgba(0,0,0,0.2); cursor:pointer;">
            ⌨️ <b>F1</b> tuşuna bas → butonlar gelsin
        </div>
    `;
    info.onclick = () => info.remove();
    setTimeout(() => info.remove(), 8000);
    document.body.appendChild(info);

})();
