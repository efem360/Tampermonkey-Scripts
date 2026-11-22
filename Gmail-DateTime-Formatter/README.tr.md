<div align="center">

# ✦ efem360 Gmail DateTime Formatter

### Gmail İçin Otomatik Tarih ve Saat Biçimlendirme

**Gmail'de tarih ve saat gösterimini standartlaştıran, hafif ve çok dilli bir Tampermonkey kullanıcı betiği.**

Gmail'in yerelleştirilmiş tarih biçimlerini temiz, tutarlı ve okunabilir bir formata dönüştürün. Gmail arayüzünü değiştirmeden ve normal çalışma düzenini bozmadan otomatik olarak çalışır.

Gmail Türkçe, İngilizce, Almanca, Fransızca veya desteklenen başka bir dilde kullanılsa da amaç her zaman aynı tarih ve saat görünümünü sağlamaktır.

<br>

[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-2.4.0-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Gmail-DateTime-Formatter/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)

<br>

[⚡ Tek Tıkla Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js) · [GitHub Deposu](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter) · [Sürüm Geçmişi](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)

<br>

**Tek Biçim. Her Gelen Kutusu. Daha Az Karmaşa.**

</div>

---

## Genel Bakış

**efem360 Gmail DateTime Formatter**, Gmail'de tarih ve saat bilgilerinin görüntülenme biçimini iyileştirmek için geliştirilmiş hafif bir tarayıcı kullanıcı betiğidir.

Gmail, kullanıcının dil ayarlarına bağlı olarak tarihleri farklı yerelleştirilmiş biçimlerde gösterir. Bu durum, farklı hesaplar ve arayüzler arasında tarih gösteriminde tutarsızlıklara neden olabilir.

Bu kullanıcı betiği, desteklenen tarih biçimlerini standart bir formata dönüştürür:

```text
DD.MM.YY HH:MM
```

**Örnek:**

```text
17.04.26 18:49
```

Farklı yerelleştirilmiş tarih biçimleri yerine, Gmail içerisinde tek tip ve tutarlı bir görünüm sunar.

Arka planda otomatik olarak çalışır ve ek bir yapılandırma gerektirmez.

### Öne Çıkan Özellikler

- **Evrensel Tarih Gösterimi:** Desteklenen yerelleştirilmiş tarih biçimlerini standartlaştırır.
- **Çok Dilli Ay Tanıma:** Birden fazla dildeki ay kısaltmalarını tanır.
- **Otomatik Saat Gösterimi:** Saati tarihin yanında görüntüler.
- **Dinamik İçerik Algılama:** Gmail'e sonradan yüklenen içerikleri algılar.
- **MutationObserver Teknolojisi:** Sürekli tarama yapmadan ilgili DOM değişikliklerini izler.
- **Hafif Mimari:** Gereksiz tarayıcı işlemlerini en aza indirecek şekilde tasarlanmıştır.
- **Yerel Gmail Entegrasyonu:** Ek arayüz öğeleri oluşturmadan mevcut tarih gösterimlerini düzenler.
- **Yapılandırma Gerektirmez:** Kurulumdan sonra otomatik olarak çalışır.

---

## 📌 Proje Hakkında

Bu projenin temel amacı, Gmail'deki tarih ve saat bilgilerinin daha tutarlı ve kolay okunabilir olmasını sağlamaktır.

Gmail, arayüz diline, bölgesel ayarlara ve mesajın görüntülendiği bağlama bağlı olarak tarihleri farklı biçimlerde gösterebilir.

Örneğin:

| Gmail Dili | Yerelleştirilmiş Tarih | Düzenlenmiş Görünüm |
|---|---|---|
| Türkçe | `17 Nis 2026 Cum 18:49` | `17.04.26 18:49` |
| İngilizce | `17 Apr 2026 Fri 18:49` | `17.04.26 18:49` |
| Almanca | `17 Mär 2026 Di 18:49` | `17.03.26 18:49` |
| Fransızca | `17 avr 2026 ven 18:49` | `17.04.26 18:49` |

Tanınan kaynak dil ne olursa olsun, sonuç aynı biçimde görüntülenir.

### Temel Hedefler

- Tutarlı bir tarih ve saat formatı sunmak.
- Farklı Gmail dil ayarları arasındaki görsel tutarsızlıkları azaltmak.
- Kullanıcıların tek tek mesajları açmasına gerek kalmadan saati görüntülemek.
- Dinamik olarak yüklenen e-posta içeriklerini otomatik olarak işlemek.
- Gmail'in özgün arayüzünü ve düzenini korumak.
- Kaynak tüketimini mümkün olduğunca düşük tutmak.

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

### 2. Kullanıcı Betiğini Yükleyin

Aşağıdaki yükleme bağlantısını açın:

