 <div align="center">

# ✦ efem360 Google Görseller Hızlı Görüntüleyici

### Google Görseller'deki Orijinal Görsellere Tek Tıkla Erişim

**Google Görseller'e hızlı görüntüleme butonları ekleyen, kullanıcıların orijinal görselleri tek tıkla açmasını sağlayan hafif bir Tampermonkey kullanıcı betiği.**

Google Görseller'de orijinal görselleri bulmak ve açmak bazen gereksiz adımlar gerektirebilir. Bu kullanıcı betiği, tanınan görsel kapsayıcılarına doğrudan küçük bir kamera butonu ekleyerek bu işlemi kolaylaştırır.

**F1** tuşuna basarak mevcut görsel sonuçlarını tarayın ve hızlı görüntüleme butonlarını ekleyin. Buton eklendikten sonra, orijinal görseli ayrı bir tarayıcı sekmesinde açmak için 📷 butonuna tıklamanız yeterlidir.

Betik ayrıca dinamik olarak yüklenen içerikleri izler ve sonradan eklenen yeni görsel sonuçlarını otomatik olarak işler.

İster görsel referansları topluyor, ister görsel kaynaklarını inceliyor, ister orijinal görselleri açıyor olun, bu betik Google Görseller'in içine doğrudan entegre edilmiş kullanışlı bir kısayol sunar.

<br>

