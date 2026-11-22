// ==UserScript==
// @name         efem360 Google CP
// @namespace    https://github.com/efem360
// @version      4.1.9
// @description  Google arama ve OSINT deneyiminizi tek panelden yönetin. Gelişmiş operatörler, yerel dil paketleri, çeviri ve döviz araçlarıyla aramalarınızı özelleştirin.
// @author       Kemal Kalender
// @homepageURL  https://github.com/efem360/Tampermonkey-Scripts/tree/main/efem360-Google-CP
// @supportURL   https://github.com/efem360/Tampermonkey-Scripts/tree/main/efem360-Google-CP/issues
// @match        *://www.google.com/*
// @match        *://www.google.com.tr/*
// @match        *://www.google.*/*
// @exclude      *://*.google.com/recaptcha/*
// @exclude      *://*.google.com/sorry/*
// @icon         https://www.google.com/favicon.ico
// @license      GPL 3.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      www.piyasadoviz.com
// @connect      piyasadoviz.com
// @connect      translate.googleapis.com
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/efem360-Google-CP/efem360-Google-CP.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/efem360-Google-CP/efem360-Google-CP.js
// @run-at       document-idle
// ==/UserScript==

(() => {
'use strict';

if (window.top !== window.self || document.getElementById('goai-root')) return;

const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const enc = encodeURIComponent;

const persistentGet=(key,fallback='')=>{
  try {
    const value=GM_getValue(key,fallback);
    return value && typeof value.then==='function' ? fallback : value;
  } catch(_) {
    try { return localStorage.getItem(key) ?? fallback; } catch(__) { return fallback; }
  }
};

const persistentSet=(key,value)=>{
  try { GM_setValue(key,value); } catch(_) {}
  try { localStorage.setItem(key,String(value)); } catch(_) {}
};

const STORE = 'goai_mini_v3';
const DEVELOPER_EMAIL = '';

const defaults = {
  q:'', tab:'search', uiLanguage:'tr', operator:[], logic:[],
  site:'', urlPath:'', exclude:'', filetype:'', after:'', before:'',
  mode:'14', filters:['pws=0'], country:'www.google.com.tr',
  countryManual:false, resultLanguage:'auto',
  sourceLang:'en', targetLang:'tr', translateText:'',
  amount:'100', from:'USD', to:'TRY',
  currencySource:'serbest', currencyType:'alis',
  flightFrom:'', flightTo:'', flightDate:'', returnDate:'',
  flightTripType:'roundtrip', flightPassengers:'1', flightClass:'ECONOMY',
  flightLanguage:'tr', flightLocation:'TR', flightCurrency:'TRY',
  hotelCity:'', hotelCheckin:'', hotelCheckout:'',
  hotelGuests:'2', hotelCurrency:'TRY',
  history:[]
};

let state = {...defaults};

try {
  Object.assign(state,JSON.parse(sessionStorage.getItem(STORE)||'{}'));
} catch(_) {}

state.filters = (state.filters || []).filter(x=>x!=='gl=us&hl=en');
    state.operator = Array.isArray(state.operator)
  ? state.operator
  : (state.operator ? [state.operator] : []);

state.logic = Array.isArray(state.logic)
  ? state.logic
  : (state.logic ? [state.logic] : []);

// Türkçe sabit dildir. Diğer diller yalnızca indirilmiş paket varsa yüklenir.
try {
  const savedLanguage=persistentGet('goai_ui_language','tr') || 'tr';
  const savedPackage=savedLanguage==='tr' ? true : !!persistentGet('goai_ui_pack_'+savedLanguage,'');
  state.uiLanguage=savedPackage ? savedLanguage : 'tr';
} catch(_) { state.uiLanguage='tr'; }

const save = () => {
  try { sessionStorage.setItem(STORE,JSON.stringify(state)); } catch(_) {}
};

const languages = [
  ['auto','Otomatik algıla'],['tr','Türkçe'],['en','English'],['de','Deutsch'],
  ['fr','Français'],['es','Español'],['it','Italiano'],['pt','Português'],
  ['ru','Русский'],['ar','العربية'],['zh-CN','中文'],['ja','日本語'],
  ['ko','한국어'],['hi','हिन्दी'],['id','Bahasa Indonesia'],['th','ไทย'],
  ['vi','Tiếng Việt'],['km','ភាសាខ្មែរ'],['nl','Nederlands'],['pl','Polski'],
  ['uk','Українська'],['el','Ελληνικά'],['sv','Svenska'],['no','Norsk'],
  ['da','Dansk'],['fi','Suomi'],['cs','Čeština'],['ro','Română'],
  ['hu','Magyar'],['he','עברית'],['bg','Български'],['af','Afrikaans'],
  ['sq','Shqip'],['am','አማርኛ'],['hy','Հայերեն'],['as','অসমীয়া'],
  ['ay','Aymar aru'],['az','Azərbaycan'],['bm','Bamanankan'],['eu','Euskara'],
  ['be','Беларуская'],['bn','বাংলা'],['bho','भोजपुरी'],['bs','Bosanski'],
  ['ca','Català'],['ceb','Cebuano'],['ny','Chichewa'],['zh-TW','中文 (繁體)'],
  ['co','Corsu'],['hr','Hrvatski'],['dv','ދިވެހިބަސް'],['doi','डोगरी'],
  ['eo','Esperanto'],['et','Eesti'],['ee','Eʋegbe'],['fil','Filipino'],
  ['fy','Frysk'],['gl','Galego'],['ka','ქართული'],['gn','Guaraní'],
  ['gu','ગુજરાતી'],['ht','Kreyòl ayisyen'],['ha','Hausa'],['haw','Ōlelo Hawaiʻi'],
  ['hmn','Hmoob'],['is','Íslenska'],['ig','Igbo'],['ilo','Iloko'],
  ['ga','Gaeilge'],['jv','Basa Jawa'],['kn','ಕನ್ನಡ'],['kk','Қазақ тілі'],
  ['rw','Kinyarwanda'],['gom','कोंकणी'],['kri','Krio'],['ku','Kurdî'],
  ['ckb','کوردی (سۆرانی)'],['ky','Кыргызча'],['lo','ລາວ'],['la','Latina'],
  ['lv','Latviešu'],['ln','Lingála'],['lt','Lietuvių'],['lg','Luganda'],
  ['lb','Lëtzebuergesch'],['mk','Македонски'],['mai','मैथिली'],['mg','Malagasy'],
  ['ms','Bahasa Melayu'],['ml','മലയാളം'],['mt','Malti'],['mi','Māori'],
  ['mr','मराठी'],['mni-Mtei','ꯃꯩꯇꯩꯂꯣꯟ'],['lus','Mizo tawng'],['mn','Монгол'],
  ['my','မြန်မာဘာသာ'],['ne','नेपाली'],['or','ଓଡ଼ିଆ'],['om','Oromoo'],
  ['ps','پښتو'],['fa','فارسی'],['pa','ਪੰਜਾਬੀ'],['qu','Runa Simi'],
  ['sm','Samoa'],['sa','संस्कृतम्'],['gd','Gàidhlig'],['nso','Sesotho sa Leboa'],
  ['sr','Српски'],['st','Sesotho'],['sn','Shona'],['sd','سنڌي'],
  ['si','සිංහල'],['sk','Slovenčina'],['sl','Slovenščina'],['so','Soomaali'],
  ['su','Basa Sunda'],['sw','Kiswahili'],['tg','Тоҷикӣ'],['ta','தமிழ்'],
  ['tt','Татарча'],['te','తెలుగు'],['ti','ትግርኛ'],['ts','Xitsonga'],
  ['tk','Türkmen dili'],['ak','Twi'],['ur','اردو'],['ug','ئۇيغۇرچە'],
  ['uz','Oʻzbekcha'],['cy','Cymraeg'],['xh','isiXhosa'],['yi','ייִדיש'],
  ['yo','Yorùbá'],['zu','isiZulu']
];

const operators = [
  ['intitle:','Başlıkta ara','Kelimeyi sayfa başlığında arar.','intitle:iş ilanı'],
  ['allintitle:','Başlığın tamamı','Bütün kelimeleri sayfa başlığında arar.','allintitle:ev kiralık Ankara'],
  ['inurl:','Adres içinde ara','Kelimeyi internet adresinde arar.','inurl:login'],
  ['allinurl:','Adreste tüm kelimeler','Bütün kelimeleri internet adresinde arar.','allinurl:admin login'],
  ['intext:','Sayfa metninde ara','Kelimeyi sayfa metninde arar.','intext:OSINT'],
  ['allintext:','Metinde tüm kelimeler','Bütün kelimeleri sayfa metninde arar.','allintext:rapor analiz'],
  ['define:','Kelime anlamı','Kelimenin tanımını ve anlamını arar.','define:OSINT'],
  ['source:','Haber kaynağı','Google Haberler içinde belirli bir kaynağı arar.','source:bbc']
];

const logics = [
  ['exact','Tam ifadeyi ara','Aradığın ifadeyi tırnak içine alır.','"Ankara kiralık ev"'],
  ['or','Alternatif kelimeler','Kelimelerden herhangi biriyle eşleşen sonuçları arar.','Ankara OR İstanbul'],
  ['around','Yakın kelimeler','İki kelimenin birbirine yakın geçtiği sonuçları arar.','Ankara AROUND(3) kiralık'],
  ['wildcard','Eksik kelimeyi bul','Tırnak içindeki ifadede bilinmeyen kelimeyi yıldızla belirtir.','"Ankara * kiralık ev"'],
  ['group','Gruplandırılmış arama','Arama ifadesini parantez içine alarak diğer filtrelerle birlikte kullanır.','(Ankara OR İstanbul) kiralık ev']
];


const tactics = [
  ['maps','🗺️','Harita','Konum ve adres araması yapar.','maps'],
  ['weather','🌤️','Hava durumu','Şehrin hava durumunu açar.','weather'],
  ['images','🖼️','Görseller','Görsel aramasını açar.','images'],
  ['video','🎬','Videolar','Video sonuçlarını açar.','videos'],
  ['news','📰','Haberler','Haber sonuçlarını açar.','news'],
  ['shopping','🛒','Alışveriş','Ürün araması yapar.','shopping'],
  ['calculator','🧮','Hesap makinesi','Matematiksel işlemi hesaplar.','calculator'],
  ['trends','📊','Google Trends','Arama eğilimlerini gösterir.','trends'],
  ['stocks','📈','Borsa','Hisse senedi bilgilerini arar.','stocks'],
  ['unit','📏','Birim dönüştürme','Ölçü birimlerini dönüştürür.','birim dönüştürme'],
  ['books','📚','Kitaplar','Kitap sonuçlarını açar.','books'],
  ['scholar','🎓','Google Akademik','Bilimsel makale ve araştırmaları arar.','scholar'],
  ['patents','📜','Google Patentler','Patent ve buluş araştırması yapar.','patents'],
  ['calorie','🍎','Kalori','Yiyeceklerin kalorisini arar.','kalori'],
  ['color','🎨','Renk','Renk kodlarını arar.','renk kodu'],
  ['game','🎮','Oyun','Çevrim içi oyunları arar.','oyna']
];

const dorkPresets = [
  ['📄','PDF belgeleri',q=>[q,'filetype:pdf'].filter(Boolean).join(' ')],
  ['🏛️','Kamu belgeleri',q=>['site:gov.tr',q,'filetype:pdf'].filter(Boolean).join(' ')],
  ['🎓','Akademik belgeler',q=>['site:edu',q,'filetype:pdf'].filter(Boolean).join(' ')],
  ['📰','Rapor başlıkları',q=>['intitle:rapor',q].filter(Boolean).join(' ')],
  ['🔎','Tam ifade',q=>q?'"'+q.replace(/"/g,'')+'"':'filetype:pdf'],
  ['🌐','Alan adı içinde ara',q=>q?'site:'+q.replace(/^https?:\/\//,'').replace(/\/.*$/,''):'site:example.com']
];

const football = [
  ['Puan durumu','puan durumu'],['Fikstür','fikstür'],
  ['Gelecek maçlar','gelecek maçlar'],['Canlı maçlar','canlı maçlar'],
  ['Maç sonuçları','maç sonuçları'],['Takım istatistikleri','takım istatistikleri'],
  ['Transfer haberleri','transfer haberleri'],['Şampiyonlar Ligi','Şampiyonlar Ligi'],
  ['Süper Lig','Süper Lig'],['Premier League','Premier League'],
  ['La Liga','La Liga'],['Serie A','Serie A'],
  ['Bundesliga','Bundesliga'],['Milli maçlar','milli maçlar']
];

const aiAssistants = [
  ['ChatGPT','https://chatgpt.com/','OpenAI yapay zekâ asistanı'],
  ['Gemini','https://gemini.google.com/','Google yapay zekâ asistanı'],
  ['DeepSeek','https://chat.deepseek.com/','DeepSeek yapay zekâ asistanı'],
  ['Claude','https://claude.ai/','Anthropic yapay zekâ asistanı'],
  ['Microsoft Copilot','https://copilot.microsoft.com/','Microsoft yapay zekâ asistanı'],
  ['Perplexity','https://www.perplexity.ai/','Yapay zekâ destekli araştırma']
];

const countries = [
  ['www.google.com.tr','Türkiye','tr','tr'],
  ['www.google.af','Afganistan','af','fa'],
  ['www.google.com','ABD / Global','us','en'],
  ['www.google.vi','ABD Virjin Adaları','vi','en'],
  ['www.google.as','Amerikan Samoası','as','en'],
  ['www.google.com.ag','Antigua ve Barbuda','ag','en'],
  ['www.google.com.ar','Arjantin','ar','es'],
  ['www.google.com.au','Avustralya','au','en'],
  ['www.google.at','Avusturya','at','de'],
  ['www.google.az','Azerbaycan','az','az'],
  ['www.google.ae','BAE','ae','ar'],
  ['www.google.bs','Bahamalar','bs','en'],
  ['www.google.com.bh','Bahreyn','bh','ar'],
  ['www.google.com.bd','Bangladeş','bd','bn'],
  ['www.google.be','Belçika','be','nl'],
  ['www.google.bz','Belize','bz','en'],
  ['www.google.bj','Benin','bj','fr'],
  ['www.google.bo','Bolivya','bo','es'],
  ['www.google.ba','Bosna-Hersek','ba','bs'],
  ['www.google.bw','Botsvana','bw','en'],
  ['www.google.com.br','Brezilya','br','pt'],
  ['www.google.vg','Britanya Virjin Adaları','vg','en'],
  ['www.google.bg','Bulgaristan','bg','bg'],
  ['www.google.bf','Burkina Faso','bf','fr'],
  ['www.google.bi','Burundi','bi','fr'],
  ['www.google.bt','Butan','bt','dz'],
  ['www.google.gi','Cebelitarık','gi','en'],
  ['www.google.dj','Cibuti','dj','ar'],
  ['www.google.td','Çad','td','fr'],
  ['www.google.cz','Çekya','cz','cs'],
  ['www.google.cn','Çin','cn','zh-CN'],
  ['www.google.dk','Danimarka','dk','da'],
  ['www.google.tl','Doğu Timor','tl','pt'],
  ['www.google.dm','Dominika','dm','en'],
  ['www.google.com.do','Dominik Cumhuriyeti','do','es'],
  ['www.google.ec','Ekvador','ec','es'],
  ['www.google.gq','Ekvator Ginesi','gq','es'],
  ['www.google.com.sv','El Salvador','sv','es'],
  ['www.google.co.id','Endonezya','id','id'],
  ['www.google.er','Eritre','er','ti'],
  ['www.google.am','Ermenistan','am','hy'],
  ['www.google.ee','Estonya','ee','et'],
  ['www.google.sz','Esvatini','sz','en'],
  ['www.google.et','Etiyopya','et','am'],
  ['www.google.ma','Fas','ma','ar'],
  ['www.google.ci','Fildişi Sahili','ci','fr'],
  ['www.google.com.ph','Filipinler','ph','en'],
  ['www.google.ps','Filistin','ps','ar'],
  ['www.google.fj','Fiji','fj','en'],
  ['www.google.fi','Finlandiya','fi','fi'],
  ['www.google.fr','Fransa','fr','fr'],
  ['www.google.ga','Gabon','ga','fr'],
  ['www.google.gm','Gambiya','gm','en'],
  ['www.google.gh','Gana','gh','en'],
  ['www.google.gd','Grenada','gd','en'],
  ['www.google.gl','Grönland','gl','kl'],
  ['www.google.gp','Guadeloupe','gp','fr'],
  ['www.google.gu','Guam','gu','en'],
  ['www.google.gt','Guatemala','gt','es'],
  ['www.google.gg','Guernsey','gg','en'],
  ['www.google.gn','Gine','gn','fr'],
  ['www.google.gw','Gine-Bissau','gw','pt'],
  ['www.google.gy','Guyana','gy','en'],
  ['www.google.co.za','Güney Afrika','za','en'],
  ['www.google.co.kr','Güney Kore','kr','ko'],
  ['www.google.ge','Gürcistan','ge','ka'],
  ['www.google.ht','Haiti','ht','fr'],
  ['www.google.in','Hindistan','in','en'],
  ['www.google.hn','Honduras','hn','es'],
  ['www.google.com.hk','Hong Kong','hk','zh-TW'],
  ['www.google.nl','Hollanda','nl','nl'],
  ['www.google.iq','Irak','iq','ar'],
  ['www.google.co.uk','İngiltere','gb','en'],
  ['www.google.ie','İrlanda','ie','en'],
  ['www.google.es','İspanya','es','es'],
  ['www.google.co.il','İsrail','il','he'],
  ['www.google.se','İsveç','se','sv'],
  ['www.google.ch','İsviçre','ch','de'],
  ['www.google.it','İtalya','it','it'],
  ['www.google.is','İzlanda','is','is'],
  ['www.google.jm','Jamaika','jm','en'],
  ['www.google.co.jp','Japonya','jp','ja'],
  ['www.google.je','Jersey','je','en'],
  ['www.google.com.kh','Kamboçya','kh','km'],
  ['www.google.ca','Kanada','ca','en'],
  ['www.google.qa','Katar','qa','ar'],
  ['www.google.me','Karadağ','me','sr'],
  ['www.google.kz','Kazakistan','kz','kk'],
  ['www.google.ke','Kenya','ke','en'],
  ['www.google.ki','Kiribati','ki','en'],
  ['www.google.com.co','Kolombiya','co','es'],
  ['www.google.mp','Kuzey Mariana Adaları','mp','en'],
  ['www.google.mk','Kuzey Makedonya','mk','mk'],
  ['www.google.kw','Kuveyt','kw','ar'],
  ['www.google.kg','Kırgızistan','kg','ky'],
  ['www.google.la','Laos','la','lo'],
  ['www.google.ls','Lesotho','ls','en'],
  ['www.google.lv','Letonya','lv','lv'],
  ['www.google.lr','Liberya','lr','en'],
  ['www.google.ly','Libya','ly','ar'],
  ['www.google.li','Liechtenstein','li','de'],
  ['www.google.lt','Litvanya','lt','lt'],
  ['www.google.lu','Lüksemburg','lu','fr'],
  ['www.google.lb','Lübnan','lb','ar'],
  ['www.google.hu','Macaristan','hu','hu'],
  ['www.google.mo','Makao','mo','zh-TW'],
  ['www.google.mg','Madagaskar','mg','mg'],
  ['www.google.mw','Malavi','mw','en'],
  ['www.google.com.my','Malezya','ms','en'],
  ['www.google.mv','Maldivler','mv','dv'],
  ['www.google.ml','Mali','ml','fr'],
  ['www.google.mt','Malta','mt','mt'],
  ['www.google.im','Man Adası','im','en'],
  ['www.google.mh','Marshall Adaları','mh','en'],
  ['www.google.mq','Martinik','mq','fr'],
  ['www.google.com.mx','Meksika','mx','es'],
  ['www.google.yt','Mayotte','yt','fr'],
  ['www.google.fm','Mikronezya','fm','en'],
  ['www.google.md','Moldova','md','ro'],
  ['www.google.mc','Monako','mc','fr'],
  ['www.google.mn','Moğolistan','mn','mn'],
  ['www.google.ms','Montserrat','ms','en'],
  ['www.google.mr','Moritanya','mr','ar'],
  ['www.google.mu','Mauritius','mu','en'],
  ['www.google.mz','Mozambik','mz','pt'],
  ['www.google.mm','Myanmar (Burma)','mm','my'],
  ['www.google.com.eg','Mısır','eg','ar'],
  ['www.google.na','Namibya','na','en'],
  ['www.google.nr','Nauru','nr','en'],
  ['www.google.com.np','Nepal','np','ne'],
  ['www.google.ni','Nikaragua','ni','es'],
  ['www.google.ne','Nijer','ne','fr'],
  ['www.google.ng','Nijerya','ng','en'],
  ['www.google.nu','Niue','nu','en'],
  ['www.google.no','Norveç','no','no'],
  ['www.google.om','Umman','om','ar'],
  ['www.google.uz','Özbekistan','uz','uz'],
  ['www.google.com.pk','Pakistan','pk','en'],
  ['www.google.pw','Palau','pw','en'],
  ['www.google.pa','Panama','pa','es'],
  ['www.google.com.pg','Papua Yeni Gine','pg','en'],
  ['www.google.py','Paraguay','py','es'],
  ['www.google.com.pe','Peru','pe','es'],
  ['www.google.pn','Pitcairn Adaları','pn','en'],
  ['www.google.pl','Polonya','pl','pl'],
  ['www.google.pt','Portekiz','pt','pt'],
  ['www.google.pr','Porto Riko','pr','es'],
  ['www.google.re','Reunion','re','fr'],
  ['www.google.ro','Romanya','ro','ro'],
  ['www.google.ru','Rusya','ru','ru'],
  ['www.google.rw','Ruanda','rw','rw'],
  ['www.google.sh','Saint Helena','sh','en'],
  ['www.google.kn','Saint Kitts ve Nevis','kn','en'],
  ['www.google.lc','Saint Lucia','lc','en'],
  ['www.google.pm','Saint Pierre ve Miquelon','pm','fr'],
  ['www.google.vc','Saint Vincent ve Grenadinler','vc','en'],
  ['www.google.ws','Samoa','ws','sm'],
  ['www.google.sm','San Marino','sm','it'],
  ['www.google.st','Sao Tome ve Principe','st','pt'],
  ['www.google.sn','Senegal','sn','fr'],
  ['www.google.sc','Seyşeller','sc','en'],
  ['www.google.rs','Sırbistan','rs','sr'],
  ['www.google.sl','Sierra Leone','sl','en'],
  ['www.google.com.sg','Singapur','sg','en'],
  ['www.google.sk','Slovakya','sk','sk'],
  ['www.google.si','Slovenya','si','sl'],
  ['www.google.sb','Solomon Adaları','sb','en'],
  ['www.google.so','Somali','so','so'],
  ['www.google.lk','Sri Lanka','lk','si'],
  ['www.google.sd','Sudan','sd','ar'],
  ['www.google.sa','Suudi Arabistan','sa','ar'],
  ['www.google.sr','Surinam','sr','nl'],
  ['www.google.sy','Suriye','sy','ar'],
  ['www.google.tj','Tacikistan','tj','tg'],
  ['www.google.tz','Tanzanya','tz','sw'],
  ['www.google.co.th','Tayland','th','th'],
  ['www.google.com.tw','Tayvan','tw','zh-TW'],
  ['www.google.tk','Tokelau','tk','en'],
  ['www.google.to','Tonga','to','to'],
  ['www.google.tt','Trinidad ve Tobago','tt','en'],
  ['www.google.tn','Tunus','tn','ar'],
  ['www.google.tm','Türkmenistan','tm','tk'],
  ['www.google.tc','Turks ve Caicos Adaları','tc','en'],
  ['www.google.tv','Tuvalu','tv','en'],
  ['www.google.ug','Uganda','ug','en'],
  ['www.google.ua','Ukrayna','ua','uk'],
  ['www.google.uy','Uruguay','uy','es'],
  ['www.google.vu','Vanuatu','vu','en'],
  ['www.google.va','Vatikan','va','it'],
  ['www.google.ve','Venezuela','ve','es'],
  ['www.google.com.vn','Vietnam','vn','vi'],
  ['www.google.wf','Wallis ve Futuna','wf','fr'],
  ['www.google.ye','Yemen','ye','ar'],
  ['www.google.cv','Yeşil Burun Adaları','cv','pt'],
  ['www.google.nc','Yeni Kaledonya','nc','fr'],
  ['www.google.co.nz','Yeni Zelanda','nz','en'],
  ['www.google.gr','Yunanistan','gr','el'],
  ['www.google.zm','Zambiya','zm','en'],
  ['www.google.zw','Zimbabve','zw','en']
];

// Google'ın desteklediği sonuç dili filtreleri
const resultLanguages = [
  ['auto','Ülkenin varsayılan dili'],
  ['lang_ar','Arapça'],
  ['lang_bg','Bulgarca'],
  ['lang_ca','Katalanca'],
  ['lang_zh-CN','Çince (Basitleştirilmiş)'],
  ['lang_zh-TW','Çince (Geleneksel)'],
  ['lang_hr','Hırvatça'],
  ['lang_cs','Çekçe'],
  ['lang_da','Danca'],
  ['lang_nl','Felemenkçe'],
  ['lang_en','İngilizce'],
  ['lang_et','Estonca'],
  ['lang_fi','Fince'],
  ['lang_fr','Fransızca'],
  ['lang_de','Almanca'],
  ['lang_el','Yunanca'],
  ['lang_iw','İbranice'],
  ['lang_hu','Macarca'],
  ['lang_is','İzlandaca'],
  ['lang_id','Endonezce'],
  ['lang_it','İtalyanca'],
  ['lang_ja','Japonca'],
  ['lang_ko','Korece'],
  ['lang_lv','Letonca'],
  ['lang_lt','Litvanca'],
  ['lang_no','Norveççe'],
  ['lang_pl','Lehçe'],
  ['lang_pt','Portekizce'],
  ['lang_ro','Romence'],
  ['lang_ru','Rusça'],
  ['lang_sr','Sırpça'],
  ['lang_sk','Slovakça'],
  ['lang_sl','Slovence'],
  ['lang_es','İspanyolca'],
  ['lang_sv','İsveççe'],
  ['lang_tr','Türkçe']
];

// Tarayıcıdaki aktif Google ülkesini algıla.
// Kullanıcı panelden ülke seçtiyse otomatik algılama üzerine yazmaz.
const detectedCountry =
  countries.find(c =>
    c[0].replace(/^www\./,'') ===
    location.hostname.replace(/^www\./,'')
  ) || countries[0];

if(state.countryManual !== true) {
  state.country = detectedCountry[0];
}

state.resultLanguage = state.resultLanguage || 'auto';

const fileGroups = [
['Belgeler',['pdf','doc','docx','odt','rtf','txt','epub','mobi','djvu','chm']],
  ['Tablolar',['xls','xlsx','csv','ods','tsv']],
  ['Sunumlar',['ppt','pptx','odp']],
  ['Sıkıştırma ve arşiv',['zip','rar','7z','tar','gz','bz2','xz','iso']],
  ['Görsel ve tasarım',['jpg','jpeg','png','gif','svg','webp','psd','ai','eps','dwg','dxf','kml','kmz']],
  ['Ses ve video',['mp3','wav','mp4','avi','mov','mkv']],
  ['Veri ve yazılım',['json','xml','html','css','js','sql','db','log','apk','exe','yaml','yml','ini','cfg','conf','py','java','c','cpp','h','php','rb','go','rs','sh','bat','ts','swift','kt']]
];

const root = document.createElement('div');
root.id = 'goai-root';
document.documentElement.appendChild(root);


const style = document.createElement('style');
style.textContent = `
/* 01 - TEMEL PANEL */
#goai-root{all:initial;font-family:Inter,Segoe UI,Arial,sans-serif;color:#edf2ff}
#goai-launch{position:fixed;right:20px;bottom:20px;z-index:2147483646;background:linear-gradient(135deg,#695cf0,#287bdc);border:0;border-radius:50px;color:white;padding:13px 18px;font-size:13px;font-weight:800;box-shadow:0 8px 35px #0007;cursor:pointer}
#goai-panel{position:fixed;z-index:2147483645;right:16px;bottom:78px;width:min(410px,calc(100vw - 24px));height:min(740px,calc(100vh - 100px));background:#101626;color:#eef2ff;border:1px solid #303d59;border-radius:18px;box-shadow:0 20px 70px #000a;display:none;overflow:hidden;font-size:12px}
#goai-panel.open{display:flex;flex-direction:column}
#goai-panel.goai-translating #goai-scroll,#goai-panel.goai-translating #goai-explain,#goai-panel.goai-translating #goai-head{visibility:hidden}
#goai-scroll{padding:8px 9px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:7px;min-height:0;flex:1;scrollbar-width:thin;scrollbar-color:#455779 #101626}
/* 02 - ÜST BAŞLIK */
#goai-head{flex:0 0 auto;padding:9px 10px;background:linear-gradient(120deg,#1b2850,#29265a);display:flex;align-items:center;justify-content:space-between;gap:7px}
#goai-head .goai-brand{flex:1;min-width:0}
#goai-head strong{font-size:13px}
#goai-head small{display:block;color:#b7c4ed;margin-top:3px;font-size:10px}
#goai-head .goai-head-actions{flex:0 0 auto;white-space:nowrap}
#goai-ui-language{width:91px;max-width:91px;flex:0 0 91px;padding:6px 4px;font-size:10px}
#goai-ui-apply{flex:0 0 auto;padding:7px 8px;font-size:10px;border-radius:7px;white-space:nowrap}
.goai-icon{border:1px solid #53618b;background:#263353;color:white;border-radius:8px;padding:6px 10px;cursor:pointer}
/* 03 - GENEL YAZI STANDARDI */
#goai-panel .goai-title{color:#9eafd4;font-size:11px;font-weight:800;letter-spacing:.35px;line-height:1.4;margin:0 0 6px;text-transform:uppercase}
#goai-panel .goai-choice b{font-size:11px;font-weight:750;display:block;line-height:1.4}
#goai-panel .goai-choice small{font-size:10px;color:#b2c1e2;display:block;margin-top:3px;line-height:1.4}
#goai-panel .goai-muted{font-size:10px;color:#93a4c7;line-height:1.4}
.goai-muted-label{font-size:10px;color:#9eafd3;display:block;margin-bottom:4px}
.goai-inline-note{font-size:9px;color:#8fa4c9;margin-top:6px}
/* 04 - KARTLAR VE BÖLÜMLER */
.goai-card{border:1px solid #2b3a57;background:#151f34;border-radius:10px;padding:8px;min-width:0}
.goai-section-gap{margin-top:8px}
.goai-divider{height:1px;background:#2d3d5a;margin:7px 0}
/* 05 - YATAY KART DÜZENİ */
.goai-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.goai-grid.operator-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
.goai-grid.operator-grid .goai-choice{padding:8px 5px;border-radius:7px}
.goai-grid.operator-grid .goai-choice b{font-size:11px}
.goai-grid.operator-grid .goai-choice small{font-size:9px;line-height:1.3;margin-top:2px}
.goai-choice{background:#1b2945;border:1px solid #354969;color:#e8efff;border-radius:9px;padding:9px 8px;text-align:left;cursor:pointer;min-width:0;transition:background .18s ease,border-color .18s ease,transform .15s ease,box-shadow .18s ease}
.goai-choice:hover{background:#26395e;border-color:#718bd0;box-shadow:0 3px 12px #0003}
.goai-choice:active{transform:scale(.97)}
.goai-choice.active{border-color:#92a5ff;background:#33477d;box-shadow:inset 0 0 0 1px #92a5ff44,0 3px 12px #536fd533}
.goai-operator{padding:9px 8px;text-align:left;min-height:40px}
/* 06 - ARAMA SEKMELERİ VE BUTONLARI */
.goai-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
.goai-tab{background:#18233b;border:1px solid #2e3c5b;color:#aebcdb;border-radius:8px;padding:8px 3px;font-size:10px;font-weight:800;cursor:pointer}
.goai-tab.active{background:#344b87;border-color:#849cff;color:white}
.goai-btn{border:1px solid #3a4c70;background:#1c2944;color:#eaf0ff;border-radius:8px;padding:8px 9px;cursor:pointer;font-weight:700;font-size:10px;white-space:nowrap}
.goai-btn.search{background:#2769bd;border-color:#438be2;color:white}
.goai-btn.copy{background:#245b50;border-color:#368b75;color:white}
.goai-btn.clear{background:#572d3a;border-color:#a34e65;color:#ffdce3}
/* 07 - GİRİŞ ALANLARI */
.goai-inputrow{display:flex;gap:5px;align-items:center}
.goai-input{width:100%;min-width:0;box-sizing:border-box;background:#080e1a;border:1px solid #364665;border-radius:9px;padding:9px;color:white;outline:none;font-size:11px}
.goai-input:focus{border-color:#8c9cff;box-shadow:0 0 0 2px #657bff22}
.goai-query{flex:1}
.goai-row{display:flex;gap:6px;align-items:center}
.goai-row>*{flex:1;min-width:0}
.goai-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.goai-form-grid .wide{grid-column:1/-1}
.goai-form-grid label{min-width:0}
.goai-action{width:100%;margin-top:8px}
/* 08 - AÇILIR MENÜLER */
.goai-drawer{border:1px solid #334463;border-radius:9px;background:#17243d;overflow:hidden}
.goai-drawer summary{padding:9px;cursor:pointer;font-weight:800;color:#dce7ff;list-style:none;font-size:11px;line-height:1.4}
.goai-drawer summary:hover{background:#223354}
.goai-drawer summary::-webkit-details-marker{display:none}
.goai-drawer summary:after{content:'＋';float:right;color:#9db2e4}
.goai-drawer[open] summary:after{content:'−'}
.goai-drawer-content{padding:7px;border-top:1px solid #2c3e60}
.goai-drawer .goai-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
.goai-drawer .goai-choice{padding:8px 6px;border-radius:8px}
.goai-drawer .goai-choice b{font-size:11px;line-height:1.35;font-weight:700}
.goai-drawer .goai-choice small{font-size:10px;line-height:1.35;margin-top:3px}
/* 09 - ÖNİZLEME VE ARAMA ETİKETLERİ */
.goai-preview{display:flex;flex-wrap:wrap;gap:5px;overflow-wrap:anywhere}
.goai-token{background:#263754;border:1px solid #455d81;color:#e1eaff;border-radius:7px;padding:5px 7px;font-size:9px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.goai-token:hover{background:#713747;border-color:#ff8298}
.goai-token b{color:#ff8b9e;font-size:13px;line-height:10px}
.goai-preview-head{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;margin-bottom:6px}
.goai-preview-head .goai-title{margin:0!important;flex:1 1 auto}
.goai-preview-head #goai-token-count{flex:0 0 auto;margin:0!important;text-align:right;white-space:nowrap;color:#A8B8D0;font-size:10px}
/* 10 - ASİSTAN AÇIKLAMA ALANI */
#goai-explain{flex:0 0 auto;margin:8px 10px 0;padding:8px 10px 8px 12px;border:1px solid #65502b;border-left:4px solid #ffb52e;background:linear-gradient(110deg,#292313,#20243b 75%);border-radius:9px;max-height:105px;overflow:auto;box-shadow:0 0 12px #ffb52e12}
#goai-explain small{display:block;color:#ffc75e;font-size:9px;font-weight:900;letter-spacing:.7px;margin-bottom:4px}
#goai-explain strong{font-size:11px;display:block;margin-bottom:3px;color:#fff0c9}
#goai-explain p{font-size:10px;line-height:1.4;color:#e4ddc8;margin:0}
.goai-example{margin-top:5px;padding:5px 7px;background:#302a1d;border-radius:5px;color:#ffdb91;font-size:9px}
#goai-explain .goai-explain-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}
#goai-explain .goai-explain-head small{display:block;margin:0;white-space:nowrap;flex:0 1 auto}
#goai-explain #goai-panel-search{width:138px;max-width:48%;min-width:90px;padding:5px 7px;font-size:10px;border-radius:7px;flex:0 1 138px}
#goai-explain #goai-explain-body>strong{margin-bottom:3px}
#goai-content [hidden]{display:none!important}
#goai-explain{scrollbar-width:thin;scrollbar-color:#526b91 transparent}
#goai-explain::-webkit-scrollbar{width:6px}
#goai-explain::-webkit-scrollbar-track{background:transparent;border-radius:10px}
#goai-explain::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6688b8,#405879);border-radius:10px}
#goai-explain::-webkit-scrollbar-thumb:hover{background:#82a7dc}
/* 11 - ÇEVİRİ ALANI */
.goai-translation-result{white-space:pre-wrap;overflow-wrap:anywhere;min-height:55px;padding:9px;background:#080e1a;border:1px solid #364665;border-radius:9px;color:#eef2ff;font-size:11px;line-height:1.5}
.goai-translation-result.empty{color:#8190ad;font-style:italic}
/* 12 - ARAMA GEÇMİŞİ: MEVCUT YAZI DÜZENİ KORUNUR */
.goai-history{position:relative;display:flex;align-items:center;flex-wrap:nowrap;gap:3px;min-height:27px;padding:3px 0;border-bottom:1px solid #26334a;box-sizing:border-box;overflow:visible;font-family:"Arial Narrow","Roboto Condensed","Segoe UI",sans-serif!important;font-stretch:condensed;letter-spacing:-.2px}
.goai-history-info{flex:1 1 0;min-width:0;overflow:hidden;white-space:nowrap;text-align:left;cursor:default}
.goai-history-label{display:flex;align-items:center;gap:4px;width:100%;min-width:0;overflow:hidden;white-space:nowrap;font-size:11px!important;font-weight:500!important;line-height:1.5;letter-spacing:.05px}
.goai-history-label span{display:inline-flex;align-items:center;flex:0 1 auto;min-width:0;max-width:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px!important;font-weight:500;line-height:1.4}
.goai-history-query{max-width:none;padding:0;margin:0;border:0;border-radius:0;background:transparent;color:#e6c47a!important;font-weight:600!important}
.goai-history-action{color:#8bd49b!important;font-weight:600!important}
.goai-history-result{max-width:none;color:#80caff!important;font-weight:600!important}
.goai-history-source,.goai-history-type{flex-shrink:0!important;padding:0;border:0;background:transparent;color:#aebbd0!important;font-size:10px!important}
.goai-history-kind{display:none!important}
.goai-history-time{flex:0 0 42px;width:42px;min-width:42px;color:#A8B8D0!important;font-family:Consolas,"Cascadia Code","Courier New",monospace!important;font-size:10px!important;font-weight:500!important;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;opacity:1!important}
.goai-history .goai-btn{display:inline-flex;align-items:center;justify-content:center;flex:0 0 18px;width:18px;min-width:18px;height:21px;padding:0;margin:0;border:0;border-radius:4px;background:transparent;color:#9aabc5;font-size:12px;line-height:1;box-shadow:none}
.goai-history .goai-btn:hover{background:#263650;color:#ffffff}
.goai-history .goai-btn.clear{border:0;background:transparent;color:#c27c89}
.goai-history .goai-btn.clear:hover{background:#482b39;color:#ff9aaa}
.goai-history .goai-copy-link{color:#8eb9e8}
.goai-history-label span[style*="#70cfff"]{color:#67c9ff!important;font-weight:700!important}
.goai-history-label span[style*="#ffdb78"]{color:#e9c46a!important}
.goai-history-label span[style*="#70e5a2"]{color:#80d99a!important}
.goai-history-label span[style*="#ffc875"]{color:#e8a96b!important}
.goai-history-label span[style*="#71819e"]{color:#ff2bd6!important;font-size:15px!important;font-weight:900!important;text-shadow:0 0 5px #ff2bd688}
.goai-history[data-type="football"] .goai-history-query,.goai-history[data-type="tactic"] .goai-history-query{color:#c792ea!important}
.goai-history[data-type="map"] .goai-history-query{color:#56d6c9!important}
.goai-history[data-type="flight"] .goai-history-query{color:#82baff!important}
.goai-history[data-type="currency"] .goai-history-query{color:#80d99a!important}
.goai-history[data-type="translate"] .goai-history-query,.goai-history[data-type="translate"] .goai-history-result{color:#80caff!important}
/* 13 - GEÇMİŞ İKONLARI */
.goai-history-icon{display:flex;align-items:center;justify-content:center;flex:0 0 32px;width:32px;height:32px;min-height:32px;padding:0;margin:0;border:0!important;border-radius:5px;background:transparent!important;color:#dce7ff;cursor:help;transition:background .15s,color .15s}
.goai-history-icon:hover{background:#30466b!important;color:#ffffff}
.goai-history-icon-symbol{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:18px!important;line-height:1;white-space:nowrap;font-family:"Segoe UI Emoji","Apple Color Emoji",sans-serif!important}
.goai-history-icon-label{display:none!important}
.goai-history-icon:has(.goai-history-icon-symbol){white-space:nowrap;flex:0 0 auto!important;width:auto!important;padding:0 7px}
/* 14 - GEÇMİŞ İŞLEM MENÜSÜ */
.goai-history-more{position:relative;z-index:5;flex:0 0 12px;width:12px;min-width:12px;height:20px;display:flex;align-items:center;justify-content:center}
.goai-history-more summary{display:flex;align-items:center;justify-content:center;width:18px;height:22px;padding:0;border:0;border-radius:4px;background:transparent;color:#9aabc5;font-size:17px;font-weight:400;line-height:1;cursor:pointer;list-style:none}
.goai-history-more summary::-webkit-details-marker{display:none}
.goai-history-more summary:hover{color:#dce7ff}
.goai-history-more[open] summary{color:#dce7ff;transform:rotate(180deg)}
.goai-history-popup{position:absolute;left:0;bottom:calc(100% + 7px);z-index:9999;display:none;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center;justify-content:flex-start;gap:7px;width:max-content;max-width:calc(100vw - 36px);max-height:60px;overflow-x:auto;overflow-y:hidden;padding:8px 10px;border:1px solid #405575;border-radius:8px;background:#111c30;box-shadow:0 8px 24px #0008;box-sizing:border-box}
.goai-history-more[open] .goai-history-popup{display:flex}
.goai-history-popup .goai-history-icon{flex:0 0 32px!important;width:32px;height:32px}
/* 15 - GEÇMİŞ ÇEVİRİ BAYRAKLARI */
.goai-history-label .goai-flag{display:inline-flex!important;flex:0 0 auto!important;align-items:center;justify-content:center;width:22px!important;min-width:22px!important;max-width:22px!important;overflow:visible!important;font-family:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif!important;font-size:19px!important;line-height:1.3;text-overflow:clip!important}
/* 16 - GÜNLÜK KAYIT GRUPLARI */
.goai-day-drawer{border:1px solid #334463;border-radius:8px;margin:5px 0;background:#121e33;overflow:visible}
.goai-day-drawer summary{padding:9px;cursor:pointer;list-style:none;color:#dce7ff;font-size:11px;font-weight:800}
.goai-day-drawer summary::-webkit-details-marker{display:none}
.goai-day-drawer summary:after{content:'＋';float:right;color:#9db2e4}
.goai-day-drawer[open] summary:after{content:'−'}
.goai-day-content{padding:5px 9px;border-top:1px solid #2c3e60}
.goai-day-actions{display:flex;gap:5px;flex-wrap:wrap;padding:6px 0 8px;border-bottom:1px solid #2d3a54;margin-bottom:4px}
.goai-day-actions .goai-btn{flex:1;padding:6px 5px;font-size:9px}
/* 17 - SİSTEM BİLGİLERİ */
.goai-system{display:flex;flex-wrap:wrap;gap:5px}
.goai-system div{background:#0d1729;border:1px solid #263a5a;border-radius:7px;padding:5px 7px;min-width:0;flex:1 1 28%}
.goai-system small{display:block;color:#91a6cc;font-size:8px;margin-bottom:2px}
.goai-system b{display:block;font-size:9px;overflow-wrap:anywhere}
.goai-full{flex-basis:100%!important}
/* 18 - YARDIMCI SINIFLAR */
.goai-hidden{display:none!important}
.goai-drawer:has(#goai-history-list){overflow:visible}
/* 19 - DAR EKRAN UYUMU */
@media(max-width:360px){
#goai-panel{right:8px;width:calc(100vw - 16px)}
.goai-grid.operator-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.goai-drawer .goai-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.goai-tabs{gap:3px}
}
`;
document.head.appendChild(style);

root.innerHTML = `
<button id="goai-launch">✦ efem360</button>
<section id="goai-panel">
  <header id="goai-head">
    <div class="goai-brand"><strong>✦ efem360 ASSISTANT</strong><small id="goai-dynamic-slogan">Her pikselinde alın teri var.</small></div>
    <select class="goai-input" id="goai-ui-language" aria-label="Panel dili" title="Panel dili">${languages.filter(l=>l[0]!=='auto').map(l=>`<option value="${l[0]}" ${state.uiLanguage===l[0]?'selected':''}>${esc(l[1])}</option>`).join('')}</select>
    <button type="button" class="goai-btn search" id="goai-ui-apply" title="Seçilen panel dilini indir ve uygula">Uygula</button>
    <div class="goai-head-actions"><button class="goai-icon" id="goai-min">−</button> <button class="goai-icon" id="goai-close">×</button></div>
  </header>

  <div id="goai-explain">
  <div class="goai-explain-head">
    <small>✦ ASİSTAN AÇIKLAMASI</small>
    <input id="goai-panel-search" class="goai-input" type="search" placeholder="⌕ Panelde ara..." autocomplete="off">
  </div>
  <div id="goai-explain-body">
    <strong>Nasıl yardımcı olabilirim?</strong>
    <p>Arama kutusuna bir şehir, kişi, konu veya kelime yaz. Sonra aşağıdaki araçlardan birini seç.</p>
    <div class="goai-example">Örnek: Ankara hava durumu</div>
  </div>
</div>

  <div id="goai-scroll">
    <div class="goai-inputrow">
      <input id="goai-query" class="goai-input goai-query" placeholder="Ne aramak istiyorsun?">
      <button class="goai-btn search" id="goai-search" title="Google'da ara" aria-label="Google'da ara">⌕</button>
      <button class="goai-btn copy" id="goai-copy" title="Aramayı kopyala" aria-label="Kopyala">📋</button>
      <button class="goai-btn clear" id="goai-clear" title="Arama alanını temizle" aria-label="Temizle">×</button>
    </div>

    <nav class="goai-tabs">
      <button class="goai-tab active" data-tab="search">Arama</button>
      <button class="goai-tab" data-tab="tactics">Keşfet</button>
      <button class="goai-tab" data-tab="translate">Çevirici</button>
      <button class="goai-tab" data-tab="tools">Araçlar</button>
    </nav>

    <div id="goai-content"></div>


<div class="goai-card">
  <div class="goai-preview-head">
    <div class="goai-title">Hazırlanan arama</div>
    <div class="goai-muted" id="goai-token-count">0 aktif ayar</div>
  </div>
  <div class="goai-preview" id="goai-preview">
    Henüz seçim yapılmadı.
  </div>
</div>
</section>`;

const slogans = [
  "Her pikselinde alın teri var.",
  "Satır satır işlendi.",
  "Sabırla örüldü, özenle sunuldu.",
  "Gecelerin uykusuzluğu, gündüzlerin emeği.",
  "Arka planda büyük bir mesai var.",
  "İnce işçilik, sağlam altyapı.",
  "Her detayı tek tek düşünüldü.",
  "Sadece kod değil, zanaat.",
  "Kopyala-yapıştır değil, el emeği.",
  "Görünmeyen yerde büyük emek var.",
  "Sen rahat et diye çok uğraştık.",
  "Arkasında kocaman bir emek var.",
  "Senin için ilmek ilmek dokundu.",
  "Kolay görünüyorsa, çok uğraşıldığındandır."
];

let sloganIndex = 0;

setInterval(() => {
  const el = root.querySelector('#goai-dynamic-slogan');
  if (!el) return;
  sloganIndex = (sloganIndex + 1) % slogans.length;
  el.textContent = slogans[sloganIndex];
}, 5000);

const panel = $('#goai-panel');
const input = $('#goai-query');
    input.addEventListener('input',()=>{
  state.q=input.value;
  explainSearchSelection('Arama metni güncellendi');
  refreshPreview();
  save();
});
const scrollArea = $('#goai-scroll');
    const panelSearch = $('#goai-panel-search');
const panelContent = $('#goai-content');

function applyPanelSearch() {
  const term = (panelSearch.value || '').trim().toLocaleLowerCase('tr-TR');

  const matches = el =>
    (el.innerText || el.textContent || '').toLocaleLowerCase('tr-TR').includes(term);

  panelContent.querySelectorAll('.goai-choice,.goai-history,.goai-day-drawer').forEach(el => {
    el.hidden = !!term && !matches(el);
  });

  panelContent.querySelectorAll('.goai-grid').forEach(grid => {
    const choices = [...grid.querySelectorAll('.goai-choice')];
    if(choices.length) {
      grid.hidden = !!term && !choices.some(el => !el.hidden);
    }
  });

  panelContent.querySelectorAll('.goai-title').forEach(title => {
    const next = title.nextElementSibling;
    if(next && next.classList.contains('goai-grid')) {
      title.hidden = !!term && !matches(title) && next.hidden;
    }
  });

  panelContent.querySelectorAll('details.goai-drawer').forEach(drawer => {
    const summary = drawer.querySelector(':scope > summary');
    const visibleItems = [...drawer.querySelectorAll('.goai-choice,.goai-history,.goai-day-drawer')].some(el => !el.hidden);
    drawer.hidden = !!term && !(summary && matches(summary)) && !visibleItems;
  });
}

panelSearch.addEventListener('input',applyPanelSearch);

const panelSearchObserver = new MutationObserver(() => {
  if(panelSearch.value.trim()) applyPanelSearch();
});

panelSearchObserver.observe(panelContent,{childList:true,subtree:true});

function explain(title,desc,example='') {
  $('#goai-explain-body').innerHTML = `
    <strong>${esc(title)}</strong>
    <p>${esc(desc)}</p>
    ${example?`<div class="goai-example">${esc(example)}</div>`:''}`;
  if(typeof applyUiPackageToPanel === 'function') applyUiPackageToPanel();
}

function explainSearchSelection(action='') {
  const selectedOperators=Array.isArray(state.operator)
    ? state.operator
    : (state.operator ? [state.operator] : []);

  const selectedLogics=Array.isArray(state.logic)
    ? state.logic
    : (state.logic ? [state.logic] : []);

  const operatorNames=selectedOperators.map(op=>
    operators.find(x=>x[0]===op)?.[1] || op
  );

  const logicNames=selectedLogics.map(key=>
    logics.find(x=>x[0]===key)?.[1] || key
  );

  const warnings=[];

  const conflicts=[
    ['allintitle:','intitle:','Başlığın tamamı ve başlıkta ara birlikte seçilmiş. Bu seçimler birbirini tekrar edebilir.'],
    ['allinurl:','inurl:','Adresin tamamı ve adres içinde ara birlikte seçilmiş. Bu seçimler birbirini tekrar edebilir.'],
    ['allintext:','intext:','Metnin tamamı ve metin içinde ara birlikte seçilmiş. Bu seçimler birbirini tekrar edebilir.']
  ];

  conflicts.forEach(([a,b,message])=>{
    if(selectedOperators.includes(a)&&selectedOperators.includes(b)) {
      warnings.push(message);
    }
  });

  if(selectedOperators.includes('source:')) {
    warnings.push('source: operatörü Google Haberler kaynak aramaları içindir. Normal web aramasında beklenen sonucu vermeyebilir.');
  }

  if(selectedOperators.includes('define:') && selectedOperators.length>1) {
    warnings.push('define: kelime tanımı aramasına yöneliktir. Diğer operatörlerle birlikte kullanıldığında sonuçlar daralabilir.');
  }

  const title=warnings.length
    ? 'Seçim uyumluluğu kontrolü'
    : 'Seçimler birlikte uygulanıyor';

  let description='';

  if(operatorNames.length) {
    description+='Aktif operatörler: '+operatorNames.join(', ')+'. ';
  }

  if(logicNames.length) {
    description+='Aktif arama biçimleri: '+logicNames.join(', ')+'. ';
  }

  if(!selectedOperators.length && !selectedLogics.length) {
    description='Akıllı arama biçimi ve operatör seçilmedi. Standart Google araması kullanılacak.';
  } else if(!warnings.length) {
    description+='Seçilen ayarlar birlikte kullanılabilir.';
  }

  if(action) description=action+'. '+description;

  if(warnings.length) {
    description+=' Uyarı: '+warnings.join(' ');
  }

  const example=state.q.trim()
    ? 'Arama ifadesi: '+state.q.trim()
    : 'Arama kutusuna bir ifade yazdığında seçimler uygulanır.';

  explain(title,description,example);
}

function countrySettings() {
  return countries.find(c=>c[0]===state.country) || countries[0];
}

function googleUrl(q,extra={}) {
  const p = new URLSearchParams();
  const country = countrySettings();

  // Arama metni
  p.set('q',q);

  // Seçilen ülkenin Google bölgesini kullan
  p.set('gl',country[2]);

  // Google arayüz dilini ülkenin varsayılan dilinde tut
  p.set('hl',country[3]);

  // Kullanıcı özel sonuç dili seçtiyse sonuçları o dile göre filtrele
  if(state.resultLanguage && state.resultLanguage !== 'auto') {
    p.set('lr',state.resultLanguage);
  }

  if(state.filters.includes('pws=0')) p.set('pws','0');
  if(state.mode) p.set('udm',state.mode);

  const tbs = state.filters
    .filter(x=>x.startsWith('tbs='))
    .map(x=>x.slice(4));

  if(tbs.length) p.set('tbs',tbs.join(','));

  Object.entries(extra).forEach(([k,v])=>p.set(k,v));

  return `https://${state.country}/search?${p.toString()}`;
}

function validDate(v) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v+'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0,10)===v;
}

function query() {
  let q = state.q.trim();

  const selectedLogic = Array.isArray(state.logic) ? state.logic : [];
  const selectedOperators = Array.isArray(state.operator) ? state.operator : [];

  // Birbiriyle çakışan temel arama biçimleri
  if(q) {
    if(selectedLogic.includes('exact')) {
      q='"'+q.replace(/"/g,'')+'"';
    }
    else if(selectedLogic.includes('or')) {
      q=q.split(/[\s,]+/).filter(Boolean).join(' OR ');
    }
    else if(selectedLogic.includes('around')) {
      const words=q.split(/\s+/);
      if(words.length>1) {
        q=words[0]+' AROUND(3) '+words.slice(1).join(' ');
      }
    }
    else if(selectedLogic.includes('wildcard')) {
      q='"'+q.replace(/"/g,'').trim().split(/\s+/).join(' * ')+'"';
    }

    // Gruplandırma diğer arama biçimleriyle birlikte kullanılabilir.
    if(selectedLogic.includes('group')) {
      q='('+q+')';
    }

    // Seçilen operatörleri Google sözdizimine uygun uygula.
if(selectedOperators.length) {
  const searchPhrase = q.trim();
  const phrase = searchPhrase.startsWith('"') &&
                 searchPhrase.endsWith('"')
    ? searchPhrase
    : '"' + searchPhrase.replace(/"/g,'') + '"';

  const operatorMap = {
    'intitle:':'allintitle:',
    'inurl:':'allinurl:',
    'intext:':'allintext:'
  };

  q = selectedOperators.map(op => {
    const normalizedOperator = operatorMap[op] || op;
    return normalizedOperator + phrase;
  }).join(' ');
}
  }

  if(state.site.trim()) {
    q+=' site:'+state.site.trim().replace(/^https?:\/\//,'').replace(/\/+$/,'');
  }

  if(state.urlPath.trim()) {
    const path=state.urlPath.trim().replace(/^\/+|\/+$/g,'');
    if(path) q+=' inurl:'+path;
  }

  if(state.exclude.trim()) {
    q+=' '+state.exclude.trim().split(/[,\s]+/).filter(Boolean)
      .map(x=>x.startsWith('-')?x:'-'+x).join(' ');
  }

  const filetypes=[...new Set(
    String(state.filetype||'')
      .split(/[,\s]+/)
      .map(x=>x.trim().replace(/^\./,'').toLowerCase())
      .filter(x=>/^[a-z0-9]{2,10}$/.test(x))
  )];

  if(filetypes.length===1) {
    q+=' filetype:'+filetypes[0];
  } else if(filetypes.length>1) {
    q+=' ('+filetypes.map(x=>'filetype:'+x).join(' OR ')+')';
  }

  if(validDate(state.after)) q+=' after:'+state.after;
  if(validDate(state.before)) q+=' before:'+state.before;

  return q.trim();
}

function log(url,label,meta={}) {
  const icons=Array.isArray(meta.icons)
    ?meta.icons.filter(x=>x&&x.icon)
    :[];

  state.history.unshift({
    url:url||'',
    label:label||'',
    copyText:meta.copyText||'',
    query:meta.query||'',
    action:meta.action||'',
    sourceLang:meta.sourceLang||'',
    targetLang:meta.targetLang||'',
    sourceText:meta.sourceText||'',
    translatedText:meta.translatedText||'',
    amount:meta.amount||'',
    from:meta.from||'',
    to:meta.to||'',
    converted:meta.converted||'',
    currencySource:meta.currencySource||'',
    currencyType:meta.currencyType||'',
    date:new Date().toLocaleString('tr-TR'),
    type:meta.type||'search',
    icons
  });

  state.history=state.history.slice(0,100);
  save();
}

function openUrl(url,label,meta={}) {
  log(url,label||state.q,meta);
  const w=window.open(url,'_blank');
  if(w) {
    try { w.opener=null; } catch(_) {}
  } else {
    window.location.href=url;
  }
}

function runSearch() {
  const q=query();
  if(!q) {
    input.focus();
    input.style.borderColor='#ff5269';
    return;
  }

  const icons=[
    {icon:'⌕',label:'Google araması'}
  ];

  if(state.logic.length) {
    icons.push({icon:'🧠',label:'Akıllı arama biçimi'});
  }

  if(state.site||state.urlPath||state.exclude||state.filetype||state.after||state.before) {
    icons.push({icon:'🎯',label:'Site ve dosya filtreleri'});
  }

  if(
    state.country!==defaults.country ||
    state.mode!=='14' ||
    state.filters.some(x=>x!=='pws=0')
  ) {
    icons.push({icon:'🌍',label:'Google ve arama tercihleri'});
  }

  openUrl(googleUrl(q),q,{
    type:'search',
    query:state.q.trim(),
    action:'Google araması',
    icons
  });
}

function refreshPreview() {
  const parts=[];
  if(state.q.trim()) parts.push({key:'q',label:'Arama: '+state.q.trim()});
  state.operator.forEach(op=>{
  const o=operators.find(x=>x[0]===op);
  parts.push({
    key:'operator:'+op,
    label:'Operatör: '+(o?o[1]:op)
  });
});

state.logic.forEach(logic=>{
  const l=logics.find(x=>x[0]===logic);
  parts.push({
    key:'logic:'+logic,
    label:'Arama biçimi: '+(l?l[1]:logic)
  });
});
  if(state.site) parts.push({key:'site',label:'Site: '+state.site});
  if(state.urlPath) parts.push({key:'urlPath',label:'URL yolu: '+state.urlPath});
  if(state.exclude) parts.push({key:'exclude',label:'Hariç tut: '+state.exclude});
  if(state.filetype) parts.push({key:'filetype',label:'Dosya: '+state.filetype});
  if(state.after) parts.push({key:'after',label:'Başlangıç: '+state.after});
  if(state.before) parts.push({key:'before',label:'Bitiş: '+state.before});
  if(state.mode) parts.push({key:'mode',label:'Görünüm: '+state.mode});

  state.filters.forEach(x=>{
    let label=x;
    if(x==='pws=0') label='Kişiselleştirme azalt';
    if(x==='tbs=li:1') label='Tam eşleşme';
    if(x==='tbs=sbd:1') label='En yeni sonuçlar';
    parts.push({key:'filter:'+x,label});
  });

  parts.push({key:'country',label:'Ülke: '+countrySettings()[1]});
    if(state.resultLanguage!=='auto') {
  const lang=resultLanguages.find(l=>l[0]===state.resultLanguage);
  parts.push({
    key:'resultLanguage',
    label:'Sonuç dili: '+(lang?lang[1]:state.resultLanguage)
  });
}

  $('#goai-preview').innerHTML=parts.length
    ?parts.map(p=>`
      <button type="button" class="goai-token" data-remove-token="${esc(p.key)}" title="Bu ayarı kaldır">
        <span>${esc(p.label)}</span><b>×</b>
      </button>`).join('')
    :'Henüz seçim yapılmadı.';

  $('#goai-token-count').textContent=parts.length+' aktif ayar';

  $$('[data-remove-token]').forEach(btn=>{
    btn.onclick=()=>{
      const key=btn.dataset.removeToken;
      if(key==='q') { state.q=''; input.value=''; }
      else if(key.startsWith('operator:')) {
  state.operator=state.operator.filter(x=>x!==key.slice(9));
}
else if(key.startsWith('logic:')) {
  state.logic=state.logic.filter(x=>x!==key.slice(6));
}
      else if(key==='site') state.site='';
      else if(key==='urlPath') state.urlPath='';
      else if(key==='exclude') state.exclude='';
      else if(key==='filetype') state.filetype='';
      else if(key==='after') state.after='';
      else if(key==='before') state.before='';
      else if(key==='mode') state.mode='';
      else if(key==='country') {
  state.country=detectedCountry[0];
  state.countryManual=false;
}
else if(key==='resultLanguage') {
  state.resultLanguage='auto';
}
      else if(key.startsWith('filter:')) {
        const value=key.slice(7);
        state.filters=state.filters.filter(x=>x!==value);
      }
      render();
      explainSearchSelection('Ayar kaldırıldı');
    };
  });
  save();
}

let collectingUiCatalog = false;

function renderSearch() {
  $('#goai-content').innerHTML=`
    <details class="goai-drawer">
      <summary>⌕ Arama seçenekleri</summary>
      <div class="goai-drawer-content">
        <div class="goai-title">Arama operatörleri</div>
        <div class="goai-grid operator-grid">
          ${operators.map(o=>`
            <button title="${esc(o[2])}" class="goai-choice goai-operator ${state.operator.includes(o[0])?'active':''}" data-op="${esc(o[0])}">
              <b>${esc(o[1])}</b>
            </button>`).join('')}
        </div>
      </div>
    </details>

    <details class="goai-drawer">
      <summary>🧠 Akıllı arama biçimleri</summary>
      <div class="goai-drawer-content">
        <div class="goai-grid">
          ${logics.map(l=>`
            <button title="${esc(l[2])}" class="goai-choice ${state.logic.includes(l[0])?'active':''}" data-logic="${l[0]}">
              <b>${esc(l[1])}</b><small>${esc(l[2])}</small>
            </button>`).join('')}
        </div>
      </div>
    </details>

    <details class="goai-drawer">
      <summary>🎯 Site ve dosya filtreleri</summary>
      <div class="goai-drawer-content">
        <input class="goai-input" id="goai-site"
  placeholder="Alan adı. Örnek: gov.tr"
  value="${esc(state.site)}">

<input class="goai-input" id="goai-urlpath"
  style="margin-top:7px"
  placeholder="URL yolu. Örnek: admin/login"
  value="${esc(state.urlPath||'')}">

<input class="goai-input" id="goai-exclude"
  style="margin-top:7px"
  placeholder="Hariç tutulacak kelimeler. Örnek: reklam demo"
  value="${esc(state.exclude)}">

<input class="goai-input" id="goai-filetype"
  style="margin-top:7px"
  placeholder="Dosya türleri. Örnek: pdf, docx, xlsx"
  value="${esc(state.filetype||'')}">

<div class="goai-inline-note">
  Birden fazla dosya uzantısı girebilirsin. Örneğin pdf, docx, xlsx.
</div>
        <div class="goai-row" style="margin-top:7px">
          <label class="goai-muted">Başlangıç
            <input class="goai-input" type="date" id="goai-after" value="${esc(state.after)}">
          </label>
          <label class="goai-muted">Bitiş
            <input class="goai-input" type="date" id="goai-before" value="${esc(state.before)}">
          </label>
        </div>
      </div>
    </details>

    <details class="goai-drawer">
      <summary>🌍 Google ve Arama Tercihleri</summary>
      <div class="goai-drawer-content">
        <div class="goai-title">Ülke ve sonuç dili</div>

<label class="goai-muted" style="display:block;margin-bottom:5px">
  Google ülkesi
  <select class="goai-input" id="goai-country">
    ${countries.map(c=>`
      <option value="${c[0]}" ${state.country===c[0]?'selected':''}>
        ${esc(c[1])}
      </option>`).join('')}
  </select>
</label>

<label class="goai-muted" style="display:block;margin-top:8px">
  Arama sonuçlarının dili
  <select class="goai-input" id="goai-result-language">
    ${resultLanguages.map(l=>`
      <option value="${l[0]}" ${state.resultLanguage===l[0]?'selected':''}>
        ${esc(l[1])}
      </option>`).join('')}
  </select>
</label>

<div class="goai-inline-note">
  Ülke Google'ın bölgesini, sonuç dili ise listelenecek sayfaların dilini belirler.
</div>
        <div class="goai-title goai-section-gap">Google görünümü</div>
        <select class="goai-input" id="goai-mode">
          ${[['14','Sade web sonuçları'],['18','Forum sonuçları'],['50','AI modu'],['','Standart görünüm']].map(x=>`
            <option value="${x[0]}" ${state.mode===x[0]?'selected':''}>${x[1]}</option>`).join('')}
        </select>
        <div class="goai-title goai-section-gap">Arama tercihleri</div>
        ${[
          ['pws=0','Kişiselleştirmeyi azalt'],
          ['tbs=li:1','Tam eşleşme'],
          ['tbs=sbd:1','En yeni sonuçlar']
        ].map(f=>`
          <label class="goai-muted" style="display:block;padding:6px">
            <input type="checkbox" data-filter="${esc(f[0])}" ${state.filters.includes(f[0])?'checked':''}>
            ${esc(f[1])}
          </label>`).join('')}
      </div>
    </details>

    <div class="goai-card">
      <div class="goai-title">💻 Sistem Bilgileri</div>
      <div class="goai-system">
        <div><small>Genel IP</small><b id="goai-ip">Kontrol ediliyor…</b></div>
        <div><small>Tarayıcı</small><b id="goai-browser">—</b></div>
        <div><small>İşletim sistemi</small><b id="goai-platform">—</b></div>
        <div><small>Ekran</small><b id="goai-screen">—</b></div>
        <div><small>Dil</small><b id="goai-language">—</b></div>
        <div><small>Zaman dilimi</small><b id="goai-timezone">—</b></div>
      </div>
    </div>`;

  $$('[data-op]').forEach(b=>b.onclick=()=>{
  const op=b.dataset.op;
  const index=state.operator.indexOf(op);

  if(index>-1) {
    state.operator.splice(index,1);
  } else {
    state.operator.push(op);
  }

  $$('[data-op]').forEach(x=>
    x.classList.toggle('active',state.operator.includes(x.dataset.op))
  );

  explainSearchSelection('Operatör seçimi güncellendi');
  refreshPreview();
});

  $$('[data-logic]').forEach(b=>b.onclick=()=>{
  const logic=b.dataset.logic;
  const index=state.logic.indexOf(logic);

  if(index>-1) {
    state.logic.splice(index,1);
  } else if(logic==='group') {
    state.logic.push(logic);
  } else {
    const exclusive=['exact','or','around','wildcard'];
    state.logic=state.logic.filter(x=>!exclusive.includes(x));
    state.logic.push(logic);
  }

  $$('[data-logic]').forEach(x=>
    x.classList.toggle('active',state.logic.includes(x.dataset.logic))
  );

  explainSearchSelection('Akıllı arama biçimi güncellendi');
  refreshPreview();
});

  [['site','goai-site'],['urlPath','goai-urlpath'],['exclude','goai-exclude'],['filetype','goai-filetype'],['after','goai-after'],['before','goai-before']].forEach(([k,id])=>{
    $('#'+id).oninput=e=>{state[k]=e.target.value;refreshPreview();};
    $('#'+id).onchange=e=>{state[k]=e.target.value;refreshPreview();};
  });

  $('#goai-country').onchange=e=>{
  state.country=e.target.value;
  state.countryManual=true;

  const c=countrySettings();

  explain(
    'Google ülke ayarı',
    `Google aramaları ${c[1]} bölgesine yönlendirilecek. Sonuç dili: ${
      state.resultLanguage==='auto'
        ? 'Ülkenin varsayılan dili'
        : resultLanguages.find(l=>l[0]===state.resultLanguage)?.[1]
    }.`,
    `gl=${c[2]} · hl=${c[3]} · ${
      state.resultLanguage==='auto'?'lr=otomatik':'lr='+state.resultLanguage
    }`
  );

  refreshPreview();
};

$('#goai-result-language').onchange=e=>{
  state.resultLanguage=e.target.value;

  const selected=resultLanguages.find(
    l=>l[0]===state.resultLanguage
  );

  explain(
    'Google sonuç dili',
    state.resultLanguage==='auto'
      ? 'Sonuç dili seçilen ülkenin varsayılan diline bırakıldı.'
      : `Google sonuçları ${selected[1]} dilindeki sayfalara göre filtreleyecek.`,
    state.resultLanguage==='auto'
      ? 'lr uygulanmıyor'
      : 'lr='+state.resultLanguage
  );

  refreshPreview();
};

  $('#goai-mode').onchange=e=>{
    state.mode=e.target.value;
    const descriptions={
      '14':['Sade web görünümü','Google aramasında sade web sonuçları görünümünü kullanır.','udm=14'],
      '18':['Forum sonuçları','Google aramasında forum odaklı sonuç görünümünü dener.','udm=18'],
      '50':['AI görünümü','Google aramasında AI odaklı görünüm parametresini dener.','udm=50'],
      '':['Standart görünüm','Google standart arama görünümüne döner.','Standart Google araması']
    };
    const d=descriptions[state.mode];
    explain(d[0],d[1],d[2]);
    refreshPreview();
  };

  $$('[data-filter]').forEach(c=>c.onchange=()=>{
    const v=c.dataset.filter;
    state.filters=c.checked?[...new Set([...state.filters,v])]:state.filters.filter(x=>x!==v);
    refreshPreview();
  });

  if(!collectingUiCatalog) loadSystemInfo();
}


function renderTactics() {
  $('#goai-content').innerHTML=`
    <div class="goai-card">
      <div class="goai-title">Hazır arama taktikleri</div>
      <div class="goai-grid">
        ${tactics.map(t=>`
          <button class="goai-choice" data-tactic="${t[0]}">
            <b>${t[1]} ${esc(t[2])}</b>
            <small>${esc(t[3])}</small>
          </button>`).join('')}
      </div>
    </div>

    <details class="goai-drawer">
      <summary>⚽ Futbol merkezi</summary>
      <div class="goai-drawer-content">
        <div class="goai-grid">
          ${football.map(x=>`
            <button class="goai-choice" data-foot="${esc(x[1])}">
              <b>⚽ ${esc(x[0])}</b>
            </button>`).join('')}
        </div>
      </div>
    </details>

    <details class="goai-drawer">
      <summary>🤖 Yapay zekâ asistanları</summary>
      <div class="goai-drawer-content">
        <div class="goai-grid">
          ${aiAssistants.map(a=>`
            <button class="goai-choice" data-ai="${esc(a[1])}">
              <b>✨ ${esc(a[0])}</b>
              <small>${esc(a[2])}</small>
            </button>`).join('')}
        </div>
      </div>
    </details>`;

  $$('[data-foot]').forEach(b=>b.onclick=()=>{
    const q=state.q.trim()||'Süper Lig';
    const action=b.dataset.foot;
    const fullQuery=q+' '+action;

    openUrl(googleUrl(fullQuery),fullQuery,{
      type:'football',
      query:q,
      action,
      icons:[{icon:'⚽',label:'Futbol merkezi'}]
    });

    explain('Futbol merkezi',`${q} için futbol bilgilerini Google'da açıyorum.`,action);
  });

  $$('[data-ai]').forEach(b=>b.onclick=()=>{
    openUrl(b.dataset.ai,'Yapay zekâ asistanı',{
      type:'assistant',
      icons:[{icon:'✨',label:'Yapay zekâ asistanları'}]
    });
  });

  $$('[data-tactic]').forEach(b=>b.onclick=()=>{
    const t=tactics.find(x=>x[0]===b.dataset.tactic);
    const q=state.q.trim()||'Ankara';
    let url;

    if(t[0]==='weather') {
      url=googleUrl(q+' hava durumu');
      explain('Hava durumu',`${q} için hava durumu sonuçlarını açıyorum.`);
    } else if(t[0]==='maps') {
      const c=countrySettings();
url=`https://${state.country}/maps/search/${enc(q)}?hl=${c[3]}&gl=${c[2]}`;
      explain('Harita',`${q} konumunu Google Haritalar'da arıyorum.`);
    } else if(['images','news','video','shopping','books'].includes(t[0])) {
      const tbm={images:'isch',news:'nws',video:'vid',shopping:'shop',books:'bks'}[t[0]];
      url=googleUrl(q,{tbm});
      explain(t[2],t[3],q);
    } else {
      url=googleUrl(q+' '+t[4]);
      explain(t[2],t[3],q+' '+t[4]);
    }

    openUrl(url,t[2]+' · '+q,{
      type:'tactic',
      query:q,
      action:t[2],
      icons:[{icon:t[1],label:t[2]}]
    });
  });
}

function renderTranslate() {
  $('#goai-content').innerHTML=`
    <details class="goai-drawer">
      <summary>🌐 Dil çevirisi</summary>
      <div class="goai-drawer-content">
        <div class="goai-title">Hangi dilden hangi dile çevirelim?</div>
        <div class="goai-row">
          <label class="goai-muted">Kaynak dil
            <select class="goai-input" id="goai-source">
              ${languages.map(l=>`<option value="${l[0]}" ${state.sourceLang===l[0]?'selected':''}>${esc(l[1])}</option>`).join('')}
            </select>
          </label>
          <button type="button" class="goai-btn" id="goai-swap" aria-label="Kaynak ve hedef dilleri değiştir" title="Dilleri değiştir" style="align-self:end;flex:0 0 38px">⇄</button>
          <label class="goai-muted">Hedef dil
            <select class="goai-input" id="goai-target">
              ${languages.filter(l=>l[0]!=='auto').map(l=>`<option value="${l[0]}" ${state.targetLang===l[0]?'selected':''}>${esc(l[1])}</option>`).join('')}
            </select>
          </label>
        </div>
        <label class="goai-muted" style="display:block;margin-top:9px">Çevrilecek metin
          <textarea class="goai-input" id="goai-translate-text" rows="4" placeholder="Çevirmek istediğin metni buraya yaz..." style="width:100%;min-height:92px;resize:vertical;margin-top:5px">${esc(state.translateText||'')}</textarea>
        </label>
        <button class="goai-btn search goai-action" id="goai-translate" style="width:100%;margin-top:8px">🌐 Şimdi çevir</button>
        <div class="goai-title goai-section-gap">Çeviri sonucu</div>
        <div id="goai-translation-result" class="goai-translation-result empty">Çeviri burada görüntülenecek.</div>
        <button type="button" class="goai-btn copy goai-action" id="goai-translation-copy">📋 Sonucu kopyala</button>
        <div class="goai-inline-note" id="goai-translation-status">Çeviri doğrudan panel içinde yapılır.</div>
      </div>
    </details>


    <details class="goai-drawer" id="goai-currency-drawer">
      <summary>💱 Döviz dönüştürme</summary>
      <div class="goai-drawer-content" style="padding:6px">
        <div class="goai-row" style="gap:6px">
          <label style="flex:1;min-width:0">
            <span class="goai-muted-label">Tutar</span>
            <input class="goai-input" id="goai-amount" type="text"
              inputmode="decimal" placeholder="100" value="${esc(state.amount)}">
          </label>
          <label style="flex:0 0 88px">
            <span class="goai-muted-label">Kur türü</span>
            <select class="goai-input" id="goai-currency-type">
              <option value="alis" ${state.currencyType==='alis'?'selected':''}>Alış</option>
              <option value="satis" ${state.currencyType==='satis'?'selected':''}>Satış</option>
            </select>
          </label>
        </div>

        <div class="goai-row" style="margin-top:5px;gap:5px;align-items:end">
          <label style="flex:1;min-width:0">
            <span class="goai-muted-label">Kaynak para</span>
            <select class="goai-input" id="goai-from"></select>
          </label>
          <button type="button" class="goai-btn" id="goai-currency-swap"
            title="Para birimlerini değiştir" aria-label="Para birimlerini değiştir"
            style="flex:0 0 34px;padding:7px;margin-bottom:1px">⇄</button>
          <label style="flex:1;min-width:0">
            <span class="goai-muted-label">Hedef para</span>
            <select class="goai-input" id="goai-to"></select>
          </label>
        </div>

        <label style="display:block;margin-top:6px">
          <span class="goai-muted-label">Kur kaynağı</span>
          <select class="goai-input" id="goai-currency-source">
            <option value="google" ${state.currencySource==='google'?'selected':''}>Google Araması</option>
            ${[
              ['serbest','Serbest Piyasa'],['akbank','Akbank'],['albaraka','Albaraka Türk'],
              ['alternatifbank','Alternatif Bank'],['anadolubank','Anadolubank'],['denizbank','DenizBank'],
              ['destekbank','Destekbank'],['dunya_katilim','Dünya Katılım'],['emlak_katilim','Emlak Katılım'],
              ['enpara','Enpara'],['fibabanka','Fibabanka'],['garanti','Garanti BBVA'],['halkbank','Halkbank'],
              ['hsbc','HSBC'],['ing','ING'],['isbank','İş Bankası'],['kuveyt_turk','Kuveyt Türk'],
              ['finansbank','QNB'],['sekerbank','Şekerbank'],['teb','TEB'],['turkiye_finans','Türkiye Finans'],
              ['vakifbank','VakıfBank'],['vakif_katilim','Vakıf Katılım'],['yapikredi','Yapı Kredi'],
              ['ziraat','Ziraat Bankası'],['ziraat_katilim','Ziraat Katılım']
            ].map(x=>`<option value="${x[0]}" ${state.currencySource===x[0]?'selected':''}>${x[1]}</option>`).join('')}
          </select>
        </label>

        <div class="goai-row" style="margin-top:7px;gap:7px;align-items:stretch">

<div style="margin-top:7px;padding:10px;border:1px solid rgba(140,165,210,.16);border-radius:11px;background:rgba(100,125,170,.045)">

  <div id="goai-currency-result"
    class="goai-translation-result"
    style="margin:0;padding:3px 8px;min-height:0px;box-sizing:border-box;border:0;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <span style="font-size:9px;color:#91a6cc">Kur verisi yükleniyor…</span>
  </div>

  <div style="margin-top:7px;padding-top:8px;border-top:1px solid rgba(140,165,210,.13)">
    <button type="button" class="goai-btn search"
      id="goai-currency-action"
      style="width:100%;margin:0;min-height:35px">
      Kuru yenile
    </button>

    <div id="goai-currency-status"
      class="goai-inline-note"
      style="margin:6px 0 0;text-align:center;font-size:9px;line-height:1.4;overflow-wrap:anywhere">
      Veri bekleniyor
    </div>
  </div>
</div>
    </details>

    <details class="goai-drawer">
      <summary>✈️ Uçuş ara</summary>
      <div class="goai-drawer-content">
        <div class="goai-form-grid">
          <label><span class="goai-muted-label">Nereden?</span>
            <input class="goai-input" id="goai-flight-from" placeholder="Şehir veya havalimanı" value="${esc(state.flightFrom)}">
          </label>
          <label><span class="goai-muted-label">Nereye?</span>
            <input class="goai-input" id="goai-flight-to" placeholder="Şehir veya havalimanı" value="${esc(state.flightTo)}">
          </label>
          <label><span class="goai-muted-label">Gidiş tarihi</span>
            <input class="goai-input" type="date" id="goai-flight-date" value="${esc(state.flightDate)}">
          </label>
          <label id="goai-return-wrap" style="display:${state.flightTripType==='oneway'?'none':'block'}"><span class="goai-muted-label">Dönüş tarihi</span>
            <input class="goai-input" type="date" id="goai-return-date" value="${esc(state.returnDate)}">
          </label>
        </div>

        <div class="goai-flight-options" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px">
          <label><span class="goai-muted-label">Yolcu sayısı</span>
            <select class="goai-input" id="goai-flight-passengers">
              ${[1,2,3,4,5,6,7,8,9].map(n=>`<option value="${n}" ${String(state.flightPassengers)===String(n)?'selected':''}>${n} yolcu</option>`).join('')}
            </select>
          </label>
          <label><span class="goai-muted-label">Kabin sınıfı</span>
            <select class="goai-input" id="goai-flight-class">
              ${[['ECONOMY','Ekonomi'],['PREMIUM_ECONOMY','Premium'],['BUSINESS','Business'],['FIRST','First']].map(x=>`<option value="${x[0]}" ${state.flightClass===x[0]?'selected':''}>${x[1]}</option>`).join('')}
            </select>
          </label>
          <div><span class="goai-muted-label">Uçuş durumu</span>
            <div class="goai-row" style="gap:3px">
              <button type="button" class="goai-btn ${state.flightTripType==='oneway'?'search':''}" id="goai-flight-oneway" style="flex:1;padding:8px 3px">Tek yön</button>
              <button type="button" class="goai-btn ${state.flightTripType==='roundtrip'?'search':''}" id="goai-flight-roundtrip" style="flex:1;padding:8px 3px">Gidiş-dönüş</button>
            </div>
          </div>
        </div>

        <div style="margin-top:9px">
          <span class="goai-muted-label">Konum · Dil · Para birimi</span>
          <div class="goai-row" style="gap:6px">
            <select class="goai-input" id="goai-flight-location" title="Google Flights konumu">
              ${[['TR','Türkiye'],['US','ABD'],['GB','Birleşik Krallık'],['DE','Almanya'],['FR','Fransa'],['RU','Rusya'],['KH','Kamboçya'],['VN','Vietnam'],['AE','BAE'],['JP','Japonya']].map(x=>`<option value="${x[0]}" ${state.flightLocation===x[0]?'selected':''}>${x[1]}</option>`).join('')}
            </select>
            <select class="goai-input" id="goai-flight-language" title="Google Flights dili">
              ${[['tr','Türkçe'],['en','English'],['de','Deutsch'],['ru','Русский'],['fr','Français'],['es','Español'],['ar','العربية'],['ja','日本語'],['zh-CN','中文']].map(x=>`<option value="${x[0]}" ${state.flightLanguage===x[0]?'selected':''}>${x[1]}</option>`).join('')}
            </select>
            <select class="goai-input" id="goai-flight-currency" title="Uçuş fiyat para birimi">
              ${['TRY','USD','EUR','GBP','RUB','KHR','VND','AED','JPY'].map(x=>`<option value="${x}" ${state.flightCurrency===x?'selected':''}>${x}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="goai-row" style="gap:7px;margin-top:9px;align-items:stretch">
          <button type="button" class="goai-btn search goai-action" id="goai-flight-search" style="flex:1;min-width:0;padding:11px 8px;font-weight:700">✈️ Google Uçuş Ara</button>
          <button type="button" class="goai-btn goai-action" id="goai-flight-copy" title="Hazırlanan uçuş bağlantısını kopyala" aria-label="Uçuş bağlantısını kopyala" style="flex:0 0 42px;width:42px;padding:8px;font-size:18px">🔗</button>
        </div>
        <div class="goai-inline-note">Bağlantı kopyalanır. Gizli sekme açıp adres çubuğuna yapıştırın. Tarayıcı güvenlik nedeniyle normal bir sayfanın kendiliğinden gizli sekme açmasına izin vermez.</div>
      </div>
    </details>

    <details class="goai-drawer">
      <summary>🏨 Otel ara</summary>
      <div class="goai-drawer-content">
        <div class="goai-form-grid">
          <label class="wide"><span class="goai-muted-label">Şehir veya konaklama yeri</span>
            <input class="goai-input" id="goai-hotel-city" placeholder="Örnek: İstanbul, Türkiye" value="${esc(state.hotelCity)}">
          </label>
          <label><span class="goai-muted-label">Giriş tarihi</span>
            <input class="goai-input" type="date" id="goai-hotel-checkin" value="${esc(state.hotelCheckin)}">
          </label>
          <label><span class="goai-muted-label">Çıkış tarihi</span>
            <input class="goai-input" type="date" id="goai-hotel-checkout" value="${esc(state.hotelCheckout)}">
          </label>
          <label><span class="goai-muted-label">Misafir sayısı</span>
            <select class="goai-input" id="goai-hotel-guests">
              ${[1,2,3,4,5,6,7,8,9].map(n=>`<option value="${n}" ${String(state.hotelGuests)===String(n)?'selected':''}>${n} kişi</option>`).join('')}
            </select>
          </label>
          <label><span class="goai-muted-label">Para birimi</span>
            <select class="goai-input" id="goai-hotel-currency">
              ${['TRY','USD','EUR','GBP','KHR','VND','AED','JPY'].map(x=>`<option ${state.hotelCurrency===x?'selected':''}>${x}</option>`).join('')}
            </select>
          </label>
        </div>
        <button class="goai-btn search goai-action" id="goai-hotel-search">🏨 Google Hotels'ta ara</button>
        <div class="goai-inline-note">Otel fiyatları, konum, misafir sayısı ve uygunluk bilgileri Google Travel sayfasında görüntülenir.</div>
      </div>
    </details>`;

  $('#goai-source').onchange=e=>{state.sourceLang=e.target.value;save();};
  $('#goai-target').onchange=e=>{state.targetLang=e.target.value;save();};

  $('#goai-swap').onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    if(state.sourceLang==='auto') return;
    [state.sourceLang,state.targetLang]=[state.targetLang,state.sourceLang];
    $('#goai-source').value=state.sourceLang;
    $('#goai-target').value=state.targetLang;
    save();
  };

  const translationResult=$('#goai-translation-result');
  const translationStatus=$('#goai-translation-status');
  let textTranslationRun=0;

  $('#goai-translate-text').oninput=e=>{state.translateText=e.target.value;save();};

  $('#goai-translate').onclick=async()=>{
    const text=(state.translateText||'').trim();
    if(!text) {
      explain('Önce metin yaz','Çevirmek istediğin metni çeviri alanına yaz.');
      $('#goai-translate-text').focus();
      return;
    }
    const myRun=++textTranslationRun;
    translationStatus.textContent='Çevriliyor...';
    translationResult.classList.remove('empty');
    try {
      const translated=await googleTranslateText(state.sourceLang,state.targetLang,text);
      if(myRun!==textTranslationRun) return;
      translationResult.textContent=translated || '(Boş sonuç)';
      translationStatus.textContent='Çeviri tamamlandı.';
      log(
        '',
        'Çeviri: '+state.sourceLang+' → '+state.targetLang,
        {
          type:'translate',
          copyText:translated,
          sourceLang:state.sourceLang,
          targetLang:state.targetLang,
          sourceText:text,
          translatedText:translated,
          icons:[{
  icon:'🌐 '+(
    {
      tr:'🇹🇷',en:'🇺🇸',us:'🇺🇸',
      de:'🇩🇪',fr:'🇫🇷',es:'🇪🇸',
      it:'🇮🇹',ru:'🇷🇺',ar:'🇸🇦',
      zh:'🇨🇳',ja:'🇯🇵',ko:'🇰🇷',
      th:'🇹🇭',vi:'🇻🇳',km:'🇰🇭'
    }[String(state.sourceLang).toLowerCase()]||'🏳️'
  )+' › '+(
    {
      tr:'🇹🇷',en:'🇺🇸',us:'🇺🇸',
      de:'🇩🇪',fr:'🇫🇷',es:'🇪🇸',
      it:'🇮🇹',ru:'🇷🇺',ar:'🇸🇦',
      zh:'🇨🇳',ja:'🇯🇵',ko:'🇰🇷',
      th:'🇹🇭',vi:'🇻🇳',km:'🇰🇭'
    }[String(state.targetLang).toLowerCase()]||'🏳️'
  ),
  label:'Dil çevirisi'
}]
        }
      );
    } catch(err) {
      if(myRun!==textTranslationRun) return;
      translationResult.textContent='';
      translationResult.classList.add('empty');
      translationStatus.textContent='Çeviri alınamadı. Biraz sonra tekrar deneyin.';
      console.error('GOAI text translation error:',err);
    }
  };

  $('#goai-translation-copy').onclick=async()=>{
    const text=translationResult.textContent||'';
    if(!text || translationResult.classList.contains('empty')) return;
    try {
      await navigator.clipboard.writeText(text);
      translationStatus.textContent='Kopyalandı ✓';
    } catch(_) {
      const temp=document.createElement('textarea');
      temp.value=text;temp.style.position='fixed';temp.style.opacity='0';
      document.body.appendChild(temp);temp.select();
      const ok=document.execCommand('copy');temp.remove();
      translationStatus.textContent=ok?'Kopyalandı ✓':'Kopyalanamadı.';
    }
  };

  const currencyFeedUrl='https://www.piyasadoviz.com/eklenti/veri.json';
  let currencyFeed=null, currencyLoading=false, currencyLastLoaded=0,
      currencyRefreshTimer=null, currencyRequestNo=0;

  const currencyResult=$('#goai-currency-result');
  const currencyStatus=$('#goai-currency-status');
  const currencySourceSelect=$('#goai-currency-source');
  const currencyTypeSelect=$('#goai-currency-type');
  const currencyAmount=$('#goai-amount');
  const currencyFrom=$('#goai-from');
  const currencyTo=$('#goai-to');
  const currencyAction=$('#goai-currency-action');

  const currencyNumber=value=>{
    const raw=String(value??'').trim()
      .replace(/\s/g,'')
      .replace(/\.(?=\d{3}(?:\D|$))/g,'')
      .replace(',','.');
    return raw===''?NaN:Number(raw);
  };

  const currencyFormat=value=>
    Number(value).toLocaleString('tr-TR',{maximumFractionDigits:8});

  const currencySource=()=>
    currencyFeed?.sources?.[state.currencySource]||null;

  const currencyOptions=()=>{
    const source=currencySource();
    const codes=source?.rows
      ?Object.keys(source.rows)
      :['USD','TRY','EUR','GBP','JPY','CAD','AUD','CHF','AED','SAR','KHR','VND'];
    return [...new Set(['TRY',...codes])];
  };

  const fillCurrencySelects=()=>{
    const codes=currencyOptions();

    const makeOptions=select=>{
      const wanted=select===currencyFrom?state.from:state.to;

      select.innerHTML=codes.map(code=>
        `<option value="${esc(code)}">${esc(code)}</option>`
      ).join('');

      select.value=codes.includes(wanted)
        ?wanted
        :(codes.includes('USD')?'USD':'TRY');

      if(select===currencyFrom) state.from=select.value;
      else state.to=select.value;
    };

    makeOptions(currencyFrom);
    makeOptions(currencyTo);
  };

  const renderCurrencyResult=()=>{
    const isGoogle=state.currencySource==='google';

    currencyTypeSelect.disabled=isGoogle;
    currencyFrom.disabled=isGoogle;
    currencyTo.disabled=isGoogle;

    currencyAction.textContent=isGoogle?"Google'da ara":'Kuru yenile';

    if(isGoogle){
      currencyResult.innerHTML=
        '<span style="color:#cbd8f4">Google araması seçildi.</span><br>' +
        '<small style="color:#91a6cc">Dönüşüm sorgusunu Google’da açmak için aşağıdaki düğmeyi kullanın.</small>';
      currencyStatus.textContent='Web araması';
      return;
    }

    if(!currencyFeed){
      currencyResult.textContent=currencyLoading
        ?'Piyasadöviz verisi yükleniyor…'
        :'Kur verisi henüz alınamadı.';
      return;
    }

    const src=currencySource();
    const amount=currencyNumber(state.amount);

    if(!src||!src.rows){
      currencyResult.textContent='Seçilen kaynak için veri bulunamadı.';
      return;
    }

    if(!Number.isFinite(amount)||amount<=0){
      currencyResult.textContent='Geçerli bir tutar girin.';
      return;
    }

    const side=state.currencyType==='satis'?'s':'b';

    const rate=code=>{
      if(code==='TRY') return 1;

      const row=src.rows[code];
      if(!row) return null;

      const value=Number(row[side]);
      const unit=Number(row.u)||1;

      return Number.isFinite(value)&&value>0
        ?value/unit
        :null;
    };

    const fromRate=rate(state.from);
    const toRate=rate(state.to);

    if(fromRate===null||toRate===null||!toRate){
      currencyResult.innerHTML=
        '<span style="color:#ffc477">Bu kaynakta seçilen para birimlerinden biri için kur bulunmuyor.</span>';
      currencyStatus.textContent='Kur mevcut değil';
      return;
    }

    const converted=amount*fromRate/toRate;
    const unitRate=fromRate/toRate;

currencyResult.innerHTML=
  `<span style="font-size:9px;font-weight:700;letter-spacing:1px;color:#91a6cc">DÖNÜŞÜM SONUCU</span>`+
  `<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0;line-height:1.2;flex-wrap:wrap">`+
    `<strong style="font-size:25px;font-weight:800;color:#fff;overflow-wrap:anywhere">${esc(currencyFormat(converted))}</strong>`+
    `<span style="font-size:11px;font-weight:600;color:#b8c8e8">${esc(state.to)}</span>`+
    `<button type="button" title="Sonucu kopyala" data-copy="${esc(currencyFormat(converted)+' '+state.to)}" onclick="navigator.clipboard.writeText(this.dataset.copy).then(()=>{this.textContent='✓'}).catch(()=>{this.textContent='×'})" style="padding:2px 5px;margin:0;border:1px solid rgba(145,166,204,.3);border-radius:5px;background:rgba(145,166,204,.1);color:#b8c8e8;font-size:12px;cursor:pointer;line-height:1.2">⧉</button>`+
  `</div>`+
  `<span style="font-size:9px;color:#91a6cc;margin-top:2px">1 ${esc(state.from)} = ${esc(currencyFormat(unitRate))} ${esc(state.to)}</span>`;

    const timestamp=src.t||currencyFeed.generated;
    const date=timestamp
      ?new Date(timestamp).toLocaleString('tr-TR')
      :'Zaman bilgisi yok';

    currencyStatus.textContent=`${src.label} · ${date}`;
  };

  const loadCurrencyFeed=force=>{
    if(currencyLoading) return;

    if(!force&&currencyFeed&&Date.now()-currencyLastLoaded<30000){
      renderCurrencyResult();
      return;
    }

    currencyLoading=true;
    const requestNo=++currencyRequestNo;

    currencyStatus.textContent='Güncel kur alınıyor…';

    if(state.currencySource!=='google')
      currencyResult.textContent='Piyasadöviz verisi yükleniyor…';

    GM_xmlhttpRequest({
      method:'GET',
      url:currencyFeedUrl,
      timeout:15000,
      headers:{'Accept':'application/json'},

      onload(response){
        if(requestNo!==currencyRequestNo) return;

        try{
          if(response.status<200||response.status>=300)
            throw new Error('HTTP '+response.status);

          const data=JSON.parse(response.responseText);

          if(!data||!data.sources||
             typeof data.sources!=='object'||
             !Object.keys(data.sources).length)
            throw new Error('Geçersiz kur verisi');

          currencyFeed=data;
          currencyLastLoaded=Date.now();
          currencyLoading=false;

          if(!data.sources[state.currencySource]&&state.currencySource!=='google')
            state.currencySource='serbest';

          fillCurrencySelects();
          save();
          renderCurrencyResult();

        }catch(error){
          currencyLoading=false;
          currencyResult.textContent='Kur verisi doğrulanamadı. Yanlış değer gösterilmedi.';
          currencyStatus.textContent='Veri hatası';
          console.error('GOAI currency data error:',error);
        }
      },

      onerror(){
        if(requestNo!==currencyRequestNo) return;
        currencyLoading=false;
        currencyResult.textContent='Piyasadöviz verisine erişilemedi. Yanlış veya eski kur gösterilmedi.';
        currencyStatus.textContent='Bağlantı hatası';
      },

      ontimeout(){
        if(requestNo!==currencyRequestNo) return;
        currencyLoading=false;
        currencyResult.textContent='Kur isteği zaman aşımına uğradı. Yeniden deneyin.';
        currencyStatus.textContent='Zaman aşımı';
      }
    });
  };

  currencySourceSelect.onchange=e=>{
    state.currencySource=e.target.value;

    if(state.currencySource!=='google'&&currencyFeed)
      fillCurrencySelects();

    save();
    renderCurrencyResult();

    if(state.currencySource!=='google')
      loadCurrencyFeed(false);
  };

  currencyTypeSelect.onchange=e=>{
    state.currencyType=e.target.value;
    save();
    renderCurrencyResult();
  };

  currencyAmount.oninput=e=>{
    state.amount=e.target.value;
    save();
    renderCurrencyResult();
  };

  currencyFrom.onchange=e=>{
    state.from=e.target.value;
    save();
    renderCurrencyResult();
  };

  currencyTo.onchange=e=>{
    state.to=e.target.value;
    save();
    renderCurrencyResult();
  };

  $('#goai-currency-swap').onclick=e=>{
    e.preventDefault();
    e.stopPropagation();

    [state.from,state.to]=[state.to,state.from];

    currencyFrom.value=state.from;
    currencyTo.value=state.to;

    save();
    renderCurrencyResult();
  };

currencyAction.onclick=()=>{
  if(state.currencySource==='google'){
    const amount=currencyAmount.value.trim();

    if(!amount||!Number.isFinite(currencyNumber(amount))||
       currencyNumber(amount)<=0){
      explain(
        'Tutar eksik',
        'Google’da aramak için geçerli bir para miktarı girin.',
        '100 USD → TRY'
      );
      return;
    }

    const q=`${amount} ${state.from} to ${state.to}`;

    explain(
      'Döviz dönüşümü',
      `${amount} ${state.from} tutarını ${state.to} para birimine dönüştürmek için Google araması açılıyor.`,
      q
    );

openUrl(googleUrl(q),'Döviz dönüşümü',{
  type:'currency',
  icons:[{icon:'💱',label:'Döviz dönüştürme'}]
});
    return;
  }

  explain(
    'Döviz kuru bilgisi',
    'Banka kurları güncel verilerden çekilir, Google seçeneği doğrudan siteyi açar. Kurlar kaynak güncellendikçe yenilenir; lütfen son güncelleme tarihini kontrol ederek işlem yapınız.'
  );

  const amount=currencyNumber(currencyAmount.value);

  if(Number.isFinite(amount)&&amount>0&&currencyFeed) {
    const src=currencySource();
    const side=state.currencyType==='satis'?'s':'b';

    const rate=code=>{
      if(code==='TRY') return 1;

      const row=src?.rows?.[code];
      if(!row) return null;

      const value=Number(row[side]);
      const unit=Number(row.u)||1;

      return Number.isFinite(value)&&value>0
        ?value/unit
        :null;
    };

    const fromRate=rate(state.from);
    const toRate=rate(state.to);

    if(src?.rows&&fromRate!==null&&toRate!==null&&toRate) {
      const converted=amount*fromRate/toRate;
      const typeLabel=state.currencyType==='satis'?'Satış':'Alış';

      log(
        '',
        `${currencyFormat(amount)} ${state.from} → ${currencyFormat(converted)} ${state.to} - Kur Türü: ${typeLabel} - Kur Kaynağı: ${src.label}`,
        {
          type:'currency',
          amount:currencyFormat(amount),
          from:state.from,
          to:state.to,
          converted:currencyFormat(converted),
          currencySource:src.label,
          currencyType:typeLabel,
          icons:[{icon:'💱',label:'Döviz dönüştürme'}]
        }
      );
    }
  }

  loadCurrencyFeed(true);
};

  fillCurrencySelects();
  renderCurrencyResult();

  if(state.currencySource!=='google')
    loadCurrencyFeed(false);

  if(!currencyRefreshTimer){
    currencyRefreshTimer=setInterval(()=>{
      const drawer=$('#goai-currency-drawer');

      if(drawer?.open&&state.currencySource!=='google')
        loadCurrencyFeed(true);
    },60000);
  }

  const flightFields = [
    ['flightFrom','goai-flight-from'],['flightTo','goai-flight-to'],
    ['flightDate','goai-flight-date'],['returnDate','goai-return-date'],
    ['flightPassengers','goai-flight-passengers'],['flightClass','goai-flight-class'],
    ['flightLanguage','goai-flight-language'],['flightLocation','goai-flight-location'],
    ['flightCurrency','goai-flight-currency'],
    ['hotelCity','goai-hotel-city'],['hotelCheckin','goai-hotel-checkin'],
    ['hotelCheckout','goai-hotel-checkout'],['hotelGuests','goai-hotel-guests'],
    ['hotelCurrency','goai-hotel-currency']
  ];

  flightFields.forEach(([key,id])=>{
    $('#'+id).onchange=e=>{state[key]=e.target.value;save();};
    $('#'+id).oninput=e=>{state[key]=e.target.value;save();};
  });

  const setFlightTripType = type => {
    state.flightTripType=type;
    const oneWay=type==='oneway';
    $('#goai-return-wrap').style.display=oneWay?'none':'block';
    $('#goai-flight-oneway').classList.toggle('search',oneWay);
    $('#goai-flight-roundtrip').classList.toggle('search',!oneWay);
    save();
  };

  $('#goai-flight-oneway').onclick=e=>{e.preventDefault();e.stopPropagation();setFlightTripType('oneway');};
  $('#goai-flight-roundtrip').onclick=e=>{e.preventDefault();e.stopPropagation();setFlightTripType('roundtrip');};
  setFlightTripType(state.flightTripType==='oneway'?'oneway':'roundtrip');

  const buildFlightUrl = () => {
    const readField=(key,id)=>{
      const el=$('#'+id);
      if(el) state[key]=el.value;
      return String(state[key] ?? '').trim();
    };
    const from=readField('flightFrom','goai-flight-from');
    const to=readField('flightTo','goai-flight-to');
    const departure=readField('flightDate','goai-flight-date');
    const returning=readField('returnDate','goai-return-date');
    const passengers=readField('flightPassengers','goai-flight-passengers') || '1';
    const cabin=readField('flightClass','goai-flight-class') || 'ECONOMY';
    const language=readField('flightLanguage','goai-flight-language') || 'tr';
    const location=readField('flightLocation','goai-flight-location') || 'TR';
    const currency=readField('flightCurrency','goai-flight-currency') || 'TRY';
    save();

    if(!from || !to) {
      explain('Uçuş bilgileri eksik','Kalkış ve varış şehirlerini ayrı ayrı gir.');
      return;
    }
    if(!validDate(departure)) {
      explain('Gidiş tarihi eksik veya geçersiz','Geçerli bir gidiş tarihi seç.');
      return;
    }
    if(state.flightTripType==='roundtrip' && (!validDate(returning) || returning<departure)) {
      explain('Dönüş tarihi eksik veya geçersiz','Dönüş tarihi, gidiş tarihinden önce olamaz.');
      return;
    }

    const passengerCount=Math.max(1,Math.min(9,Number(passengers)||1));
    const params=new URLSearchParams();
    params.set('q',`Flights from ${from} to ${to}`);
    params.set('d',departure);
    if(state.flightTripType==='roundtrip' && returning) params.set('r',returning);
    params.set('adults',String(passengerCount));
    params.set('cabin',cabin);
    params.set('hl',language);
    params.set('gl',location);
    params.set('curr',currency);
    return `https://www.google.com/travel/flights?${params.toString()}`;
  };

  $('#goai-flight-search').onclick=()=>{
    const url=buildFlightUrl();
    if(!url) return;
    explain('Google Uçuş araması','Hazırlanan uçuş araması yeni sekmede açılıyor.',url);
    openUrl(url,'Google Uçuş Ara',{
  type:'flight',
  icons:[{icon:'✈️',label:'Uçuş arama'}]
});
  };

  $('#goai-flight-copy').onclick=async()=>{
    const url=buildFlightUrl();
    if(!url) return;
    try {
      if(navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const temp=document.createElement('textarea');
        temp.value=url;
        temp.style.position='fixed';temp.style.opacity='0';
        document.body.appendChild(temp);temp.select();
        const copied=document.execCommand('copy');temp.remove();
        if(!copied) throw new Error('Panoya kopyalanamadı');
      }
      explain('Uçuş bağlantısı kopyalandı','Bağlantı gizli sekmede açılmak üzere panoya kopyalandı.',url);
    } catch(err) {
      explain('Bağlantı kopyalanamadı','Tarayıcı panoya erişim izni vermedi.');
    }
  };

  $('#goai-hotel-search').onclick=()=>{
    const city=state.hotelCity.trim();
    if(!city) {
      explain('Konaklama yeri eksik','Otel aramak için şehir veya konaklama bölgesi gir.');
      return;
    }
    const params=new URLSearchParams();
    params.set('q',city);
    if(state.hotelCheckin) params.set('checkin',state.hotelCheckin);
    if(state.hotelCheckout) params.set('checkout',state.hotelCheckout);
    params.set('adults',state.hotelGuests||'2');
    params.set('currency',state.hotelCurrency||'TRY');
    const url=`https://www.google.com/travel/search?${params.toString()}`;
    explain('Otel araması',`${city} için otel ve konaklama seçeneklerini Google Travel'da açıyorum.`);
    openUrl(url,'Otel: '+city,{
  type:'hotel',
  icons:[{icon:'🏨',label:'Otel arama'}]
});
  };
}




function historyLabelHtml(h) {
  const query=h.query||'';
  const action=h.action||'';

const languageTag=code=>{
  const flags={
    tr:'🇹🇷',en:'🇺🇸',us:'🇺🇸',
    de:'🇩🇪',fr:'🇫🇷',es:'🇪🇸',
    it:'🇮🇹',ru:'🇷🇺',ar:'🇸🇦',
    zh:'🇨🇳',ja:'🇯🇵',ko:'🇰🇷',
    th:'🇹🇭',vi:'🇻🇳',km:'🇰🇭'
  };

  const flag=flags[String(code||'').toLowerCase()]||'🌐';

  return `<span class="goai-flag">${flag}</span>`;
};

  const arrow='<span style="flex:0 0 auto;color:#71819e">›</span>';

  if(h.type==='search') {
    const text=query||h.label||'Arama';

    return `
      <span class="goai-history-label">
        <span class="goai-history-query" title="${esc(text)}">${esc(text)}</span>
      </span>
    `;
  }

  if(h.type==='football'||h.type==='tactic') {
    const text=query||h.label||'Arama';

    return `
      <span class="goai-history-label">
        <span class="goai-history-query" title="${esc(text)}">${esc(text)}</span>
        ${arrow}
        <span class="goai-history-action" title="${esc(action)}">${esc(action)}</span>
      </span>
    `;
  }

  if(h.type==='currency') {
    if(h.amount&&h.converted) {
      const amount=h.amount+' '+(h.from||'');
      const converted=h.converted+' '+(h.to||'');

      const source=h.currencySource||'';
      const type={
        alis:'Alış',
        satis:'Satış'
      }[String(h.currencyType||'').toLowerCase()]||h.currencyType||'';

      return `
        <span class="goai-history-label">
          <span style="color:#ffdb78;font-weight:700" title="${esc(amount)}">${esc(amount)}</span>
          ${arrow}
          <span style="color:#70e5a2;font-weight:700" title="${esc(converted)}">${esc(converted)}</span>
          ${source?`<span style="color:#70cfff">· ${esc(source)}</span>`:''}
          ${type?`<span style="color:#ffc875">· ${esc(type)}</span>`:''}
        </span>
      `;
    }

    const text=h.label||h.query||'Döviz dönüşümü';

    return `
      <span class="goai-history-label">
        <span class="goai-history-query" title="${esc(text)}">${esc(text)}</span>
      </span>
    `;
  }

if(h.type==='translate') {
  const source=h.sourceText||'';
  const translated=h.translatedText||'';

  return `
    <span class="goai-history-label">
      <span class="goai-history-query" title="${esc(source)}">${esc(source)}</span>
      ${arrow}
      <span class="goai-history-result" title="${esc(translated)}">${esc(translated)}</span>
    </span>
  `;
}

  const text=query||h.label||'İşlem';

  return `
    <span class="goai-history-label">
      <span class="goai-history-query" title="${esc(text)}">${esc(text)}</span>
      ${action?`${arrow}<span class="goai-history-action" title="${esc(action)}">${esc(action)}</span>`:''}
    </span>
  `;
}

function renderTools() {
  const oldScroll=scrollArea.scrollTop;

  $('#goai-content').innerHTML=`
    <details class="goai-drawer">
      <summary>🌐 Google Uygulamaları ve Hesap Bağlantıları</summary>
      <div class="goai-drawer-content">

        <div class="goai-title">📧 E-posta ve Kişiler</div>
        <div class="goai-grid">
          <button class="goai-choice" data-link="https://mail.google.com/">
            <b>📧 Gmail</b><small>E-posta gönder, al ve yönet.</small>
          </button>
          <button class="goai-choice" data-link="https://messages.google.com/web/">
            <b>💬 Google Mesajlar</b><small>Telefon mesajlarını bilgisayardan kullan.</small>
          </button>
          <button class="goai-choice" data-link="https://contacts.google.com/">
            <b>👥 Google Kişiler</b><small>Kişilerini ve rehberini yönet.</small>
          </button>
        </div>

        <div class="goai-title goai-section-gap">☁️ Dosyalar ve Bulut Depolama</div>
        <div class="goai-grid">
          <button class="goai-choice" data-link="https://drive.google.com/">
            <b>☁️ Google Drive</b><small>Dosyalarını çevrimiçi sakla ve paylaş.</small>
          </button>
          <button class="goai-choice" data-link="https://photos.google.com/">
            <b>📸 Google Fotoğraflar</b><small>Fotoğraf ve videolarını yedekle, düzenle.</small>
          </button>
          <button class="goai-choice" data-link="https://docs.google.com/">
            <b>📄 Google Dokümanlar</b><small>Metin belgeleri oluştur ve düzenle.</small>
          </button>
          <button class="goai-choice" data-link="https://sheets.google.com/">
            <b>📊 Google E-Tablolar</b><small>Tablolar ve hesaplamalar oluştur.</small>
          </button>
          <button class="goai-choice" data-link="https://slides.google.com/">
            <b>📽️ Google Slaytlar</b><small>Sunumlar hazırla ve düzenle.</small>
          </button>
          <button class="goai-choice" data-link="https://keep.google.com/">
            <b>📝 Google Keep</b><small>Notlarını ve hatırlatmalarını kaydet.</small>
          </button>
          <button class="goai-choice" data-link="https://one.google.com/storage">
            <b>💾 Google One</b><small>Bulut depolama alanını kontrol et.</small>
          </button>
          <button class="goai-choice" data-link="https://forms.google.com/">
            <b>📋 Google Formlar</b><small>Anket ve çevrimiçi formlar oluştur.</small>
          </button>
        </div>

        <div class="goai-title goai-section-gap">🗓️ Planlama ve Günlük Araçlar</div>
        <div class="goai-grid">
          <button class="goai-choice" data-link="https://calendar.google.com/">
            <b>📅 Google Takvim</b><small>Etkinliklerini ve randevularını planla.</small>
          </button>
          <button class="goai-choice" data-link="https://www.youtube.com/">
            <b>▶️ YouTube</b><small>Video izle ve kanalları takip et.</small>
          </button>
          <button class="goai-choice" data-link="https://music.youtube.com/">
            <b>🎵 YouTube Music</b><small>Müzik ve podcast dinle.</small>
          </button>
          <button class="goai-choice" data-link="https://tasks.google.com/">
            <b>☑️ Google Görevler</b><small>Yapılacaklar listeni ve görevlerini yönet.</small>
          </button>
          <button class="goai-choice" data-link="https://lens.google.com/">
            <b>📷 Google Lens</b><small>Fotoğrafla nesne, metin ve yer ara.</small>
          </button>
          <button class="goai-choice" data-link="https://earth.google.com/">
            <b>🌍 Google Earth</b><small>Dünyayı uydu görüntüleriyle keşfet.</small>
          </button>
        </div>

        <div class="goai-title goai-section-gap">🔐 Google Güvenlik ve Gizlilik</div>
        <div class="goai-grid">
          <button class="goai-choice" data-link="https://myaccount.google.com/security">
            <b>🛡️ Güvenlik Ayarları</b><small>Girişleri, cihazları ve güvenlik kontrollerini incele.</small>
          </button>
          <button class="goai-choice" data-link="https://myaccount.google.com/data-and-privacy">
            <b>🔒 Gizlilik ve Veriler</b><small>Kişisel verilerini ve gizlilik tercihlerini yönet.</small>
          </button>
          <button class="goai-choice" data-link="https://myactivity.google.com/">
            <b>📋 Google Etkinliğim</b><small>Google hizmetlerindeki etkinlik geçmişini görüntüle.</small>
          </button>
          <button class="goai-choice" data-link="https://passwords.google.com/">
            <b>🔑 Google Şifre Yöneticisi</b><small>Kayıtlı şifrelerini görüntüle ve yönet.</small>
          </button>
          <button class="goai-choice" data-link="https://takeout.google.com/">
            <b>📦 Google Takeout</b><small>Google verilerini indir ve dışa aktar.</small>
          </button>
          <button class="goai-choice" data-link="https://pay.google.com/">
            <b>💳 Google Pay</b><small>Ödeme yöntemlerini ve işlemlerini yönet.</small>
          </button>
        </div>

        <div class="goai-title goai-section-gap">➕ Google Hesap İşlemleri</div>
        <div class="goai-grid">
            <button class="goai-choice" data-link="https://myaccount.google.com/">
            <b>👤 Google Hesabım</b><small>Hesap bilgilerini ve kişisel ayarlarını yönet.</small>
          </button>
          <button class="goai-choice" data-link="https://accounts.google.com/AddSession?hl=tr&continue=https://myaccount.google.com/">
            <b>➕ Başka Hesap Ekle</b><small>Mevcut oturumuna yeni Google hesabı ekle.</small>
          </button>
          <button class="goai-choice" data-link="https://accounts.google.com/signup">
            <b>🆕 Yeni Hesap Oluştur</b><small>Yeni bir Google hesabı aç.</small>
          </button>
        </div>

        <div class="goai-title goai-section-gap">🌐 Chrome ve Tarayıcı Araçları</div>
        <div class="goai-grid">
          <button class="goai-choice" data-link="https://www.google.com/intl/en/chrome/?standalone=1">
            <b>⬇️ Chrome Çevrimdışı İndir</b><small>İnternet bağlantısı olmadan kurulum için tam yükleyici.</small>
          </button>
          <button class="goai-choice" data-link="https://www.google.com/chrome/update/">
            <b>🔄 Chrome Çevrimiçi İndir</b><small>Chrome'u indir veya güncel sürümünü yükle.</small>
          </button>
          <button class="goai-choice" data-link="https://chromewebstore.google.com/?authuser=0">
            <b>🧩 Chrome Web Mağazası</b><small>Tarayıcıya eklenti ve tema yükle.</small>
          </button>
        </div>
      </div>
    </details>

<details class="goai-drawer" id="goai-history-drawer">
  <summary>🗂️ Arama geçmişi (${state.history.length})</summary>

  <div class="goai-drawer-content">

<div class="goai-row" style="gap:5px;flex-wrap:wrap">
  <button class="goai-btn" id="goai-export-csv">⬇ CSV</button>
  <button class="goai-btn" id="goai-export-txt">⬇ TXT / LOG</button>
  <button class="goai-btn clear" id="goai-clear-history">🗑 Tümünü sil</button>
</div>

    <div id="goai-history-list" style="margin-top:6px">
      ${
        (() => {
          const groups={};

          state.history.forEach((h,i)=>{
            const date=(h.date||'Tarih bilgisi yok').split(' ')[0];
            (groups[date] ||= []).push({...h,index:i});
          });

          const parseDate=s=>{
            const p=s.split('.');
            return p.length===3
              ? new Date(+p[2],+p[1]-1,+p[0]).getTime()
              : 0;
          };

          return Object.entries(groups)
            .sort((a,b)=>parseDate(b[0])-parseDate(a[0]))
            .map(([date,items])=>`
              <details class="goai-day-drawer">

                                <summary>${esc(date)} ${['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][new Date(+date.split('.')[2], +date.split('.')[1]-1, +date.split('.')[0]).getDay()]} (${items.length})</summary>

                <div class="goai-day-content">

                  <div class="goai-day-actions">
                    <button class="goai-btn"
                            data-day-export="csv"
                            data-day="${esc(date)}">
                      Günü CSV indir
                    </button>

                    <button class="goai-btn"
                            data-day-export="txt"
                            data-day="${esc(date)}">
                      Günü TXT indir
                    </button>

                    <button class="goai-btn clear"
                            data-day-delete="${esc(date)}">
                      🗑 Günü Sil
                    </button>
                  </div>


                  ${items.map(h=>{


                    const icons=Array.isArray(h.icons)&&h.icons.length
                      ?h.icons
                      :[{icon:'⌕',label:'Google araması (eski kayıt)'}];

                    const iconHtml=item=>`
                      <span
                        class="goai-history-icon"
                        tabindex="0"
                        title="${esc(item.label||'İşlem')}"
                        aria-label="${esc(item.label||'İşlem')}">
                        <span class="goai-history-icon-symbol">${esc(item.icon||'⌕')}</span>
                      </span>
                    `;

                    return `
                    <div class="goai-history" data-type="${esc(h.type||'search')}">

                      <details class="goai-history-more">
                        <summary title="İşlem ikonlarını göster" aria-label="İşlem ikonlarını göster">›</summary>
                        <div class="goai-history-popup">
                          ${icons.map(iconHtml).join('')}
                        </div>
                      </details>

                      <div class="goai-history-info">
                        ${historyLabelHtml(h)}
                      </div>

                      <small class="goai-history-time">
                        ${esc(
                          (h.date||'').split(' ').slice(1).join(' ')
                          || 'Saat bilgisi yok'
                        )}
                      </small>

                      ${h.url?'<button class="goai-btn" data-open-link="'+h.index+'" title="Bağlantıyı aç">↗</button>':''}

                      <button class="goai-btn goai-copy-link"
                              data-copy-link="${h.index}"
                              title="${h.copyText?'Çeviriyi kopyala':'Bağlantıyı kopyala'}">⧉</button>

                      <button class="goai-btn clear"
                              data-delete="${h.index}"
                              title="Bu kaydı sil">×</button>

                    </div>
                    `;
                  }).join('')}

                </div>
              </details>
            `).join('')
            || '<div class="goai-muted">Henüz kayıt yok.</div>';
        })()
      }
    </div>


  </div>
</details>

    <details class="goai-drawer">
      <summary>✉️ Geliştiriciye ulaş</summary>
      <div class="goai-drawer-content">
        ${DEVELOPER_EMAIL
          ? `<button class="goai-btn search" id="goai-contact" style="width:100%">Geliştiriciye e-posta gönder</button>`
          : `<div class="goai-muted">Geliştirici iletişim adresi henüz tanımlanmadı.</div>`}
      </div>
    </details>`;

  $$('[data-link]').forEach(b=>b.onclick=()=>{
  const link=document.createElement('a');
  link.href=b.dataset.link;
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.style.display='none';

  document.body.appendChild(link);
  link.click();
  link.remove();
  });

  $$('[data-delete]').forEach(b=>b.onclick=()=>{
    const savedScroll=scrollArea.scrollTop;
    const drawer=$('#goai-history-drawer');
    const wasOpen=drawer.open;
    state.history.splice(+b.dataset.delete,1);
    save();
    renderTools();
    const newDrawer=$('#goai-history-drawer');
    newDrawer.open=wasOpen;
    scrollArea.scrollTop=savedScroll;
  });

// Geçmiş kaydındaki bağlantıyı aç
  $$('[data-open-link]').forEach(b=>b.onclick=()=>{
    const h=state.history[+b.dataset.openLink];
    if(!h||!h.url) return;

    window.open(h.url,'_blank','noopener,noreferrer');
  });

// Arama bağlantısını panoya kopyala
  $$('[data-copy-link]').forEach(b=>b.onclick=async()=>{
    const h=state.history[+b.dataset.copyLink];
    if(!h) return;

    const copyText=h.copyText||h.url;
    if(!copyText) return;

    try {
      if(navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textarea=document.createElement('textarea');
        textarea.value=copyText;
        textarea.style.position='fixed';
        textarea.style.opacity='0';
        document.body.appendChild(textarea);
        textarea.select();

        const copied=document.execCommand('copy');
        textarea.remove();

        if(!copied) throw new Error('Kopyalama başarısız');
      }

      const oldText=b.textContent;
      b.textContent='✓';
      b.title='Bağlantı kopyalandı';

      setTimeout(()=>{
        if(b.isConnected) {
          b.textContent=oldText;
          b.title=h.copyText?'Çeviriyi kopyala':'Bağlantıyı kopyala';
        }
      },1200);

    } catch(error) {
      alert('Bağlantı kopyalanamadı. Tarayıcı izinlerini kontrol edin.');
    }
  });

// Seçilen tarihin kayıtlarını topluca sil
  $$('[data-day-delete]').forEach(b=>b.onclick=()=>{
    const date=b.dataset.dayDelete;

    const count=state.history.filter(
      h=>(h.date||'Tarih bilgisi yok').split(' ')[0]===date
    ).length;

    if(!count) return;

    if(confirm(`${date} tarihindeki ${count} arama kaydı silinsin mi?`)){
      const savedScroll=scrollArea.scrollTop;
      const drawer=$('#goai-history-drawer');
      const wasOpen=drawer.open;

      state.history=state.history.filter(
        h=>(h.date||'Tarih bilgisi yok').split(' ')[0]!==date
      );

      save();
      renderTools();

      $('#goai-history-drawer').open=wasOpen;
      scrollArea.scrollTop=savedScroll;
    }
  });

// Genel ve günlük geçmişi CSV veya TXT olarak dışa aktar
  function exportHistory(format, records, filename, heading) {
    if(!records.length) {
      alert('Dışa aktarılacak kayıt bulunamadı.');
      return;
    }

    let content;
    let mime;
    let extension;

    if(format === 'csv') {
      const quote = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';

      content = '\uFEFF' + [
        [heading],
        [],
        ['Tarih', 'Saat', 'Arama', 'URL'],
        ...records.map(h => [
          (h.date || '').split(' ')[0],
          (h.date || '').split(' ').slice(1).join(' '),
          h.label,
          h.url
        ])
      ].map(row => row.map(quote).join(';')).join('\r\n');

      mime = 'text/csv;charset=utf-8';
      extension = 'csv';

    } else {
      content = heading + '\n\n' + records.map(h =>
        `Tarih: ${h.date || 'Bilinmiyor'}\n` +
        `Arama: ${h.label || ''}\n` +
        `URL: ${h.url || ''}\n` +
        '----------------------------------------'
      ).join('\n\n');

      mime = 'text/plain;charset=utf-8';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${filename}.${extension}`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

// Seçilen tarihin kayıtlarını CSV veya TXT olarak indir
  $$('[data-day-export]').forEach(b => b.onclick = () => {
    const date = b.dataset.day;
    const format = b.dataset.dayExport;

    const records = state.history.filter(
      h => (h.date || '').split(' ')[0] === date
    );

    exportHistory(
      format,
      records,
      `Gunluk-Gecmis-${date.replace(/\./g, '-')}`,
      `Geçmiş indirildi ${date}`
    );
  });


// Genel geçmiş tarih aralığını hesapla
  function getAllHistoryHeading() {
    const dates = state.history
      .map(h => (h.date || '').split(' ')[0])
      .filter(d => /^\d{2}\.\d{2}\.\d{4}$/.test(d));

    const dateValue = d => {
      const [day, month, year] = d.split('.');
      return new Date(+year, +month - 1, +day).getTime();
    };

    dates.sort((a, b) => dateValue(a) - dateValue(b));

    const first = dates[0] || 'Tarih bilinmiyor';
    const last = dates[dates.length - 1] || 'Tarih bilinmiyor';

    return `Tüm Geçmiş ${first} - ${last}`;
  }

// Genel geçmişi CSV olarak indir
  $('#goai-export-csv').onclick = () => {
    exportHistory(
      'csv',
      state.history,
      `Tum-Gecmis-${getAllHistoryHeading().replace('Tüm Geçmiş ', '').replaceAll(' - ', '-')}`,
      getAllHistoryHeading()
    );
  };

// Genel geçmişi TXT olarak indir
  $('#goai-export-txt').onclick = () => {
    exportHistory(
      'txt',
      state.history,
      `Tum-Gecmis-${getAllHistoryHeading().replace('Tüm Geçmiş ', '').replaceAll(' - ', '-')}`,
      getAllHistoryHeading()
    );
  };

  if($('#goai-contact')) {
    $('#goai-contact').onclick=()=>window.location.href='mailto:'+DEVELOPER_EMAIL;
  }

  scrollArea.scrollTop=oldScroll;
}

// Aynı Anda Tek İşlem Baloncuğu Açık Olsun - Geçmişte

document.addEventListener('toggle',function(e){
  const current=e.target;

  if(
    current.matches('.goai-history-more') &&
    current.open
  ){
    document.querySelectorAll('.goai-history-more[open]').forEach(item=>{
      if(item!==current){
        item.open=false;
      }
    });
  }
},true);

// Panel dili: Türkçe sabittir. Diğer diller Uygula düğmesine basılınca
// tek seferde çevrilir, paket halinde yerel hafızaya yazılır ve sonraki
// sekme/yeniden çizim işlemlerinde yalnızca bu paket kullanılır.
const UI_PACKAGE_PREFIX='goai_ui_pack_';
let activeUiDictionary={};
let uiApplyInProgress=false;
let uiApplyGeneration=0;

function loadUiPackage(lang) {
  if(lang==='tr') return {};
  try {
    const raw=persistentGet(UI_PACKAGE_PREFIX+lang,'');
    return raw ? JSON.parse(raw) : {};
  } catch(_) { return {}; }
}

function applyUiPackageToPanel() {
  const lang=state.uiLanguage||'tr';

  if(lang==='tr') {
    const walker=document.createTreeWalker(panel,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())) {
      if(node.__goaiOriginal!==undefined) node.nodeValue=node.__goaiOriginal;
    }

    panel.querySelectorAll('[data-goai-original-placeholder],[data-goai-original-title],[data-goai-original-aria]').forEach(el=>{
      if(el.dataset.goaiOriginalPlaceholder!==undefined) el.setAttribute('placeholder',el.dataset.goaiOriginalPlaceholder);
      if(el.dataset.goaiOriginalTitle!==undefined) el.setAttribute('title',el.dataset.goaiOriginalTitle);
      if(el.dataset.goaiOriginalAria!==undefined) el.setAttribute('aria-label',el.dataset.goaiOriginalAria);
    });
    return;
  }

  const dict=activeUiDictionary && Object.keys(activeUiDictionary).length
    ? activeUiDictionary : loadUiPackage(lang);
  activeUiDictionary=dict;

  const walker=document.createTreeWalker(panel,NodeFilter.SHOW_TEXT);
  let node;

  while((node=walker.nextNode())) {
    const parent=node.parentElement;
    if(!parent || parent.closest('script,style,input,textarea,.goai-preview,.goai-history,.goai-example,#goai-ui-language')) continue;

    if(node.__goaiOriginal===undefined) node.__goaiOriginal=node.nodeValue;
    const original=node.__goaiOriginal;

    if(Object.prototype.hasOwnProperty.call(dict,original)) {
      node.nodeValue=dict[original];
    }
  }

  panel.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
    if(el.matches('#goai-ui-language')) return;

    for(const [attr,key] of [
      ['placeholder','goaiOriginalPlaceholder'],
      ['title','goaiOriginalTitle'],
      ['aria-label','goaiOriginalAria']
    ]) {
      if(!el.hasAttribute(attr)) continue;
      const original=el.dataset[key]!==undefined ? el.dataset[key] : el.getAttribute(attr);
      el.dataset[key]=original;

      if(Object.prototype.hasOwnProperty.call(dict,original)) {
        el.setAttribute(attr,dict[original]);
      }
    }
  });
}

function collectPanelStrings() {
  const strings=new Set();

  const scan=()=>{
    const walker=document.createTreeWalker(panel,NodeFilter.SHOW_TEXT);
    let node;

    while((node=walker.nextNode())) {
      const parent=node.parentElement;
      if(!parent || parent.closest('script,style,input,textarea,.goai-preview,.goai-history,.goai-example,#goai-ui-language')) continue;

      const raw=node.__goaiOriginal!==undefined ? node.__goaiOriginal : node.nodeValue;
      if(raw && raw.trim()) strings.add(raw);
    }

    panel.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
      if(el.matches('#goai-ui-language')) return;

      for(const attr of ['placeholder','title','aria-label']) {
        const value=el.getAttribute(attr);
        if(value && value.trim()) strings.add(value);
      }
    });
  };

  const previousTab=state.tab;
  const previousScroll=scrollArea.scrollTop;

  collectingUiCatalog=true;

  try {
    state.tab='search'; renderSearch(); scan();
    state.tab='tactics'; renderTactics(); scan();
    state.tab='translate'; renderTranslate(); scan();
    state.tab='tools'; renderTools(); scan();

    scan();

    [
      'Nasıl yardımcı olabilirim?','Hoş geldin!',
      'Gösterilen IP genel (dış) IP adresidir. Yerel ağ IP adresi tarayıcıdan güvenilir biçimde alınamaz.',
      'Ne aramak istediğini yukarıya yaz. Arama, taktikler, çeviri, döviz, uçuş, otel ve Google hesap araçlarını kullanabilirsin.',
      'Ayar kaldırıldı','Seçtiğin ayar aramadan kaldırıldı. Diğer ayarların korunuyor.',
      'Operatör kaldırıldı','Arama operatörü kaldırıldı.',
      'Arama biçimi kaldırıldı','Akıllı arama biçimi devre dışı bırakıldı.',
      'Google ülke ayarı','Uçuş bilgileri eksik',
      'Kalkış ve varış şehirlerini ayrı ayrı gir.',
      'Gidiş tarihi eksik veya geçersiz','Geçerli bir gidiş tarihi seç.',
      'Dönüş tarihi eksik veya geçersiz','Dönüş tarihi, gidiş tarihinden önce olamaz.',
      'Google Uçuş araması','Hazırlanan uçuş araması yeni sekmede açılıyor.',
      'Uçuş bağlantısı kopyalandı',
      'Bağlantı gizli sekmede açılmak üzere panoya kopyalandı.',
      'Bağlantı kopyalanamadı','Tarayıcı panoya erişim izni vermedi.',
      'Konaklama yeri eksik','Otel aramak için şehir veya konaklama bölgesi gir.',
      'Otel araması','Çeviri asistanı',
      'Kaynak ve hedef dili seç. Döviz, uçuş ve otel arama araçlarını da bu bölümden kullanabilirsin.',
      'Arama taktikleri',
      'Hazır arama araçlarını kullanabilir; futbol merkezi ve yapay zekâ asistanlarını açılır bölümlerden görüntüleyebilirsin.',
      'Araçlar','Google uygulamaları, hesap bağlantıları, arama geçmişi ve geliştirici iletişimi.',
      'Google arama merkezi',
      'Operatörleri, akıllı arama biçimlerini ve filtreleri kullanarak aramanı özelleştir.',
      'Önce metin yaz','Çevirmek istediğin metni çeviri alanına yaz.',
      'Çeviri burada görüntülenecek.','Çeviri sonucu','Sonucu kopyala',
      'Çeviri doğrudan panel içinde yapılır.',
      'Uygula','Dil paketi indirilemedi',
      'Çeviri servisi yanıt vermedi veya paket kaydedilemedi. Tekrar deneyebilirsin.',
      'Dil uygulandı','Panelin sabit dili Türkçe olarak ayarlandı.',
      'Kopyalama yapılamadı'
    ].forEach(value=>strings.add(value));

  } finally {
    collectingUiCatalog=false;
    state.tab=previousTab;

    if(previousTab==='search') renderSearch();
    else if(previousTab==='tactics') renderTactics();
    else if(previousTab==='translate') renderTranslate();
    else renderTools();

    refreshPreview();
    scrollArea.scrollTop=previousScroll;
  }

  return [...strings];
}

function googleCurrencyRate(from,to) {
  return new Promise((resolve,reject)=>{
    const query=`1 ${from} to ${to}`;
    const url='https://www.google.com/search?'+new URLSearchParams({
      q:query,
      hl:'en'
    }).toString();

    GM_xmlhttpRequest({
      method:'GET',
      url,
      timeout:30000,
      headers:{
        'Accept':'text/html'
      },
      onload(response) {
        try {
          if(response.status<200 || response.status>=300) {
            throw new Error('Google HTTP '+response.status);
          }

          const parser=new DOMParser();
          const doc=parser.parseFromString(response.responseText,'text/html');

          const rateElement=doc.querySelector('.DFlfde[data-value], .DFlfde');

          if(!rateElement) {
            throw new Error('Google kur verisi bulunamadı.');
          }

          let raw=rateElement.getAttribute('data-value');

          if(!raw) {
            raw=rateElement.textContent.trim().replace(/\s/g,'');
            raw=raw.replace(/,/g,'');
          }

          const rate=Number(raw);

          if(!Number.isFinite(rate) || rate<=0) {
            throw new Error('Google geçerli bir kur değeri döndürmedi.');
          }

          resolve(rate);

        } catch(error) {
          reject(error);
        }
      },
      onerror:()=>reject(new Error('Google bağlantısı kurulamadı.')),
      ontimeout:()=>reject(new Error('Kur sorgusu zaman aşımına uğradı.'))
    });
  });
}

function gmTranslateRequest(source,target,text) {
  return new Promise((resolve,reject)=>{
    const url='https://translate.googleapis.com/translate_a/single?'+new URLSearchParams({
      client:'gtx',sl:source||'auto',tl:target,dt:'t',q:text
    }).toString();

    GM_xmlhttpRequest({
      method:'GET',
      url,
      timeout:30000,

      onload(response) {
        try {
          if(response.status<200 || response.status>=300) {
            throw new Error('HTTP '+response.status);
          }

          const data=JSON.parse(response.responseText);
          const translated=(data[0]||[]).map(part=>part[0]||'').join('');

          if(!translated) throw new Error('Boş çeviri yanıtı');
          resolve(translated);
        } catch(error) {
          reject(error);
        }
      },

      onerror:reject,
      ontimeout:()=>reject(new Error('Çeviri isteği zaman aşımına uğradı'))
    });
  });
}

async function googleTranslateText(source,target,text) {
  return gmTranslateRequest(source,target,text);
}

async function translateUiCatalog(strings,lang,generation) {
  const dictionary={};
  const delimiter='\nGOAI_TRANSLATION_SEPARATOR_7F3A9C\n';

  const entries=strings.map(raw=>({
    raw,
    trimmed:raw.trim(),
    leading:(raw.match(/^\s*/)||[''])[0],
    trailing:(raw.match(/\s*$/)||[''])[0]
  })).filter(x=>x.trimmed);

  const chunks=[];
  let chunk=[],size=0;

  for(const entry of entries) {
    const add=entry.trimmed.length+delimiter.length;

    if(chunk.length && size+add>1900) {
      chunks.push(chunk);
      chunk=[];
      size=0;
    }

    chunk.push(entry);
    size+=add;
  }

  if(chunk.length) chunks.push(chunk);

  let completed=0;

  for(const group of chunks) {
    if(generation!==uiApplyGeneration) {
      throw new Error('Dil işlemi iptal edildi.');
    }

    let translatedParts=null;

    if(group.length===1) {
      translatedParts=[await gmTranslateRequest('tr',lang,group[0].trimmed)];
    } else {
      try {
        const joined=group.map(x=>x.trimmed).join(delimiter);
        const response=await gmTranslateRequest('tr',lang,joined);
        const pieces=response.split(delimiter);

        if(pieces.length===group.length) translatedParts=pieces;
      } catch(_) {}

      if(!translatedParts) {
        translatedParts=[];

        for(const entry of group) {
          if(generation!==uiApplyGeneration) {
            throw new Error('Dil işlemi iptal edildi.');
          }

          translatedParts.push(await gmTranslateRequest('tr',lang,entry.trimmed));
        }
      }
    }

    group.forEach((entry,index)=>{
      dictionary[entry.raw]=entry.leading+translatedParts[index].trim()+entry.trailing;
    });

    completed+=group.length;

    const applyButton=$('#goai-ui-apply');
    if(applyButton) {
      applyButton.textContent=`${Math.round(completed/entries.length*100)}%`;
    }
  }

  return dictionary;
}

async function applySelectedUiLanguage() {
  if(uiApplyInProgress) return;

  const select=$('#goai-ui-language');
  const applyButton=$('#goai-ui-apply');
  const nextLanguage=select ? select.value : 'tr';

  if(!languages.some(l=>l[0]===nextLanguage && l[0]!=='auto')) return;

  if(nextLanguage==='tr') {
    uiApplyGeneration++;
    state.uiLanguage='tr';
    activeUiDictionary={};
    persistentSet('goai_ui_language','tr');
    save();
    panel.dir='ltr';
    render();
    explain('Dil uygulandı','Panelin sabit dili Türkçe olarak ayarlandı.');

    if(applyButton) applyButton.textContent='Uygula';
    return;
  }

  uiApplyInProgress=true;
  const generation=++uiApplyGeneration;
  const previousLanguage=state.uiLanguage||'tr';

  if(applyButton) {
    applyButton.disabled=true;
    applyButton.textContent='Uygula';
  }

  panel.classList.add('goai-translating');

  try {
    const strings=collectPanelStrings();

    if(applyButton) applyButton.textContent='İndiriliyor';

    const dictionary=await translateUiCatalog(strings,nextLanguage,generation);

    if(generation!==uiApplyGeneration) return;

    // Paket tek seferde yazılır; yarım paket aktif dile geçirilmez.
    persistentSet(UI_PACKAGE_PREFIX+nextLanguage,JSON.stringify(dictionary));

    activeUiDictionary=dictionary;
    state.uiLanguage=nextLanguage;

    persistentSet('goai_ui_language',nextLanguage);
    save();

    panel.dir=(nextLanguage==='ar'||nextLanguage==='he')?'rtl':'ltr';
    panel.classList.remove('goai-translating');

    render();

  } catch(error) {
    state.uiLanguage=previousLanguage;
    activeUiDictionary=loadUiPackage(previousLanguage);

    panel.dir=(previousLanguage==='ar'||previousLanguage==='he')?'rtl':'ltr';
    panel.classList.remove('goai-translating');

    render();

    explain('Dil paketi indirilemedi','Çeviri servisi yanıt vermedi veya paket kaydedilemedi. Tekrar deneyebilirsin.');

    console.error('GOAI UI language package error:',error);

    if(select) select.value=previousLanguage;

  } finally {
    uiApplyInProgress=false;

    if(applyButton) {
      applyButton.disabled=false;
      applyButton.textContent='Uygula';
    }
  }
}

function render() {
  const savedScroll=scrollArea.scrollTop;

  $$('.goai-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));

  if(state.tab==='search') renderSearch();
  if(state.tab==='tactics') renderTactics();
  if(state.tab==='translate') renderTranslate();
  if(state.tab==='tools') renderTools();

  refreshPreview();
  scrollArea.scrollTop=savedScroll;
  applyUiPackageToPanel();
}

function detectBrowser() {
  const ua=navigator.userAgent;
  if(ua.includes('Edg/')) return 'Microsoft Edge';
  if(ua.includes('OPR/')) return 'Opera';
  if(ua.includes('Firefox/')) return 'Mozilla Firefox';
  if(ua.includes('Chrome/')) return 'Google Chrome';
  if(ua.includes('Safari/')) return 'Safari';
  return 'Bilinmiyor';
}

function detectPlatform() {
  return navigator.userAgentData?.platform || navigator.platform || 'Bilinmiyor';
}

let systemInfoPromise=null;

function loadSystemInfo() {
  const ip=$('#goai-ip');
  if(!ip) return;

  $('#goai-browser').textContent=detectBrowser();
  $('#goai-platform').textContent=detectPlatform();
  $('#goai-screen').textContent=`${screen.width} × ${screen.height}`;
  $('#goai-language').textContent=navigator.language || 'Bilinmiyor';
  $('#goai-timezone').textContent=Intl.DateTimeFormat().resolvedOptions().timeZone || 'Bilinmiyor';

  if(systemInfoPromise) {
    systemInfoPromise.then(result=>{
      const target=$('#goai-ip');
      if(target) target.textContent=result;
    });
    return;
  }

  systemInfoPromise=(async()=>{
  const services=[
    'https://api.ipify.org?format=json',
    'https://api64.ipify.org?format=json',
    'https://ipwho.is/'
  ];

  for(const url of services){
    try{
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok) continue;
      const data=await r.json();
      const ip=data.ip || data.ip_address;
      if(ip) return ip;
    }catch(e){}
  }

  return 'Gösterilemiyor';
})();

systemInfoPromise.then(result=>{
  const target=$('#goai-ip');
  if(target) target.textContent=result;
});
}

input.value=state.q;

input.addEventListener('input',()=>{
  state.q=input.value;
  refreshPreview();
});

input.addEventListener('keydown',e=>{
  if(e.key==='Enter') runSearch();
});

$('#goai-search').onclick=runSearch;

$('#goai-clear').onclick=()=>{
  state.q='';
  input.value='';
  refreshPreview();
  input.focus();
};

$('#goai-copy').onclick=async()=>{
  const text=query();
  if(!text) return;

  try {
    await navigator.clipboard.writeText(text);
    $('#goai-copy').textContent='✓';
    setTimeout(()=>$('#goai-copy').textContent='📋',1200);
  } catch(_) {
    explain('Kopyalama yapılamadı','Tarayıcı panoya erişim izni vermedi.');
  }
};

$$('[data-tab]').forEach(b=>b.onclick=()=>{
  state.tab=b.dataset.tab;
  render();

  if(state.tab==='translate') {
    explain('Çeviri asistanı','Kaynak ve hedef dili seç. Döviz, uçuş ve otel arama araçlarını da bu bölümden kullanabilirsin.');
  }

  if(state.tab==='tactics') {
    explain('Arama taktikleri','Hazır arama araçlarını kullanabilir; futbol merkezi ve yapay zekâ asistanlarını açılır bölümlerden görüntüleyebilirsin.');
  }

  if(state.tab==='tools') {
    explain('Araçlar','Google uygulamaları, hesap bağlantıları, arama geçmişi ve geliştirici iletişimi.');
  }

  if(state.tab==='search') {
    explain('Google arama merkezi','Operatörleri, akıllı arama biçimlerini ve filtreleri kullanarak aramanı özelleştir.');
  }
});

$('#goai-launch').onclick=()=>{
  panel.classList.add('open');
  $('#goai-launch').classList.add('goai-hidden');
  input.focus();
};

function closePanel() {
  panel.classList.remove('open');
  $('#goai-launch').classList.remove('goai-hidden');
}

$('#goai-close').onclick=closePanel;
$('#goai-min').onclick=closePanel;

$('#goai-ui-apply').onclick=applySelectedUiLanguage;
$('#goai-ui-language').onchange=()=>{
  $('#goai-ui-apply').textContent='Uygula';
};

activeUiDictionary=loadUiPackage(state.uiLanguage);
$('#goai-ui-language').value=state.uiLanguage;
panel.dir = (state.uiLanguage==='ar' || state.uiLanguage==='he') ? 'rtl' : 'ltr';

document.addEventListener('keydown',e=>{
  if(e.key==='Escape' && panel.classList.contains('open')) closePanel();

  if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==='o') {
    e.preventDefault();

    if(panel.classList.contains('open')) closePanel();
    else $('#goai-launch').click();
  }
});

render();

explain(
  'Hoş geldin!',
  'Ne aramak istediğini aşağıya yaz. Arama, taktikler, çeviri, döviz, uçuş, otel ve Google hesap araçlarını kullanabilirsin. Ayrıca bunu kimin yaptığını unutma! :)',
  'Ankara hava durumu'
);

})();
