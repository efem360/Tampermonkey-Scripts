 <div align="center">

# ✦ efem360 Gmail Geçmişi Arama

### Gmail Konuşma Geçmişi İçin Tek Tıkla Arama

**Gmail konuşma geçmişinde arama yapmayı daha hızlı ve kolay hâle getiren, hafif ve kapsamlı özelliklere sahip bir Tampermonkey userscript'i.**

Bir e-posta adresiyle ilişkili tüm e-postaları doğrudan Gmail üzerinden bulun. E-posta adreslerini manuel olarak kopyalamaya veya arama sorguları yazmaya gerek kalmadan gelen, giden ya da tüm konuşmaları tek tıkla arayın.

İster bir e-posta konuşmasını görüntülüyor, ister gönderen bilgilerini kontrol ediyor, ister Gmail'deki e-posta adresleri üzerinde çalışıyor olun; bu script, tanınan e-posta adreslerinin hemen yanına kullanışlı bir arama kısayolu ekler.

<br>

[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-4.2.1-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Search-Gmail-History/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)

<br>

[⚡ Tek Tıkla Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js) · [GitHub Deposu](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History) · [Hata Bildirimleri](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History/issues)

<br>

**Tüm Konuşmaları Bulun. Tek Tıkla.**

</div>

---

## Genel Bakış

**efem360 Gmail Geçmişi Arama**, belirli e-posta adresleriyle ilişkili Gmail konuşmalarında arama yapmayı kolaylaştırmak için tasarlanmış hafif bir tarayıcı userscript'idir.

Gmail zaten güçlü arama özellikleri sunar. Ancak bir e-posta adresini manuel olarak aramak, özellikle uzun konuşmalarla veya birden fazla kişiyle çalışırken tekrarlayan bir işlem hâline gelebilir.

Bu userscript, tanınan e-posta adreslerinin yanına küçük bir Gmail tarzı arama simgesi ekler.

Bu simge sayesinde kullanıcılar anında şu aramaları gerçekleştirebilir:

- Bir adresle ilişkili tüm e-postaları arama.
- Belirli bir adresten alınan mesajları arama.
- Belirli bir adrese gönderilen mesajları arama.
- E-posta aramalarını ayrı bir tarayıcı sekmesinde açma.

Ayrıca sağ tık menüsü üzerinden e-posta adreslerini kopyalamak ve farklı arama seçeneklerine erişmek için kullanışlı seçenekler sunar.

Script arka planda otomatik olarak çalışır ve doğrudan Gmail'in mevcut arayüzüne entegre olur.

### Öne Çıkan Özellikler

- **Tek Tıkla E-posta Arama:** Bir e-posta adresiyle ilişkili tüm konuşmaları arayın.
- **Gelen E-posta Araması:** Belirli bir adresten gelen mesajları bulun.
- **Giden E-posta Araması:** Belirli bir adrese gönderilen mesajları bulun.
- **Yeni Sekmede Arama:** E-posta aramalarını ayrı bir sekmede açın.
- **Bağlam Menüsü:** Sağ tıklayarak ek arama ve panoya kopyalama seçeneklerine erişin.
- **Hızlı E-posta Kopyalama:** Metni manuel olarak seçmeden e-posta adreslerini kopyalayın.
- **Klavye Erişilebilirliği:** Enter veya Space tuşlarıyla arama simgesini etkinleştirin.
- **Dinamik İçerik Algılama:** Yeni eklenen e-posta adreslerini otomatik olarak algılar.
- **MutationObserver Teknolojisi:** Gmail'in ilgili DOM değişikliklerini izler.
- **Yinelenen Simge Önleme:** Aynı e-posta öğesi için birden fazla arama simgesi eklenmesini önler.
- **Hafif Mimari:** Filtrelenmiş DOM izleme ve zamanlanmış tarama kullanır.
- **Yerel Gmail Entegrasyonu:** Ayrı bir uygulama arayüzü oluşturmadan kompakt arama simgeleri ekler.

---

## 📌 Proje Hakkında

Bu projenin temel amacı, Gmail e-posta geçmişi aramalarını daha erişilebilir ve verimli hâle getirmektir.

Birden fazla kişiyle iletişim kurarken belirli bir gönderici veya alıcıyla yapılan önceki tüm yazışmaları bulmak için genellikle e-posta adresini manuel olarak kopyalamak ve Gmail'in arama alanına girmek gerekir.