[![Kullanıcı Betiği](https://img.shields.io/badge/Kullanıcı%20Betiği-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Sürüm](https://img.shields.io/badge/Sürüm-1.1-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)
[![Lisans](https://img.shields.io/badge/Lisans-MIT-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Google-Images-Quick-View-Button/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Google%20Görseller-EA4335?style=for-the-badge&logo=google&logoColor=white)](https://images.google.com/)

<br>

[⚡ Tek Tıkla Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js) · [GitHub Deposu](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button) · [Sorun Bildirimi](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button/issues)

<br>

**Orijinal Görselleri Açın. Tek Tıkla.**

</div>

---

## Genel Bakış

**efem360 Google Görseller Hızlı Görüntüleyici**, Google Görseller'deki orijinal görselleri doğrudan açmayı kolaylaştırmak için tasarlanmış hafif bir tarayıcı kullanıcı betiğidir.

Google Görseller milyonlarca görsele erişim sağlar; ancak bir görselin orijinal kaynağını açmak çoğu zaman birkaç ek tıklama gerektirir.

Bu kullanıcı betiği, tanınan görsel kapsayıcılarına küçük bir kamera butonu ekleyerek bu işlemi kolaylaştırır.

Bu buton sayesinde kullanıcılar:

- Bir görselin orijinalini doğrudan açabilir.
- Google'ın görsel önizlemesine manuel olarak gitmeden görsel URL'lerine erişebilir.
- Görselleri ayrı bir tarayıcı sekmesinde açabilir.
- F1 klavye kısayoluyla mevcut görsel sonuçlarını işleyebilir.
- Sonradan eklenen yeni görsel sonuçlarını otomatik olarak işleyebilir.

Betik, ayrı bir uygulama arayüzü oluşturmadan doğrudan Google Görseller'e entegre olur.

### Öne Çıkan Özellikler

- **Hızlı Görsel Erişimi:** Orijinal görselleri tek tıklamayla açın.
- **F1 Klavye Kısayolu:** Mevcut görsel sonuçlarını tarayarak hızlı görüntüleme butonları ekleyin.
- **Doğrudan Görsel Açma:** Google'ın önizleme sayfası yerine orijinal görsel URL'sini açın.
- **Dinamik İçerik Algılama:** Sonradan eklenen yeni görsel sonuçlarını otomatik olarak algılar.
- **MutationObserver Teknolojisi:** Dinamik olarak yüklenen içerikleri algılamak için DOM değişikliklerini izler.
- **Yinelenen Butonları Önleme:** Aynı bağlantının tekrar tekrar işlenmesini engeller.
- **URL Doğrulama:** Buton oluşturmadan önce çıkarılan görsel URL'lerini kontrol eder.
- **Modern URL Ayrıştırma:** Yerleşik URL API ve URLSearchParams kullanır.
- **Hafif Mimari:** Harici kütüphaneler kullanmadan yerel JavaScript ve DOM API'leriyle çalışır.
- **Minimal Arayüz:** Kompakt kamera butonlarını doğrudan görsel kapsayıcılarına ekler.
- **Görsel Geri Bildirim:** Üzerine gelme efektleri ve geçici F1 bilgilendirme mesajı içerir.
- **Ek İzin Gerektirmez:** `@grant none` ile çalışır.

---

## 📌 Proje Hakkında

Bu projenin temel amacı, Google Görseller'deki orijinal görsellere erişimi daha hızlı ve kolay hâle getirmektir.

Görsel arama sonuçlarına göz atarken kullanıcıların çoğu zaman bir görselin önizlemesini açması, kaynağını bulması ve ardından orijinal görsele gitmesi gerekir.

Bu kullanıcı betiği söz konusu adımları azaltır.

Kurulduktan sonra, tanınan görsel kapsayıcılarında küçük bir kamera butonu görünür.

Bu butona tıklandığında, çıkarılan orijinal görsel URL'si yeni bir tarayıcı sekmesinde açılır.

### Nasıl Çalışır?

Google Görseller, arama sonuçlarıyla ilişkili bağlantılarda görsellerle ilgili bilgileri saklar.

Kullanıcı betiği, `imgurl` parametresini içeren bağlantıları belirler ve ilişkili görsel URL'sini çıkarır.

URL doğrulandıktan sonra bir kamera butonu oluşturulur ve ilgili görsel kapsayıcısına eklenir.

<details>
<summary><strong>Hızlı Görüntüleme Butonu Etkileşimi</strong></summary>

| İşlem | Sonuç |
|---|---|
| F1 | Mevcut görsel sonuçlarını tara ve butonları ekle |
| 📷 Üzerine Sol Tıklama | Orijinal görseli yeni sekmede aç |
| 📷 Üzerine Gelme | Üzerine gelme efektini göster |
| Bilgilendirme Mesajına Tıklama | Bilgilendirme mesajını kapat |

</details>

### Temel Hedefler

- Orijinal görselleri açmak için gereken adım sayısını azaltmak.
- Görsel kaynak URL'lerine doğrudan erişim sağlamak.
- Kullanışlı görsel açma kısayolları sunmak.
- Görsel erişimini doğrudan Google Görseller içerisinde tutmak.
- Dinamik olarak eklenen görsel sonuçlarını desteklemek.
- Yinelenen buton eklenmesini önlemek.
- Görselleri açmadan önce URL'leri doğrulamak.
- Gereksiz DOM işlemlerini en aza indirmek.
- Mevcut Google Görseller arayüzünü korumak.
- Kullanıcı betiğini hafif ve bakımı kolay tutmak.

---

## 🚀 Kurulum

### Gereksinimler

Aşağıdakiler gereklidir:

- Desteklenen bir masaüstü tarayıcı.
- Tampermonkey tarayıcı eklentisi.
- Google Görseller'e erişim.

### 1. Tampermonkey'i Yükleyin

Tarayıcınız için Tampermonkey eklentisini yükleyin.

**Resmî Web Sitesi:**

https://www.tampermonkey.net/

### 2. Kullanıcı Betiğini Yükleyin

Aşağıdaki yükleme bağlantısını açın:

**[efem360 Google Görseller Hızlı Görüntüleyici'yi Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js)**

Tampermonkey, kullanıcı betiği yükleme ekranını otomatik olarak açacaktır.

Yüklemeyi tamamlamak için **Yükle (Install)** seçeneğine tıklayın.

### 3. Kullanmaya Başlama

Yükleme işleminden sonra:

1. Google Görseller'i açın.
2. Bir görsel araması gerçekleştirin.
3. Mevcut görsel sonuçlarını taramak için **F1** tuşuna basın.
4. Tanınan görsel kapsayıcılarının üzerindeki kamera butonlarını bulun.
5. Orijinal görseli açmak için 📷 butonuna tıklayın.

Sonradan eklenen görsel sonuçları da betik tarafından otomatik olarak izlenir.

Ek bir yapılandırma gerekmez.

---

## ✨ Özellikler

### 1. Orijinal Görsellere Tek Tıkla Erişim

Temel özellik, kullanıcıların Google Görseller'deki orijinal görselleri doğrudan açmasını sağlar.

Kamera butonuna tıklandığında betik otomatik olarak:

1. İlişkili görsel bağlantısını belirler.
2. `imgurl` parametresini çıkarır.
3. Elde edilen URL'yi doğrular.
4. Orijinal görseli ayrı bir tarayıcı sekmesinde açar.

Betik, kullanıcıların Google'ın görsel önizleme arayüzünde manuel olarak gezinmesine gerek kalmadan orijinal görsele erişmesini sağlar.

### 2. F1 Klavye Kısayolu

Kullanıcı betiği, görsel taramasını etkinleştirmek için özel bir klavye kısayolu sunar.

**F1** tuşu `addButtons()` fonksiyonunu çalıştırır.

Etkinleştirildiğinde betik:

- `imgurl=` içeren görsel bağlantılarını bulur.
- Bağlantıların daha önce işlenip işlenmediğini kontrol eder.
- Orijinal görsel URL'lerini çıkarır.
- Çıkarılan URL'leri doğrular.
- İlişkili görsel kapsayıcılarını bulur.
- Kamera butonlarını oluşturur ve ekler.

Klavye kısayolu ayrıca tarayıcının varsayılan F1 yardım işlemini engeller.

**Klavye Olayı:**

```javascript
document.addEventListener('keydown', event => {
    if (
        event.key !== 'F1' ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
    ) {
        return;
    }

    event.preventDefault();

    const added = addButtons();

    showInfo();
});
```

### 3. Otomatik Dinamik İçerik Algılama

Google Görseller, tüm sayfayı yenilemeden ek görsel sonuçları ekleyebilen dinamik bir arayüz kullanır.

Kullanıcı betiği, bu değişiklikleri algılamak için JavaScript'in yerleşik `MutationObserver` API'sini kullanır.

Yeni içerik eklendiğinde gözlemci, `imgurl` parametresini içeren görsel bağlantılarını kontrol eder.

Yeni tanınan görsel bağlantıları otomatik olarak işlenir.

Bu sayede Google Görseller yeni sonuçlar yüklediğinde kullanıcıların her seferinde F1 tuşuna yeniden basması gerekmez.

### 4. MutationObserver Teknolojisi

Betik, belge içerisindeki değişiklikleri izlemek için `MutationObserver` kullanır.

Gözlemci yapılandırması:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

Bu yapılandırma şunları izler:

- Yeni eklenen öğeler.
- Yeni eklenen görsel bağlantıları.
- Dinamik olarak yüklenen görsel sonuçları.
- Ek görsel bağlantılarının oluşmasına neden olabilecek DOM değişiklikleri.

Gözlemci şu fonksiyon aracılığıyla başlatılır:

```javascript
startObserver();
```

Sürekli çalışan bir zamanlayıcıya ihtiyaç duymadan yeni görsel içeriklerini algılamak üzere tasarlanmıştır.

### 5. Orijinal Görsel URL'sinin Çıkarılması

Kullanıcı betiği, Google Görseller bağlantılarından orijinal görsel URL'lerini çıkarır.

Aşağıdaki bağlantıları belirler:

```javascript
a[href*="imgurl="]
```

Yalnızca HTTP veya HTTPS protokolüne sahip, başarıyla çıkarılmış ve doğrulanmış görsel URL'leri buton ekleme işlemine uygun kabul edilir.

Çıkarma işlemi:

```javascript
function getImageUrl(link) {
    try {
        const url = new URL(link.href);
        const imageUrl = url.searchParams.get('imgurl');

        if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
            return null;
        }

        if (imageUrl.includes('gstatic.com')) {
            return null;
        }

        return imageUrl;

    } catch {
        return null;
    }
}
```

Bu yöntem çeşitli avantajlar sağlar:

- Yerleşik URL ayrıştırmasını kullanır.
- URL parametrelerinin kodunu otomatik olarak çözer.
- HTTP ve HTTPS adreslerini doğrular.
- Boş veya geçersiz görsel URL'lerini yok sayar.
- `gstatic.com` içeren URL'leri hariç tutar.
- Hatalı URL'lerin tarama işlemini kesintiye uğratmasını önler.

### 6. Görsel Kapsayıcısının Belirlenmesi

Geçerli bir görsel URL'si belirlendikten sonra betik, ilgili görsel kapsayıcısını bulmaya çalışır.

Bunun için şu kod kullanılır:

```javascript
function getContainer(link) {
    return link.closest('[jsname], [data-attrid]');
}
```

Bulunan kapsayıcı, kamera butonunun ekleneceği alan olarak kullanılır.

Buton eklenmeden önce kapsayıcının konumlandırma özelliği kontrol edilir:

```javascript
if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
}
```

Bu işlem, butonun seçilen kapsayıcı içerisinde mutlak konumlandırma kullanmasını sağlar.

### 7. Yinelenen Butonların Önlenmesi

Kullanıcı betiği, aynı bağlantının tekrar tekrar işlenmesini önleyen bir mekanizma içerir.

İşlenen her bağlantıya özel bir dataset niteliği eklenir:

```javascript
link.dataset.googleViewProcessed = '1';
```

Bir bağlantıyı yeniden işlemeden önce betik şu kontrolü gerçekleştirir:

```javascript
if (link.dataset.googleViewProcessed === '1') {
    return;
}
```

Ayrıca seçilen kapsayıcının içerisinde zaten bir Google View butonu bulunup bulunmadığı da kontrol edilir.

```javascript
if (!container || container.querySelector(`.${BUTTON_CLASS}`)) {
    return;
}
```

Bu işlem, tekrarlanan taramalar ve dinamik DOM güncellemeleri sırasında gereksiz buton oluşturulmasını azaltır.

### 8. Kompakt Kamera Butonu

Betik, tanınan her görsel kapsayıcısı için küçük bir kamera butonu oluşturur.

Buton şu şekilde oluşturulur:

```javascript
const button = document.createElement('button');

button.type = 'button';
button.className = BUTTON_CLASS;
button.textContent = '📷';
button.title = 'Resmi Görüntüle';
```

Temel amacı, orijinal görsele doğrudan erişim sağlamaktır.

### 9. Görsel Entegrasyon

Kamera butonu, Google Görseller'in mevcut arayüzüne doğal biçimde uyum sağlaması için kompakt bir tasarım kullanır.

Görsel özellikleri:

- Kamera emojisi simgesi.
- Yarı saydam siyah arka plan.
- Beyaz simge.
- Yuvarlatılmış köşeler.
- Kompakt iç boşluklar.
- Mutlak konumlandırma.
- Yüksek katman sırası.
- Yumuşak üzerine gelme geçişi.
- Üzerine gelindiğinde koyulaşan arka plan.

Butonun stilleri özel bir CSS sınıfı üzerinden yönetilir.

```css
.google-view-btn {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 3px 7px;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
    transition: background 0.2s;
}
```

Üzerine gelme durumu arka planı değiştirir:

```css
.google-view-btn:hover {
    background: rgba(0, 0, 0, 0.95);
}
```

### 10. Tıklama Olaylarının Yönetimi

Kamera butonu, kendisine özel bir tıklama olay dinleyicisi kullanır.

```javascript
button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    window.open(imageUrl, '_blank', 'noopener,noreferrer');
});
```

Olay yönetimi, tıklamanın üst kapsayıcıdaki görsel bağlantısının normal gezinme işlemini tetiklemesini önler.

Orijinal görsel ayrı bir tarayıcı sekmesinde açılır.

### 11. F1 Bilgilendirme Mesajı

Kullanıcı betiği, sayfanın sağ alt köşesinde geçici bir bilgilendirme mesajı gösterir.

Bu mesaj, kullanıcılara görsel butonlarını eklemek için F1 tuşuna basabileceklerini bildirir.

Mesajın içeriği:

```text
⌨️ F1 tuşuna bas → Görsel butonlarını ekle
```

Bilgilendirme mesajı:

- Kullanıcı betiği başlatıldığında görünür.
- Kompakt mavi bir arayüz kullanır.
- Tıklanarak kapatılabilir.
- Sekiz saniye sonra otomatik olarak kaybolur.
- Aynı mesajın birden fazla kopyasının aynı anda gösterilmesini önler.

Bilgilendirme öğesi şu tanımlayıcıyı kullanır:

```javascript
const INFO_ID = 'google-view-info';
```

### 12. Hafif Mimari

Kullanıcı betiği, harici JavaScript kütüphaneleri olmadan çalışacak şekilde tasarlanmıştır.

Aşağıdaki işlemler için tarayıcının yerleşik özelliklerini kullanır:

- DOM seçimi.
- URL ayrıştırma.
- Olay yönetimi.
- Dinamik içerik izleme.
- CSS ekleme.
- Yeni tarayıcı sekmeleri açma.
- Geçici arayüz mesajları gösterme.

Bu yaklaşım, uygulamanın nispeten küçük kalmasını ve gereksiz bağımlılıklardan kaçınmasını sağlar.

---

## ⚙️ Teknik Mimari

### Çalışma Ortamı

Proje JavaScript ile yazılmıştır ve Tampermonkey aracılığıyla doğrudan Google Görseller içerisinde çalışır.

Kullanıcı betiği, mevcut Google Görseller belgesiyle etkileşime girer ve kendi arayüz öğelerini ekler.

### Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|---|---|
| JavaScript | Temel işlevler ve uygulama mantığı |
| Tampermonkey | Kullanıcı betiğinin yüklenmesi ve çalıştırılması |
| DOM API | Google Görseller öğelerine erişme ve bunları düzenleme |
| MutationObserver | Dinamik olarak eklenen içerikleri algılama |
| URL API | Görsel bağlantılarının ayrıştırılması |
| URLSearchParams | Orijinal görsel URL'sinin çıkarılması |
| CSS | Kamera butonlarının ve bilgilendirme mesajlarının stillendirilmesi |
| EventListener | Klavye ve fare etkileşimlerinin yönetilmesi |
| dataset | İşlenmiş görsel bağlantılarının takibi |
| setTimeout | Geçici bilgilendirme mesajlarının kaldırılması |
| window.open | Orijinal görselleri yeni sekmelerde açma |
| querySelectorAll | Görsel sonuç bağlantılarını bulma |
| getComputedStyle | Görsel kapsayıcısının konumlandırmasını kontrol etme |

### Kullanıcı Betiği Yapılandırması

Betik şu yapılandırmayı kullanır:

```javascript
// @run-at       document-end
// @grant        none
```

`document-end`, kullanıcı betiğinin belge ayrıştırıldıktan sonra çalışmasını sağlar.

`@grant none`, mevcut uygulamanın Tampermonkey'e özel ayrıcalıklı API'lere ihtiyaç duymadığı anlamına gelir.

### URL Eşleştirme

Mevcut kullanıcı betiği aşağıdaki URL kalıplarını içerir:

```javascript
// @match        https://www.google.com.tr/search?*tbm=isch*
// @match        https://www.google.com.tr/search?*udm=2*
// @match        https://www.google.com/search?*tbm=isch*
// @match        https://www.google.com/search?*udm=2*
```

Bu kurallar, `tbm=isch` ve `udm=2` parametrelerini kullanan Google Görseller aramaları için tasarlanmıştır.

**Uyumluluk notu:** Mevcut metadata yalnızca `.com` ve `.com.tr` Google alan adlarını açıkça hedefler. Ülkeye özel diğer Google alan adları için ek eşleştirme kuralları veya daha geniş bir URL eşleştirme yapılandırması gerekir.

### Görsel Bağlantılarının Algılanması

Betik, orijinal görsel URL parametresini içeren bağlantıları arar:

```javascript
document.querySelectorAll('a[href*="imgurl="]');
```

Yalnızca geçerli bir HTTP veya HTTPS görsel URL'si başarıyla çıkarılan bağlantılar buton ekleme işlemine alınır.

### URL İşleme

URL çıkarma mekanizması şu kodu kullanır:

```javascript
const url = new URL(link.href);
const imageUrl = url.searchParams.get('imgurl');
```

Bu yöntem, URL dizelerini manuel olarak bölme ve ayrıştırma ihtiyacını ortadan kaldırır.

### Görsel Kapsayıcısı Seçimi

Betik, aşağıdaki seçiciyi kullanarak olası görsel kapsayıcısını belirler:

```javascript
link.closest('[jsname], [data-attrid]');
```

Seçilen kapsayıcı, kamera butonunun konumlandırılacağı alan olarak kullanılır.

### DOM İzleme

Gözlemci şu yapılandırmayı kullanır:

```javascript
new MutationObserver(() => {
    if (document.querySelector('a[href*="imgurl="]')) {
        addButtons();
    }
});
```

Gözlemci şu özellikleri izler:

```javascript
{
    childList: true,
    subtree: true
}
```

Bu sayede DOM'a yeni öğeler eklendiğinde betik bunlara tepki verebilir.

### Buton Tanımlama

Betik, kendine özel bir CSS sınıfı kullanır:

```javascript
google-view-btn
```

İşlenmiş bağlantıları takip etmek için kullanılan nitelik:

```javascript
data-google-view-processed="1"
```

Bu tanımlayıcılar, buton ekleme işleminin yönetilmesine ve tekrar eden işlemlerin önlenmesine yardımcı olur.

### Çalıştırma Yönetimi

Betik, dahili çalışma durumunu şu değişkenlerle yönetir:

```javascript
let totalAdded = 0;
let observer = null;
```

- `totalAdded`, mevcut sayfa oturumu boyunca başarıyla eklenen toplam buton sayısını takip eder.
- `observer`, etkin MutationObserver örneğini saklar.

Gözlemci yalnızca bir kez başlatılır.

---

## 🔄 Güncelleme Sistemi

Proje, yükleme ve otomatik güncelleme kontrolleri için tek bir kullanıcı betiği dosyası kullanır.

**Güncelleme URL'si:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

**İndirme URL'si:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

Kullanıcı betiği aşağıdaki güncelleme metadata bilgilerini içerir:

```javascript
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

Yeni bir sürüm yayınlandığında:

1. Kullanıcı betiğinin kaynak kodu güncellenir.
2. Metadata içerisindeki sürüm numarası artırılır.
3. Tampermonkey daha yeni sürümü algılayabilir.
4. Kullanıcılar güncellemeyi Tampermonkey üzerinden yükleyebilir.

**Mevcut Sürüm:**

```javascript
// @version      1.1
```

En son kaynak kodu ve proje güncellemeleri için:

[GitHub Deposu](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)

---

## 🔐 Gizlilik ve Güvenlik

Gizlilik, bu projede önemli bir konudur.

**efem360 Google Görseller Hızlı Görüntüleyici**, görsel bağlantılarının algılanması, URL çıkarma ve buton oluşturma işlemlerini kullanıcının tarayıcısında yerel olarak gerçekleştirecek şekilde tasarlanmıştır.

### Gizlilik İlkeleri

- Kullanıcı hesabı sistemi yoktur.
- Kayıt olma gerektirmez.
- Kullanıcı betiği tarafından uygulanmış analiz veya takip sistemi yoktur.
- Harici API entegrasyonu yoktur.
- Uzak veritabanı yoktur.
- Bağımsız bir görsel toplama hizmeti yoktur.
- Çıkarılan görsel URL'leri kullanıcı betiği tarafından üçüncü taraf bir sunucuya gönderilmez.
- Ayrı bir arka plan hizmeti yoktur.
- Ek Tampermonkey izinleri gerektirmez.

### Veri İşleme

Betik, mevcut Google Görseller bağlantılarından görselle ilgili URL'leri okur.

Bu URL'ler, doğrudan görsel açma butonlarını oluşturmak için kullanılır.

Betik, amaçlanan işlemleri gerçekleştirmek için görsel dosyalarının içeriğine erişmek zorunda değildir.

### Harici İletişim

Kullanıcı betiği harici bir görsel arama API'si kullanmaz.

Çıkarılan görsel URL'lerini harici bir sunucuya yüklemez.

Kullanıcı bir kamera butonuna tıkladığında tarayıcı ilgili görsel URL'sini açar.

Hedef görsel sunucusu, bunun sonucunda oluşan tarayıcı isteğini alır.

### İzinler

Kullanıcı betiği metadata bilgisi şunu içerir:

```javascript
// @grant        none
```

Mevcut uygulama, ayrıcalıklı Tampermonkey fonksiyonları yerine tarayıcının yerleşik API'lerini kullanır.

---

## ⚠️ Uyumluluk ve Sınırlamalar

Betik öncelikli olarak Google Görseller ve mevcut görsel sonuç bağlantılarının yapısı için tasarlanmıştır.

### Desteklenen Ortam

- `www.google.com` üzerindeki Google Görseller.
- `www.google.com.tr` üzerindeki Google Görseller.
- `tbm=isch` parametresini kullanan görsel aramaları.
- `udm=2` parametresini kullanan görsel aramaları.
- Tampermonkey uyumlu masaüstü tarayıcıları.
- Geçerli bir `imgurl` parametresi içeren görsel bağlantıları.
- Dinamik olarak eklenen görsel sonuçları.

### Sınırlamalar

- Google arayüzündeki güncellemeler DOM yapısını değiştirebilir.
- Görsel URL parametrelerindeki değişiklikler uyumluluk güncellemeleri gerektirebilir.
- `imgurl` parametresi bulunmayan görsel sonuçları yok sayılır.
- `gstatic.com` içeren URL'ler hariç tutulur.
- Tanınan seçicilerle eşleşmeyen görsel kapsayıcılarına buton eklenmez.
- Bazı görsel bağlantıları doğrudan erişilebilen orijinal görsel URL'sini sunmayabilir.
- Tarayıcının açılır pencere koruması yeni sekmenin açılmasını engelleyebilir.
- Betik görselleri otomatik olarak indirmez.
- Betik orijinal görsel dosyalarını değiştirmez.
- Betik görsel barındırma kısıtlamalarını aşmaz.
- Mevcut metadata tüm ülkelere özel Google alan adlarını kapsamaz.

Betik, kamera butonları ekleyerek tarayıcının görüntülenen arayüzünü değiştirir. Google'ın sakladığı görsel verilerini veya orijinal görsel içeriğini değiştirmez.

---

## 📋 Sürüm Geçmişi

| Sürüm | Değişiklikler |
|---|---|
| 1.0 | F1 ile tetiklenen görsel butonu ekleme, görsel URL'si çıkarma, doğrudan görsel açma ve geçici bilgilendirme mesajı özelliklerini içeren ilk sürüm |
| 1.1 | URL ve URLSearchParams ile geliştirilmiş URL ayrıştırma, dataset tabanlı yinelenen işlem önleme, MutationObserver desteği, yenilenmiş buton stilleri, sadeleştirilmiş bildirim yönetimi ve gereksiz Tampermonkey izinlerinin kaldırılması |

---

## 🤝 Katkıda Bulunma

Öneriler, hata bildirimleri ve geliştirmeler memnuniyetle karşılanır.

Bir sorunla karşılaşırsanız:

1. Sorunun tekrarlanabilir olup olmadığını kontrol edin.
2. Tarayıcınızın adını ve sürümünü belirtin.
3. Tampermonkey sürümünüzü belirtin.
4. Hangi Google alan adını kullandığınızı belirtin.
5. Kamera butonunun görünmediğini mi yoksa görselin açılmadığını mı açıklayın.
6. Beklenen davranışı belirtin.
7. GitHub üzerinden bir Issue açın.

Uyumluluğu, performansı, güvenilirliği ve kullanılabilirliği geliştiren katkılar memnuniyetle karşılanır.

**GitHub Sorun Bildirimleri:**

https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button/issues

---

# 📄 Lisans

Bu proje **GNU Genel Kamu Lisansı v3.0 (GPL-3.0)** kapsamında lisanslanmıştır.

GNU GPL-3.0 lisansı; kaynak kodunun açık tutulması, yapılan değişikliklerin belirtilmesi ve türetilmiş çalışmaların da aynı lisans altında dağıtılması koşuluyla yazılımın özgürce kullanılmasına, incelenmesine, değiştirilmesine ve dağıtılmasına izin verir.

Detaylı bilgi için proje deposundaki `LICENSE` dosyasına göz atabilirsiniz.

---

<div align="center">

## ✦ efem360

**Küçük İyileştirmeler. Daha İyi Deneyimler.**

Geliştiren: **Kemal Kalender**

[GitHub](https://github.com/efem360) · [Google Görseller Hızlı Görüntüleyici](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)

<br>

*Günlük tarayıcı deneyimlerini daha basit, daha temiz ve daha verimli hâle getiriyoruz.*

</div>