**[efem360 Gmail DateTime Formatter'ı Yükle](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js)**

Tampermonkey, kullanıcı betiğinin kurulum ekranını açacaktır.

Kurulumu tamamlamak için **Yükle (Install)** seçeneğine tıklayın.

### 3. Kullanmaya Başlayın

Kurulumdan sonra:

1. Gmail'i açın.
2. Sayfayı yenileyin.
3. Gelen kutunuzda gezinin veya bir e-posta konuşmasını açın.
4. Betik, tanınan tarihleri otomatik olarak biçimlendirir.

Ek bir ayar veya manuel etkinleştirme gerekmez.

---

## ✨ Özellikler

### 1. Standartlaştırılmış Tarih ve Saat Formatı

Betik, Gmail'in tanınan tarih bilgilerini tutarlı bir formata dönüştürür.

**Standart çıktı:**

```text
DD.MM.YY HH:MM
```

**Örnekler:**

| Orijinal Tarih | Düzenlenmiş Tarih |
|---|---|
| `17 Nis 2026 Cum 18:49` | `17.04.26 18:49` |
| `05 Oca 2026 Pzt 09:15` | `05.01.26 09:15` |
| `22 Kas 2026 Paz 14:30` | `22.11.26 14:30` |

Format şu bileşenlerden oluşur:

- İki haneli gün.
- İki haneli ay.
- İki haneli yıl.
- 24 saatlik zaman gösterimi.

### 2. Çok Dilli Ay Tanıma

Gmail'in görüntülediği tarih bilgileri farklı dillerdeki ay kısaltmalarını içerebilir.

Betik, çok dilli bir ay tanıma sistemi içerir.

**Desteklenen ay kısaltmalarından örnekler:**

| Dil | Örnekler |
|---|---|
| Türkçe | Oca, Şub, Mar, Nis, May |
| İngilizce | Jan, Feb, Mar, Apr, May |
| Almanca | Jan, Feb, Mär, Apr, Mai |
| Fransızca | Janv, Févr, Mars, Avr, Mai |
| İspanyolca | Ene, Feb, Mar, Abr, May |
| İtalyanca | Gen, Feb, Mar, Apr, Mag |
| Portekizce | Jan, Fev, Mar, Abr, Mai |

Kaynak kodunda ek ay kısaltmaları da bulunmaktadır.

**Önemli:** Dil desteği, Gmail'in döndürdüğü tarih yapısına ve ay kısaltmalarına bağlıdır. Her bölgesel farklılığın tanınacağı garanti edilmez.

### 3. Otomatik Dinamik İçerik Algılama

Gmail, tüm sayfayı yenilemeden içerik yükleyen ve güncelleyen dinamik bir arayüz kullanır.

Betik, ilgili değişiklikleri izlemek için JavaScript'in `MutationObserver` API'sini kullanır.

Bu sayede aşağıdakiler algılanabilir:

- Sonradan yüklenen e-postalar.
- Güncellenen tarih öğeleri.
- Dinamik olarak eklenen mesaj içerikleri.
- İlgili tarih niteliklerindeki değişiklikler.

Sürekli çalışan iki saniyelik bir tarama döngüsü bulunmaz.

### 4. Hafif DOM İşleme

Betik, mevcut tarih öğelerini işler ve sonradan eklenen içerikleri takip eder.

Mimari, gereksiz tekrarlanan işlemleri önleyecek şekilde tasarlanmıştır.

Temel özellikler:

- Sürekli çalışan bir tarama aralığı yoktur.
- Ek arayüz panelleri oluşturulmaz.
- Gereksiz harici kütüphaneler kullanılmaz.
- Ek kullanıcı yapılandırması gerektirmez.
- Ayrı bir arka plan hizmeti bulunmaz.

### 5. Gmail'in Yerel Görünümünü Koruma

Betik, ayrı bir tarih gösterimi oluşturmak yerine Gmail'in mevcut tarih öğelerini düzenler.

Özgün arayüz mümkün olduğunca korunur.

Düzenlenmiş tarih:

- Mevcut tarih alanında görüntülenir.
- Tek satırda kalır.
- Kompakt yazı boyutuna sahiptir.
- Ek arayüz bileşenleri oluşturmaz.

---

## ⚙️ Teknik Mimari

### Çalışma Ortamı

Proje JavaScript ile geliştirilmiştir ve Tampermonkey aracılığıyla doğrudan Gmail içerisinde çalışır.

### Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|---|---|
| JavaScript | Tarih işleme ve DOM düzenleme |
| MutationObserver | Dinamik içerik algılama |
| DOM API | Gmail öğelerine erişme ve güncelleme |
| Regular Expressions | Yerelleştirilmiş tarih metinlerini ayrıştırma |
| Tampermonkey | Kullanıcı betiğinin çalıştırılması ve yönetimi |

### Çalıştırma Stratejisi

Kullanıcı betiği şu ayarla çalışır:

```javascript
// @run-at document-idle
```

Bu sayede betik, ilk sayfa yapısı kullanılabilir hâle geldikten sonra tarihleri işlemeye başlar.

### DOM İzleme

Betik aşağıdaki değişiklikleri izler:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['title', 'aria-label']
});
```

Bu yapılandırma, Gmail'in belge yapısındaki ilgili değişikliklerin algılanmasını sağlar.

### Tarih İşleme

Tarih dönüştürme işlemi aşağıdaki adımlardan oluşur:

1. Gmail tarih öğelerini bulur.
2. Tam tarih bilgisini `title` niteliğinden alır.
3. Gün, ay, yıl, haftanın günü ve saati ayrıştırır.
4. Ay kısaltmasını belirler.
5. Ayı sayısal karşılığına dönüştürür.
6. Standart tarih metnini oluşturur.
7. Mevcut tarih öğesini günceller.

### Hedef Öğeler

Betik, Gmail tarih öğelerini şu seçiciyle belirler:

```css
span[title][aria-label]
```

Düzenlenmiş sonuç, ilk doğrudan alt `span` öğesine uygulanır.

---

## 🔄 Güncelleme Sistemi

Proje, kurulum ve güncellemeler için tek bir kullanıcı betiği dosyası kullanır.

**Güncelleme URL'si:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js
```