Bu userscript, söz konusu tekrarlayan adımları ortadan kaldırır.

Yüklendikten sonra tanınan e-posta adreslerinin hemen yanında küçük, tıklanabilir bir arama simgesi görünür.

### Nasıl Çalışır?

Örneğin, bir e-posta konuşmasını görüntülerken Gmail, gönderenin e-posta bilgilerini gösterir.

Script, e-posta adresini algılar ve ilgili öğenin hemen önüne bir arama simgesi ekler.

<details>
<summary><strong>Arama Simgesi Etkileşimleri</strong></summary>

| İşlem | Sonuç |
|---|---|
| Sol Tıklama | Tüm e-postaları ara |
| Ctrl + Sol Tıklama | Yeni sekmede ara |
| Cmd + Sol Tıklama | Yeni sekmede ara (macOS) |
| Sağ Tıklama | Arama seçeneklerini aç |
| Enter | Tüm e-postaları ara |
| Space | Tüm e-postaları ara |

</details>

### Temel Hedefler

- E-posta konuşmalarını aramak için gereken süreyi azaltmak.
- Gelen ve giden e-posta aramalarına anında erişim sağlamak.
- E-posta adreslerini tekrar tekrar manuel olarak kopyalama ihtiyacını ortadan kaldırmak.
- Arama işlevini doğrudan Gmail içerisinde erişilebilir hâle getirmek.
- Dinamik olarak yüklenen e-posta içeriklerini desteklemek.
- Gmail'in mevcut arayüzünü ve normal gezinme işleyişini korumak.
- Yinelenen arama simgelerini önlemek.
- Gereksiz DOM işlemlerini en aza indirmek.
- Kullanışlı klavye ve fare etkileşimleri sunmak.

---

## 🚀 Kurulum

### Gereksinimler

Aşağıdakiler gereklidir:

- Desteklenen bir masaüstü tarayıcı.
- Tampermonkey tarayıcı eklentisi.
- Aktif bir Gmail hesabı.

### 1. Tampermonkey'i Yükleyin

Tarayıcınız için Tampermonkey eklentisini yükleyin.

**Resmî Web Sitesi:**

https://www.tampermonkey.net/

### 2. Userscript'i Yükleyin

Aşağıdaki yükleme bağlantısını açın:

**[efem360 Gmail Geçmişi Arama'yı Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js)**

Tampermonkey otomatik olarak userscript yükleme ekranını açacaktır.

Kurulumu tamamlamak için **Install** düğmesine tıklayın.

### 3. Kullanıma Başlama

Kurulumdan sonra:

1. Gmail'i açın.
2. Sayfayı yenileyin.
3. Bir e-posta konuşmasını açın veya tanınan e-posta adreslerinin bulunduğu bir bölüme gidin.
4. E-posta adreslerinin yanındaki küçük arama simgesini bulun.
5. İlgili e-posta geçmişini aramak için simgeye tıklayın.

Ek bir yapılandırma veya manuel etkinleştirme gerekmez.

---

## ✨ Özellikler

### 1. Tek Tıkla E-posta Geçmişi Arama

Temel özellik, kullanıcıların belirli bir e-posta adresiyle ilişkili tüm Gmail konuşmalarını aramasını sağlar.

Arama simgesine tıklandığında script otomatik olarak:

1. İlgili e-posta adresini belirler.
2. Gmail'in arama alanını bulur.
3. E-posta adresini arama alanına yerleştirir.
4. Uygun input olayını tetikler.
5. Enter tuşunu temsil eden bir klavye olayıyla aramayı başlatır.

**Örnek Gmail Arama Sorgusu:**

```text
example@gmail.com
```

Bu işlem, belirtilen e-posta adresiyle ilişkili mesajları Gmail'de arar.

Script ayrıca aynı sorgu zaten etkin durumdaysa gereksiz yere aynı aramanın tekrar yapılmasını önler.

### 2. Gelen E-posta Araması

Kullanıcılar belirli bir e-posta adresinden alınan mesajları arayabilir.

Bağlam menüsü, gelen e-postalar için özel bir arama seçeneği sunar.

**Oluşturulan Gmail Arama Sorgusu:**

```text
from:example@gmail.com
```

Bu işlem Gmail'in yerleşik `from:` arama operatörünü kullanır.

Belirli bir kişi tarafından gönderilen mesajları bulmak için özellikle kullanışlıdır.

### 3. Giden E-posta Araması

Kullanıcılar belirli bir e-posta adresine gönderdikleri mesajları arayabilir.

**Oluşturulan Gmail Arama Sorgusu:**

```text
to:example@gmail.com
```

Bu işlem Gmail'in yerleşik `to:` arama operatörünü kullanır.

Belirli bir alıcıya daha önce gönderilmiş mesajları bulmayı kolaylaştırır.

### 4. Yeni Sekmede Arama

Userscript, e-posta aramalarını ayrı bir tarayıcı sekmesinde açmayı destekler.

Bu işlevi kullanmanın iki yolu vardır:

- Arama simgesine Ctrl + Sol Tıklama.
- Simgeye sağ tıklayıp yeni sekmede arama seçeneğini belirleme.

macOS sistemlerinde Cmd + Sol Tıklama da desteklenir.

Script, sayfa URL'sinden o anda seçili olan Gmail hesap numarasını belirler.

Hesap numarası belirlenemezse `0` hesabını kullanır.

**Örnek URL:**

```text
https://mail.google.com/mail/u/0/#search/example%40gmail.com
```

Bu özellik, kullanıcıların mevcut Gmail sekmesinde çalışmaya devam ederken aramayı ayrı bir sekmede açmasını sağlar.

**Önemli:** Tarayıcının açılır pencere koruması yeni sekmenin açılmasını engelleyebilir.

### 5. Sağ Tık Bağlam Menüsü

Arama simgesi, beş farklı işleme erişim sağlayan ek bir bağlam menüsüne sahiptir.

Mevcut seçenekleri görüntülemek için simgeye sağ tıklayın.

**Kullanılabilir Seçenekler:**

| Seçenek | İşlem |
|---|---|
| 1 | Tüm e-postaları ara |
| 2 | Gelen e-postaları ara |
| 3 | Giden e-postaları ara |
| 4 | Yeni sekmede ara |
| 5 | E-posta adresini kopyala |

Menü, ilgili e-posta adresini görüntüler ve kullanıcıların basit bir seçim penceresi üzerinden işlem belirlemesine olanak tanır.

Bu sayede ayrı arayüz düğmelerine ihtiyaç duymadan tüm temel işlevlere erişilebilir.

### 6. E-posta Adresi Kopyalama

Script, özel bir e-posta kopyalama işlevi içerir.

Kullanıcılar sağ tık bağlam menüsündeki kopyalama seçeneğini kullanarak e-posta adreslerini doğrudan kopyalayabilir.

Kopyalama mekanizması iki yöntemi destekler:

**Birincil Yöntem:**

Modern Clipboard API kullanılır:

```javascript
navigator.clipboard.writeText(email)
```

**Yedek Yöntem:**

Clipboard API kullanılamadığında veya kopyalama başarısız olduğunda script şu yöntemi kullanmayı dener:

```javascript
document.execCommand('copy')
```

Bu yedek yöntem, modern pano işlevinin kullanılamadığı ortamlarda uyumluluğu artırır.

İşlemin başarılı olup olmadığı hakkında kullanıcıya bildirim gösterilir.

### 7. Otomatik E-posta Algılama

Script, Gmail içerisindeki e-posta adreslerini otomatik olarak tanımlar.

Şu iki temel öğe türünü işler:

**Gmail Gönderen Öğeleri:**

```css
.gD
```

**E-posta Bağlantıları:**

```css
a[href^="mailto:"]
```

Gmail gönderen öğelerinde e-posta adresi `email` niteliğinden alınır.

Mailto bağlantılarında ise adres `href` niteliğinden çıkarılır.

Script, bir arama simgesi oluşturmadan önce elde edilen adresi doğrular.

Geçerli bir `@` karakteri içermeyen adresler işleme alınmaz.

### 8. Dinamik İçerik Algılama

Gmail, tüm sayfayı yenilemeden içerik yükleyen ve güncelleyen dinamik bir arayüz kullanır.

Userscript, ilgili değişiklikleri algılamak için JavaScript'in `MutationObserver` API'sini kullanır.

Bu sayede aşağıdaki içerikleri algılayabilir:

- Yeni yüklenen e-posta konuşmaları.
- Yeni eklenen gönderen öğeleri.
- Dinamik olarak eklenen mailto bağlantıları.
- İlgili e-posta niteliklerindeki değişiklikler.
- E-postayla ilgili DOM öğelerindeki güncellemeler.

Script, sürekli çalışan bir tarama aralığına bağımlı değildir.

Bunun yerine yalnızca ilgili DOM değişiklikleri algılandığında yeni bir tarama planlar.

### 9. Yinelenen Simge Önleme

Userscript, özel bir yinelenen öğe algılama mekanizması içerir.

Yeni bir arama simgesi eklemeden önce uygun bir simgenin zaten mevcut olup olmadığını kontrol eder.

Algılama işlemi şu noktaları inceler:

- Önceki kardeş öğe.
- Aynı üst öğe içerisindeki diğer alt öğeler.
- Simgenin `data-email` niteliğinde saklanan ilişkili e-posta adresi.

Bu mekanizma, Gmail mevcut içeriği güncellediğinde veya yeniden oluşturduğunda gereksiz yinelenen simgelerin eklenmesini önlemeye yardımcı olur.

### 10. Akıllı DOM İzleme

Gmail'deki her DOM değişikliği yeni bir tam tarama gerektirmez.

Userscript, izlenen değişiklikleri filtreler ve yalnızca ilgili e-posta öğeleri algılandığında işlem yapılmasını planlar.

Tarama mekanizması, birden fazla DOM değişikliğini birleştirmek için 80 milisaniyelik zamanlanmış bir gecikme kullanır.

Bu yaklaşım, arayüz hızlı şekilde güncellenirken gereksiz tekrarlanan işlemleri azaltır.

### 11. Tarayıcı Sekmesi Görünürlük Yönetimi

Userscript, Gmail sekmesinin o anda görünür olup olmadığını da dikkate alır.

Tarayıcı sekmesi gizlendiğinde:

- Aktif MutationObserver bağlantısı kesilir.
- Bekleyen zamanlanmış taramalar temizlenir.

Sekme yeniden görünür olduğunda:

- DOM izleme yeniden başlatılır.
- Yeni bir tarama planlanır.

Bu yaklaşım, Gmail arka plan sekmesindeyken gereksiz DOM izlemesini önlemeye yardımcı olur.

### 12. Gmail Gezinme Algılama

Gmail, farklı sayfaların ve konuşmaların tam bir tarayıcı yenilemesi olmadan yüklenebildiği istemci taraflı gezinme yapısını kullanır.

Script, iki gezinme olayını dinler:

```javascript
popstate
```

```javascript
hashchange
```

Bu olaylardan biri gerçekleştiğinde userscript yeni bir tarama planlar.

Bu özellik, Gmail konuşmaları ve arama sonuçları arasında gezinirken arama simgelerinin kullanılabilir kalmasına yardımcı olur.

### 13. Klavye Erişilebilirliği

Arama simgesi, klavye ile gezinme ve kullanım için tasarlanmıştır.

Aşağıdaki nitelikleri içerir:

```html
tabindex="0"
role="button"
```

Script ayrıca klavye olaylarını dinler.

| Tuş | İşlem |
|---|---|
| Enter | Tüm e-postaları ara |
| Space | Tüm e-postaları ara |

Bu özellik, fare kullanmadan arama işlevine erişilmesini sağlar.

### 14. Gmail Tarzı Görsel Entegrasyon

Arama simgesi, kompakt bir SVG zarf simgesi kullanır.

Görünümü, Gmail'in mevcut arayüzüne doğal biçimde uyum sağlayacak şekilde tasarlanmıştır.

Görsel özellikler:

- Kompakt 18 × 18 piksel SVG simgesi.
- Gmail tarzı nötr gri görünüm.
- Fare üzerine geldiğinde mavi renk efekti.
- Yumuşak fare üzerine gelme geçişi.
- Klavye odak göstergesi.
- E-posta adreslerinin yanında satır içi konumlandırma.

Simge ayrı bir araç çubuğu, kenar çubuğu veya uygulama paneli oluşturmaz.

### 15. Bildirim Sistemi

Userscript, önemli işlemlerden sonra kullanıcıya geri bildirim sağlamak için hafif bir bildirim mekanizması içerir.

Bildirimler şu durumlarda kullanılır:

- E-posta araması başlatıldığında.
- Yeni sekmede arama açıldığında.
- E-posta adresi başarıyla kopyalandığında.
- Pano hatası oluştuğunda.
- Gmail arama alanı bulunamadığında.
- Yeni sekme açılması engellendiğinde.

Bildirimler tarayıcı penceresinin sağ alt köşesinde görünür.

Yaklaşık iki saniye sonra otomatik olarak kaybolur.

---

## ⚙️ Teknik Mimari

### Çalışma Ortamı

Proje JavaScript ile yazılmıştır ve Tampermonkey aracılığıyla desteklenen Google hizmetlerinde doğrudan çalışır.

Userscript, Gmail'in dinamik belge yapısıyla çalışacak şekilde tasarlanmıştır.

### Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|---|---|
| JavaScript | Temel işlevler ve uygulama mantığı |
| Tampermonkey | Userscript kurulumu ve çalıştırılması |
| DOM API | Gmail öğelerine erişim ve düzenleme |
| MutationObserver | Dinamik DOM değişikliklerini algılama |
| SVG | E-posta arama simgesini görüntüleme |
| Clipboard API | E-posta adreslerini kopyalama |
| KeyboardEvent | Gmail aramalarını tetikleme |
| Regular Expressions | Gmail hesap bilgilerini ayrıştırma |
| CSS | Arama simgeleri ve bildirimlerin biçimlendirilmesi |
| setTimeout | DOM taramalarını ve geçici bildirimleri zamanlama |
| Browser Events | Gezinme ve sekme görünürlüğü değişikliklerini algılama |

### Userscript Yapılandırması

Script şu yapılandırmayla çalışır:

```javascript
// @run-at       document-idle
```

Bu sayede ilk çalıştırma başlamadan önce tarayıcı belgesinin kullanılabilir hâle gelmesi sağlanır.

Script aşağıdaki URL kalıplarını destekler:

```javascript
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/*
// @match        *://gmail.com/*
```

Ayrıca aşağıdaki adresleri kapsam dışında bırakır:

```javascript
// @exclude      *://mail.google.com/mail/*/blank
// @exclude      *://mail.google.com/mail/*/help
```

### DOM İzleme

Script, ilgili belge değişikliklerini izlemek için `MutationObserver` kullanır.

Gözlemci yapılandırması şu şekildedir:

```javascript
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
```

Bu yapılandırma, userscript'in yeni eklenen öğeleri ve e-posta tanımlamasıyla ilgili nitelik değişikliklerini algılamasını sağlar.

### Mutation Filtreleme

Script, her mutasyondan sonra belgenin tamamını otomatik olarak taramaz.

Bunun yerine değişikliklerin ilgili e-posta öğeleriyle bağlantılı olup olmadığını kontrol eder.

Algılama hedefleri:

```css
.gD
a[href^="mailto:"]
```

Yalnızca ilgili değişiklikler zamanlanmış bir taramayı tetikler.

### DOM Tarama Stratejisi

Tarama işlemi şu adımları izler:

1. Userscript'in aktif olup olmadığını kontrol et.
2. Tarayıcı sekmesinin görünür olup olmadığını kontrol et.
3. Gmail gönderen öğelerini bul.
4. Bir arama simgesinin zaten mevcut olup olmadığını kontrol et.
5. E-posta adresini çıkar ve doğrula.
6. Arama simgesini oluştur.
7. Simgeyi ilgili öğenin önüne ekle.
8. Mailto bağlantılarını bul.
9. Düzenlenebilir içerik alanlarının içerisindeki bağlantıları hariç tut.
10. Mailto adreslerini çıkar ve doğrula.
11. İlgili arama simgelerini ekle.

### Tarama Zamanlama Mekanizması

Script, zamanlanmış tarama mekanizması kullanır:

```javascript
setTimeout(function () {
    scanTimeout = null;
    insertEmailSearchIcons();
}, 80);
```

Zamanlanmış tarama çalışmadan önce başka bir ilgili mutasyon gerçekleşirse önceki zamanlayıcı temizlenir ve yeniden planlanır.

Bu sayede kısa süre içerisinde gereksiz birden fazla tarama yapılması önlenir.

### Arama İşleme

Arama mekanizması Gmail'in mevcut arama alanını kullanır:

```javascript
document.querySelector('input[name="q"]')
```

Arama alanı belirlendikten sonra script alanın değerini günceller ve bir input olayı tetikler.

Ardından Enter tuşunu temsil eden bir klavye olayı oluşturur.

Bu sayede ayrı bir e-posta arama motoru geliştirmek yerine Gmail'in yerel arama işlevinden yararlanılır.

### E-posta Arama Operatörleri

Userscript üç farklı arama modunu destekler:

| Arama Modu | Gmail Sorgusu |
|---|---|
| Tümü | `email@example.com` |
| Gelen | `from:email@example.com` |
| Giden | `to:email@example.com` |

### Yinelenen Öğelerin Algılanması

Yeni bir arama simgesi eklenmeden önce mevcut DOM yapısı kontrol edilir.

Simge aşağıdaki sınıfı kullanır:

```css
.email_search_icon
```

İlişkili e-posta adresi ayrıca şu nitelik aracılığıyla saklanır:

```html
data-email="email@example.com"
```

Bu yapı, daha önce eklenmiş simgelerin belirlenmesini sağlar.

### Çalıştırma Yönetimi

Script, dahili çalışma durumunu aşağıdaki değişkenler aracılığıyla yönetir:

```javascript
let isSearching = false;
let observer = null;
let scanTimeout = null;
let isActive = false;
```

Bu değişkenler arama işlemlerinin, DOM gözlemcisinin, zamanlanmış taramaların ve script etkinleştirme durumunun yönetilmesine yardımcı olur.

---

## 🔄 Güncelleme Sistemi

Proje, kurulum ve otomatik güncelleme kontrolleri için tek bir userscript dosyası kullanır.

**Güncelleme URL'si:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

**İndirme URL'si:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

Userscript aşağıdaki güncelleme meta verilerini içerir:

```javascript
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

Yeni bir sürüm yayınlandığında:

1. Userscript kaynak kodu güncellenir.
2. Meta verilerindeki sürüm numarası artırılır.
3. Tampermonkey yeni sürümü algılayabilir.
4. Kullanıcılar güncellemeyi Tampermonkey üzerinden yükleyebilir.

**Mevcut Sürüm:**

```javascript
// @version      4.2.1
```

En güncel kaynak kodu ve proje güncellemeleri için:

[GitHub Deposu](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)

---

## 🔐 Gizlilik ve Güvenlik

Gizlilik, bu projede önemli bir tasarım unsurudur.

**efem360 Gmail Geçmişi Arama**, e-posta adreslerinin algılanmasını ve arama hazırlığını kullanıcının tarayıcısında yerel olarak gerçekleştirmek üzere tasarlanmıştır.

### Gizlilik İlkeleri

- Kullanıcı hesabı sistemi yoktur.
- Kayıt gerektirmez.
- Userscript tarafından uygulanmış analiz veya takip sistemi yoktur.
- Harici API entegrasyonu yoktur.
- Uzak veritabanı yoktur.
- Bağımsız bir e-posta toplama hizmeti yoktur.
- Userscript tarafından çıkarılan e-posta adresleri üçüncü taraf bir sunucuya gönderilmez.
- Ayrı bir arka plan hizmeti yoktur.

### Veri İşleme

Script, e-posta adreslerini mevcut Gmail DOM öğelerinden okur.

Bu adresler, kullanıcı arama işlevini etkinleştirdiğinde Gmail arama sorguları oluşturmak için kullanılır.

Script, amaçlanan arama işlemlerini gerçekleştirmek için e-posta mesajlarının gövdelerini veya eklerini okuma ihtiyacı duymaz.

### Pano Erişimi

E-posta kopyalama işlemi, kullanıcının kopyalama seçeneğini açıkça seçmesiyle başlatılır.

Script, kullanılabilir olduğunda tarayıcının Clipboard API'sini kullanır ve gerektiğinde eski bir yedek yöntemi dener.

### Harici İletişim

Userscript herhangi bir harici e-posta arama API'si kullanmaz.

Arama işlemleri Gmail'in mevcut arayüzü üzerinden gerçekleştirilir.

Oluşturulan arama isteğini Gmail'in kendisi işler.

### İzinler

Userscript meta verileri aşağıdaki tanımı içerir:

```javascript
// @grant        GM_addStyle
```

Mevcut uygulama, stillerini Tampermonkey `GM_addStyle` fonksiyonunu çağırmak yerine yerel DOM API'si üzerinden oluşturur.

---

## ⚠️ Uyumluluk ve Sınırlamalar

Script öncelikli olarak Gmail'in web arayüzü ve mevcut DOM yapısı için tasarlanmıştır.

### Desteklenen Ortam

- Gmail Web.
- Tampermonkey ile uyumlu tarayıcılar.
- `.gD` seçicisini kullanan Gmail gönderen öğeleri.
- `mailto:` protokolünü kullanan e-posta bağlantıları.
- Dinamik olarak yüklenen Gmail içerikleri.
- Yerel Gmail arama alanı yapısını destekleyen arayüzler.

### Ek URL Eşleştirmeleri

Userscript ayrıca şu adresler için eşleştirme kuralları içerir:

- `contacts.google.com`
- `gmail.com`

Script, `https://contacts.google.com` adresinden gelen ve geçerli bir `searchForEmail=` değeri içeren mesajları dinleyen bir mesaj işleyicisi de içerir.

### Sınırlamalar

- Gmail arayüzündeki güncellemeler DOM yapısını değiştirebilir.
- Gmail'in arama alanında yapılacak değişiklikler uyumluluk güncellemeleri gerektirebilir.
- Tanınan seçicilerle eşleşmeyen e-posta öğelerine arama simgesi eklenmez.
- Bazı tarayıcı yapılandırmaları pano erişimini kısıtlayabilir.
- Açılır pencere engelleyicileri, aramaların yeni sekmede açılmasını önleyebilir.
- Script, Gmail'in yerel arama işlevine bağımlıdır.
- Userscript bağımsız olarak e-posta mesajlarını almaz veya arşivlemez.
- Arama sonuçları, Gmail'de o anda etkin olan hesabın izinlerine ve erişim yetkilerine tabidir.

Script, tarayıcıda görüntülenen arayüzü ve arama alanını değiştirir. Gmail'de saklanan mesajları veya bunların orijinal içeriklerini değiştirmez.

---

## 📋 Sürüm Geçmişi

| Sürüm | Değişiklikler |
|---|---|
| 4.2.1 | Tek tıkla e-posta geçmişi arama, gelen/giden arama modları, yeni sekmede arama, bağlam menüsü, pano desteği, klavye erişilebilirliği, yinelenen öğelerin önlenmesi ve filtrelenmiş MutationObserver izleme özelliklerini içeren mevcut uygulama |

---

## 🤝 Katkıda Bulunma

Öneriler, hata bildirimleri ve geliştirmeler memnuniyetle karşılanır.

Bir sorunla karşılaşırsanız:

1. Sorunun tekrarlanabilir olup olmadığını kontrol edin.
2. Tarayıcınızın adını ve sürümünü belirtin.
3. Tampermonkey sürümünüzü belirtin.
4. E-posta adresinin Gmail içerisinde nerede göründüğünü açıklayın.
5. Arama simgesinin görünmediğini mi yoksa arama işleminin başarısız olduğunu mu belirtin.
6. Beklenen davranışı açıklayın.
7. GitHub üzerinden bir Issue oluşturun.

Uyumluluğu, performansı, erişilebilirliği ve güvenilirliği geliştiren katkılar memnuniyetle karşılanır.

**GitHub Hata Bildirimleri:**

https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History/issues

---

# 📄 Lisans

Bu proje **GNU General Public License v3.0 (GPL-3.0)** kapsamında yayımlanmaktadır.

GNU GPL-3.0, geçerli lisans koşullarına uyulması şartıyla yazılımın kullanılmasına, incelenmesine, değiştirilmesine ve dağıtılmasına izin verir.

Bu lisans kapsamında dağıtılan türev çalışmalar, geçerli kaynak kodu dağıtımı ve lisanslama gerekliliklerine uymalıdır.

Ayrıntılar için proje deposundaki `LICENSE` dosyasına bakın.

---

<div align="center">

## ✦ efem360

**Küçük İyileştirmeler. Daha İyi Deneyimler.**

Geliştiren: **Kemal Kalender**

[GitHub](https://github.com/efem360) · [Gmail Geçmişi Arama](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)

<br>

*Günlük tarayıcı deneyimlerini daha basit, daha temiz ve daha verimli hâle getiriyoruz.*

</div>
