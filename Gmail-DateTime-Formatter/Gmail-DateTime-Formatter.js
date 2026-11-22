// ==UserScript==
// @name         efem360 Gmail DateTime Formatter
// @namespace    https://github.com/efem360
// @version      2.4.0
// @description  Gmail tarih ve saatlerini otomatik olarak DD.MM.YY HH:MM formatında görüntüler. Çok dilli ay tanıma ve dinamik içerik desteği sunar.
// @author       Kemal Kalender
// @homepageURL  https://github.com/efem360/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter
// @supportURL   https://github.com/efem360/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/issues
// @match        https://mail.google.com/mail/*
// @exclude      https://mail.google.com/mail/*/blank
// @exclude      https://mail.google.com/mail/*/help
// @icon         https://mail.google.com/favicon.ico
// @license      GPL 3.0
// @grant        none
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.user.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.user.js
// @run-at       document-idle
// ==/UserScript==


(function () {
    'use strict';

    const MONTHS = {
        // Türkçe
        'oca': '01', 'şub': '02', 'mar': '03',
        'nis': '04', 'may': '05', 'haz': '06',
        'tem': '07', 'ağu': '08', 'eyl': '09',
        'eki': '10', 'kas': '11', 'ara': '12',

        // İngilizce
        'jan': '01', 'feb': '02', 'apr': '04',
        'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11',
        'dec': '12',

        // Almanca
        'mär': '03', 'mai': '05', 'okt': '10',
        'dez': '12',

        // Fransızca
        'janv': '01', 'févr': '02', 'avr': '04',
        'juin': '06', 'juil': '07', 'août': '08',
        'sept': '09', 'déc': '12',

        // İspanyolca
        'ene': '01', 'abr': '04', 'ago': '08',
        'dic': '12',

        // İtalyanca
        'gen': '01', 'mag': '05', 'giu': '06',
        'lug': '07', 'set': '09', 'ott': '10',

        // Portekizce
        'jan.': '01', 'fev.': '02', 'abr.': '04',
        'mai.': '05', 'ago.': '08', 'dez.': '12'
    };

    function formatDate(fullDate) {
        if (!fullDate) return null;

        const normalized = fullDate
            .trim()
            .replace(/,/g, '')
            .replace(/\./g, '')
            .replace(/\s+/g, ' ');

        const parts = normalized.match(
            /^(\d{1,2})\s+([^\s]+)\s+(\d{4})\s+\S+\s+(\d{1,2}:\d{2})$/i
        );

        if (!parts) return null;

        const day = parts[1].padStart(2, '0');
        const monthName = parts[2].toLocaleLowerCase();
        const month = MONTHS[monthName];
        const year = parts[3].slice(-2);
        const time = parts[4];

        if (!month) return null;

        return `${day}.${month}.${year} ${time}`;
    }

    function fixDate(outerSpan) {
        if (!outerSpan.matches('span[title][aria-label]')) return;

        const innerSpan = outerSpan.querySelector(
            ':scope > span:first-child'
        );

        if (!innerSpan) return;

        const formatted = formatDate(
            outerSpan.getAttribute('title')
        );

        if (!formatted) return;

        if (innerSpan.textContent.trim() === formatted) return;

        innerSpan.textContent = formatted;
        innerSpan.style.whiteSpace = 'nowrap';
        innerSpan.style.fontSize = '11px';
    }

    function scanElement(element) {
        if (!(element instanceof Element)) return;

        if (element.matches('span[title][aria-label]')) {
            fixDate(element);
        }

        element.querySelectorAll(
            'span[title][aria-label]'
        ).forEach(fixDate);
    }

    scanElement(document.body);

    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(scanElement);
            }

            if (
                mutation.type === 'attributes' &&
                mutation.target instanceof Element
            ) {
                scanElement(mutation.target);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['title', 'aria-label']
    });

})();