Yeni bir sürüm yayımlandığında mevcut kullanıcı betiği dosyası güncellenir.

Kullanıcı betiğinin başlığındaki sürüm numarası da buna uygun şekilde güncellenir.

Örnek:

```javascript
// @version      2.4.0
```

Tampermonkey, kullanıcı betiği güncelleme bilgilerini kullanarak daha yeni sürümleri kontrol edebilir.

Sürüm bilgileri için:

[GitHub Sürümleri](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)

---

## 🔐 Gizlilik ve Güvenlik

Gizlilik, bu projede önemli bir önceliktir.

**efem360 Gmail DateTime Formatter**, doğrudan kullanıcının tarayıcısında yerel olarak çalışır.

### Gizlilik İlkeleri

- Kullanıcı hesabı sistemi bulunmaz.
- Kayıt işlemi gerekmez.
- Analiz veya takip sistemi bulunmaz.
- Harici API istekleri gönderilmez.
- Uzak veritabanı kullanılmaz.
- E-posta içeriği toplanmaz.
- E-posta bilgileri üçüncü taraf sunuculara aktarılmaz.

### Veri İşleme

Betik, mevcut Gmail DOM öğelerindeki tarih bilgilerini okur ve görüntülenen metni düzenler.

Temel işlevini yerine getirmek için e-posta gövdelerine, eklere, kişilere veya mesaj içeriklerine erişmesi gerekmez.

Tüm tarih biçimlendirme işlemleri tarayıcıda yerel olarak gerçekleştirilir.

### İzinler

Kullanıcı betiği, ek Tampermonkey API izinlerine ihtiyaç duymaz.

```javascript
// @grant        none
```

---

## ⚠️ Uyumluluk ve Sınırlamalar

Betik özellikle Gmail'in web arayüzü için tasarlanmıştır.

### Desteklenen Ortam

- Gmail Web.
- Tampermonkey ile uyumlu tarayıcılar.
- Tanınan tarih yapılarını kullanan Gmail arayüzleri.
- Desteklenen yerelleştirilmiş ay kısaltmaları.

### Sınırlamalar

- Gmail arayüzündeki güncellemeler DOM yapısını değiştirebilir.
- Tanınmayan ay kısaltmaları dönüştürülmez.
- Farklı öğe yapısına sahip tarih biçimleri ek işlem gerektirebilir.
- Bazı yerelleştirilmiş tarih biçimleri için ek uyumluluk çalışmaları gerekebilir.

Betik, Gmail'de kayıtlı mesaj tarihlerini veya zaman damgalarını değiştirmez. Yalnızca tanınan tarihlerin tarayıcıda nasıl görüntülendiğini düzenler.

---

## 📋 Sürüm Geçmişi

| Sürüm | Değişiklikler |
|---|---|
| 2.4.0 | Çok dilli ay tanıma ve standart tarih biçimlendirme |
| 2.3.0 | MutationObserver entegrasyonu ve sürekli taramanın kaldırılması |
| 2.2.0 | İlk tarih ve saat biçimlendirme uygulaması |

---

## 🤝 Katkıda Bulunma

Önerilere, hata bildirimlerine ve geliştirmelere açığız.

Bir sorunla karşılaşırsanız:

1. Sorunun tekrarlanabilir olup olmadığını kontrol edin.
2. Gmail arayüz dilinizi belirtin.
3. Orijinal tarih biçimine bir örnek ekleyin.
4. Beklenen çıktıyı açıklayın.
5. GitHub üzerinden bir Issue oluşturun.

Dil uyumluluğunu, performansı ve güvenilirliği geliştiren katkılar memnuniyetle karşılanır.

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

[GitHub](https://github.com/efem360) · [Gmail DateTime Formatter](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)

<br>

*Günlük tarayıcı deneyimlerini daha basit, daha temiz ve daha verimli hâle getiriyoruz.*

</div>
