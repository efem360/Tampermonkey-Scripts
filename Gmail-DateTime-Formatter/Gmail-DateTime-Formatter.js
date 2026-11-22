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
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const LOCALES = [
        'tr', 'en', 'en-US', 'en-GB', 'de', 'fr', 'es', 'it',
        'pt', 'pt-BR', 'nl', 'ru', 'uk', 'pl', 'cs', 'sk',
        'sl', 'hr', 'sr', 'bg', 'ro', 'hu', 'el', 'sv',
        'no', 'da', 'fi', 'is', 'et', 'lv', 'lt', 'ga',
        'mt', 'sq', 'mk', 'bs', 'ar', 'fa', 'he', 'ur',
        'hi', 'bn', 'ta', 'te', 'ml', 'mr', 'gu', 'pa',
        'ne', 'si', 'th', 'lo', 'km', 'my', 'vi', 'id',
        'ms', 'fil', 'ja', 'ko', 'zh', 'zh-CN', 'zh-TW',
        'zh-HK', 'yue', 'sw', 'am', 'af', 'zu', 'xh',
        'yo', 'ig', 'ha', 'ps', 'ku', 'az', 'ka', 'hy',
        'kk', 'uz', 'ky', 'tg', 'mn', 'bo', 'jv', 'su',
        'ca', 'eu', 'gl', 'cy', 'br', 'lb', 'fo', 'be',
        'bs', 'es-419', 'fr-CA', 'de-CH', 'en-AU',
        'en-CA', 'en-IN', 'es-MX', 'es-ES', 'ar-EG',
        'ar-SA', 'ar-MA', 'fa-IR', 'hi-IN', 'bn-BD',
        'pt-PT', 'sr-Latn', 'sr-Cyrl'
    ];

    const MONTHS = new Map();

    function normalize(value) {
        return value
            .normalize('NFKC')
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[.,،؛]/g, '')
            .trim();
    }

    // Farklı alfabelerdeki rakamları standart rakamlara dönüştür.
    function normalizeDigits(value) {
        const ranges = [
            [0x0660, 0x0669],
            [0x06F0, 0x06F9],
            [0x0966, 0x096F],
            [0x09E6, 0x09EF],
            [0x0A66, 0x0A6F],
            [0x0AE6, 0x0AEF],
            [0x0B66, 0x0B6F],
            [0x0BE6, 0x0BEF],
            [0x0C66, 0x0C6F],
            [0x0CE6, 0x0CEF],
            [0x0D66, 0x0D6F],
            [0x0E50, 0x0E59],
            [0x0ED0, 0x0ED9],
            [0x1040, 0x1049],
            [0x17E0, 0x17E9],
            [0x1810, 0x1819],
            [0xFF10, 0xFF19]
        ];

        return value.replace(/\p{Nd}/gu, char => {
            const code = char.codePointAt(0);

            for (const [start, end] of ranges) {
                if (code >= start && code <= end) {
                    return String(code - start);
                }
            }

            return char;
        });
    }

    // Tüm dillerden ay isimlerini otomatik oluştur.
    function buildMonthDatabase() {
        for (const locale of LOCALES) {
            try {
                for (let month = 0; month < 12; month++) {
                    const date = new Date(Date.UTC(2020, month, 17));

                    for (const options of [
                        { month: 'long' },
                        { month: 'short' },
                        { month: 'long', day: 'numeric' },
                        { month: 'short', day: 'numeric' }
                    ]) {
                        const formatter = new Intl.DateTimeFormat(
                            locale,
                            { ...options, timeZone: 'UTC' }
                        );

                        const parts = formatter.formatToParts(date);
                        const monthPart = parts.find(
                            part => part.type === 'month'
                        );

                        if (monthPart) {
                            MONTHS.set(
                                normalize(monthPart.value),
                                String(month + 1).padStart(2, '0')
                            );
                        }
                    }
                }
            } catch (_) {
                // Desteklenmeyen dil atlanır.
            }
        }
    }

    buildMonthDatabase();

    const PM_MARKERS = [
        'pm', 'p.m.', 'p.m', 'pm.',
        '下午', '午後', '오후', 'م', 'مساءً'
    ];

    const AM_MARKERS = [
        'am', 'a.m.', 'a.m', 'am.',
        '上午', '午前', '오전', 'ص', 'صباحاً'
    ];

    function formatDate(fullDate) {
        if (!fullDate) return null;

        const original = fullDate.trim();
        const value = normalizeDigits(original);

        // Saat bilgisini bul.
        const timeMatch = value.match(
            /(\d{1,2})[:.](\d{2})(?::\d{2})?\s*(a\.?m\.?|p\.?m\.?|上午|下午|午前|午後|오전|오후|م|ص|مساءً|صباحاً)?/i
        );

        if (!timeMatch) return null;

        let hour = Number(timeMatch[1]);
        const minute = Number(timeMatch[2]);
        const marker = timeMatch[3] || '';

        if (hour > 23 || minute > 59) return null;

        const normalizedMarker = normalize(marker);

        if (PM_MARKERS.some(m => normalize(m) === normalizedMarker)) {
            if (hour < 1 || hour > 12) return null;
            if (hour !== 12) hour += 12;
        } else if (
            AM_MARKERS.some(m => normalize(m) === normalizedMarker)
        ) {
            if (hour < 1 || hour > 12) return null;
            if (hour === 12) hour = 0;
        }

        const time = String(hour).padStart(2, '0') +
            ':' + String(minute).padStart(2, '0');

        // Yıl bilgisini bul.
        const yearMatch = value.match(/(?:^|\D)(\d{4})(?=\D|$)/);

        if (!yearMatch) return null;

        const year = Number(yearMatch[1]);

        if (year < 1000 || year > 9999) return null;

        // Tarih içerisindeki ay ismini bul.
        let month = null;
        let monthIndex = -1;

        const tokens = [...value.matchAll(/[\p{L}\p{M}]+\.?/gu)];

        for (const token of tokens) {
            const key = normalize(token[0]);

            if (MONTHS.has(key)) {
                month = MONTHS.get(key);
                monthIndex = token.index;
                break;
            }
        }

        // Ay adı bulunamazsa yıl-ay-gün veya gün-ay-yıl
        // biçimindeki sayısal tarihleri kontrol et.
        let day;

        if (month) {
            const numbers = [...value.matchAll(/\d+/g)];

            const candidates = numbers
                .filter(n => {
                    const nValue = Number(n[0]);

                    if (nValue < 1 || nValue > 31) return false;
                    if (n[0].length === 4) return false;

                    // Saat içerisindeki sayıları çıkar.
                    const index = n.index;
                    const timeStart = timeMatch.index;
                    const timeEnd = timeStart + timeMatch[0].length;

                    return index < timeStart || index >= timeEnd;
                })
                .map(n => ({
                    value: Number(n[0]),
                    distance: Math.abs(n.index - monthIndex)
                }))
                .sort((a, b) => a.distance - b.distance);

            if (!candidates.length) return null;

            day = candidates[0].value;
        } else {
            const numericDate = value.match(
                /(?:^|\D)(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?(?=\D|$)/
            );

            if (numericDate) {
                const a = Number(numericDate[2]);
                const b = Number(numericDate[3]);

                if (a < 1 || a > 12 || b < 1 || b > 31) return null;

                month = String(a).padStart(2, '0');
                day = b;
            } else {
                const reverseDate = value.match(
                    /(?:^|\D)(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?=\D|$)/
                );

                if (!reverseDate) return null;

                const a = Number(reverseDate[1]);
                const b = Number(reverseDate[2]);

                // Belirsiz sayısal tarihleri tahmin ederek değiştirme.
                if (a > 12 && b <= 12) {
                    day = a;
                    month = String(b).padStart(2, '0');
                } else if (b > 12 && a <= 12) {
                    day = b;
                    month = String(a).padStart(2, '0');
                } else {
                    return null;
                }
            }
        }

        if (!day || day < 1 || day > 31) return null;

        return (
            String(day).padStart(2, '0') + '.' +
            month + '.' +
            String(year).slice(-2) + ' ' +
            time
        );
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

    // İlk tarama.
    scanElement(document.body);

    // Gmail değişikliklerini takip et.
    const observer = new MutationObserver(mutations => {
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
