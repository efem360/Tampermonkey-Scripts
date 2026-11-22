// ==UserScript==
// @name         Gmail Geçmiş Görüşmeleri Ara
// @namespace    https://github.com/efem360
// @version      4.2.1
// @description  Gmail'de e-posta adreslerinin yanına mektup butonu ekler. Tek-tıkla tüm geçmiş yazışmaları bulun.
// @author       Kemal Kalender
// @homepageURL  https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History
// @supportURL   https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History/issues
// @icon         https://mail.google.com/favicon.ico
// @license      GPL-3.0
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/*
// @match        *://gmail.com/*
// @exclude      *://mail.google.com/mail/*/blank
// @exclude      *://mail.google.com/mail/*/help
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // AYARLAR

    let isSearching = false;
    let observer = null;
    let scanTimeout = null;
    let isActive = false;

    // STİLLER

    const style = document.createElement('style');

    style.textContent = `
        .email_search_icon {
            outline: none;
            position: relative;
            z-index: 0;
            padding: 0 4px;
            margin: 0;
            top: 2px;
            cursor: pointer;
            transition: transform 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
        }

        .email_search_icon:hover {
            transform: scale(1.15);
        }

        .email_search_icon svg {
            fill: #5f6368;
            transition: fill 0.2s ease;
        }

        .email_search_icon:hover svg {
            fill: #1a73e8;
        }

        .email_search_icon:focus {
            outline: 2px solid #1a73e8;
            border-radius: 50%;
            transform: scale(1.1);
        }
    `;

    (document.head || document.documentElement).appendChild(style);

    // GMAIL SİMGESİ

    function getGmailIcon() {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );

        svg.setAttribute('focusable', 'false');
        svg.setAttribute('height', '18px');
        svg.setAttribute('width', '18px');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');

        const path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        path.setAttribute(
            'd',
            'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
        );

        svg.appendChild(path);
        return svg;
    }

    // BİLDİRİM

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${isError ? '#d32f2f' : '#4caf50'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: efem360SlideIn 0.3s ease;
        `;

        if (!document.getElementById('efem360-notification-style')) {
            const notificationStyle = document.createElement('style');
            notificationStyle.id = 'efem360-notification-style';
            notificationStyle.textContent = `
                @keyframes efem360SlideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            (document.head || document.documentElement).appendChild(notificationStyle);
        }

        document.body.appendChild(notification);

        setTimeout(function () {
            notification.style.animation = 'efem360SlideIn 0.3s ease reverse';

            setTimeout(function () {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // GMAIL ARAMASI

    function performSearch(email, searchType = 'all') {
        if (isSearching) {
            return false;
        }

        isSearching = true;

        const searchInput = document.querySelector('input[name="q"]');

        if (!searchInput) {
            showNotification('❌ Gmail arama kutusu bulunamadı!', true);
            isSearching = false;
            return false;
        }

        let searchQuery = email;
        let searchText = 'tümü';

        switch (searchType) {
            case 'received':
                searchQuery = 'from:' + email;
                searchText = 'gelenler';
                break;

            case 'sent':
                searchQuery = 'to:' + email;
                searchText = 'gidenler';
                break;

            default:
                searchQuery = email;
                searchText = 'tümü';
        }

        // Aynı arama zaten açıksa tekrar çalıştırma.

        const currentHash = window.location.hash;

        if (currentHash.startsWith('#search/')) {
            try {
                const currentSearch = decodeURIComponent(
                    currentHash.substring('#search/'.length)
                );

                if (currentSearch === searchQuery) {
                    isSearching = false;
                    return false;
                }
            } catch (error) {
                // URL çözümlenemiyorsa aramaya devam et.
            }
        }

        searchInput.value = searchQuery;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(function () {
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });

            searchInput.dispatchEvent(enterEvent);

            setTimeout(function () {
                isSearching = false;
            }, 500);
        }, 100);

        showNotification('🔍 ' + email + ' (' + searchText + ') aranıyor...');
        return true;
    }

    // YENİ SEKMEDE ARAMA

    function searchInNewTab(email) {
        const accountMatch = window.location.pathname.match(/\/mail\/u\/(\d+)/);
        const accountNumber = accountMatch ? accountMatch[1] : '0';

        const url =
            'https://mail.google.com/mail/u/' + accountNumber + '/#search/' +
            encodeURIComponent(email);

        const newTab = window.open(url, '_blank');

        if (!newTab) {
            showNotification(
                '❌ Yeni sekme açılamadı. Tarayıcı açılır pencereyi engellemiş olabilir.',
                true
            );
            return;
        }

        showNotification('🔍 ' + email + ' yeni sekmede aranıyor...');
    }

    // E-POSTA KOPYALAMA

    function copyEmailFallback(email) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';

        document.body.appendChild(textarea);
        textarea.select();

        let copied = false;

        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }

        textarea.remove();
        return copied;
    }

    function copyEmail(email) {
        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === 'function'
        ) {
            navigator.clipboard.writeText(email)
                .then(function () {
                    showNotification('📋 E-posta kopyalandı: ' + email);
                })
                .catch(function () {
                    if (copyEmailFallback(email)) {
                        showNotification('📋 E-posta kopyalandı: ' + email);
                    } else {
                        showNotification('❌ Kopyalama başarısız oldu!', true);
                    }
                });

            return;
        }

        if (copyEmailFallback(email)) {
            showNotification('📋 E-posta kopyalandı: ' + email);
        } else {
            showNotification('❌ Kopyalama başarısız oldu!', true);
        }
    }

    // E-POSTA ARAMA SİMGESİ

    function createEmailSearchIcon(emailAddress) {
        const span = document.createElement('span');
        span.className = 'email_search_icon';

        span.title =
            '🔍 ' + emailAddress + ' ile tüm yazışmaları ara\n' +
            '🖱️ Sol tık: Tüm e-postalar\n' +
            '🖱️ Ctrl + Sol tık: Yeni sekmede ara\n' +
            '🖱️ Sağ tık: Seçenekler menüsü';

        span.setAttribute('email', emailAddress);
        span.setAttribute('data-email', emailAddress);
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        span.setAttribute(
            'aria-label',
            emailAddress + ' adresiyle e-postaları ara'
        );

        span.appendChild(getGmailIcon());

        // Sol tık

        span.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            if (event.ctrlKey || event.metaKey) {
                searchInNewTab(emailAddress);
            } else {
                performSearch(emailAddress, 'all');
            }
        });

        // Sağ tık

        span.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const selection = prompt(
                '🔍 ' + emailAddress + '\n\n' +
                'Arama seçeneği seçin:\n' +
                '━━━━━━━━━━━━━━━━━━━━━━\n' +
                '1️⃣ Tüm e-postalar\n' +
                '2️⃣ Sadece gelenler (size gönderilen)\n' +
                '3️⃣ Sadece gidenler (sizin gönderdikleriniz)\n' +
                '4️⃣ Yeni sekmede ara\n' +
                '5️⃣ E-posta adresini kopyala\n' +
                '━━━━━━━━━━━━━━━━━━━━━━\n' +
                'Seçiminiz (1-5):'
            );

            switch (selection) {
                case '1':
                    performSearch(emailAddress, 'all');
                    break;

                case '2':
                    performSearch(emailAddress, 'received');
                    break;

                case '3':
                    performSearch(emailAddress, 'sent');
                    break;

                case '4':
                    searchInNewTab(emailAddress);
                    break;

                case '5':
                    copyEmail(emailAddress);
                    break;
            }
        });

        // Klavye desteği

        span.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                performSearch(emailAddress, 'all');
            }
        });

        return span;
    }

    // SİMGE VAR MI?

    function hasIcon(element) {
        if (!element || !element.parentElement) {
            return false;
        }

        const email =
            element.getAttribute('email') ||
            (element.getAttribute('href') || '')
                .replace(/^mailto:/i, '')
                .split('?')[0]
                .trim();

        const previous = element.previousElementSibling;

        if (
            previous &&
            previous.classList &&
            previous.classList.contains('email_search_icon')
        ) {
            return true;
        }

        return Array.from(element.parentElement.children).some(function (child) {
            return child !== element &&
                child.classList &&
                child.classList.contains('email_search_icon') &&
                child.getAttribute('data-email') === email;
        });
    }

    // E-POSTA ADRESLERİNİ BUL VE SİMGE EKLE

    function insertEmailSearchIcons() {
        if (!isActive || document.hidden) {
            return;
        }

        const gdElements = document.querySelectorAll('.gD');

        gdElements.forEach(function (element) {
            if (!element || hasIcon(element)) {
                return;
            }

            const email = element.getAttribute('email');

            if (!email || !email.includes('@')) {
                return;
            }

            const icon = createEmailSearchIcon(email);

            if (element.parentNode) {
                element.parentNode.insertBefore(icon, element);
            }
        });

        const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

        mailtoLinks.forEach(function (link) {
            if (!link || !link.parentNode || hasIcon(link)) {
                return;
            }

            const inEditable = link.closest('div[contenteditable="true"]');

            if (inEditable) {
                return;
            }

            const href = link.getAttribute('href');

            if (!href) {
                return;
            }

            const email = href
                .replace(/^mailto:/i, '')
                .split('?')[0]
                .trim();

            if (!email || !email.includes('@')) {
                return;
            }

            const icon = createEmailSearchIcon(email);
            link.parentNode.insertBefore(icon, link);
        });
    }

    // DOM DEĞİŞİKLİKLERİNİ FİLTRELE

    function nodeContainsEmailElement(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        return node.matches('.gD, a[href^="mailto:"]') ||
            !!node.querySelector('.gD, a[href^="mailto:"]');
    }

    // DOM TARAMASINI PLANLA

    function scheduleScan() {
        if (!isActive || document.hidden) {
            return;
        }

        if (scanTimeout !== null) {
            clearTimeout(scanTimeout);
        }

        scanTimeout = setTimeout(function () {
            scanTimeout = null;
            insertEmailSearchIcons();
        }, 80);
    }

    // DOM İZLEYİCİSİNİ DURDUR

    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        if (scanTimeout !== null) {
            clearTimeout(scanTimeout);
            scanTimeout = null;
        }
    }

    // DOM DEĞİŞİKLİKLERİNİ İZLE

    function startObserver() {
        if (observer || !isActive || !document.body) {
            return;
        }

        observer = new MutationObserver(function (mutations) {
            if (!isActive || document.hidden) {
                return;
            }

            let hasRelevantChanges = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (nodeContainsEmailElement(node)) {
                            hasRelevantChanges = true;
                            break;
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    const target = mutation.target;

                    if (
                        target.matches('.gD, a[href^="mailto:"]') ||
                        target.closest('.gD, a[href^="mailto:"]')
                    ) {
                        hasRelevantChanges = true;
                    }
                }

                if (hasRelevantChanges) {
                    break;
                }
            }

            if (hasRelevantChanges) {
                scheduleScan();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                'email',
                'href',
                'contenteditable'
            ]
        });
    }

    // GMAIL SAYFA GEÇİŞLERİ

    function handleNavigation() {
        if (!isActive || document.hidden) {
            return;
        }

        scheduleScan();
    }

    window.addEventListener('popstate', handleNavigation, {
        passive: true
    });

    window.addEventListener('hashchange', handleNavigation, {
        passive: true
    });

    // SEKME GÖRÜNÜRLÜĞÜ

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopObserver();
            return;
        }

        if (isActive) {
            startObserver();
            scheduleScan();
        }
    });

    // BAŞLAT

    function start() {
        if (isActive) {
            return;
        }

        isActive = true;

        if (document.hidden) {
            return;
        }

        startObserver();
        insertEmailSearchIcons();
    }

    // GMAIL VE CONTACTS MESAJLARI

    if (window.self === window.top) {
        window.addEventListener('message', function (event) {
            if (
                event.origin !== 'https://contacts.google.com' ||
                typeof event.data !== 'string' ||
                !event.data.includes('searchForEmail=')
            ) {
                return;
            }

            const email = event.data
                .replace('searchForEmail=', '')
                .trim();

            if (email.includes('@')) {
                performSearch(email, 'all');
            }
        });
    }

    // BAŞLANGIÇ

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, {
            once: true
        });
    } else {
        start();
    }

})();
