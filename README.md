# StarVisualStudio

StarVisualStudio Etsy mağazası için hazırlanmış, mobil uyumlu ürün vitrini ve yönetim paneli.

## Özellikler

- 120 ürünlük aranabilir ve kategori filtreli koleksiyon
- Etsy ilanlarına yönlendiren ürün kartları
- Mobil, tablet ve masaüstü uyumlu tasarım
- Ana sayfa kampanya alanı, öne çıkan ürünler, mağaza hikâyesi ve iletişim sayfası
- Güvenli yönetici girişi
- Ürün ekleme, gizleme, öne çıkarma, indirim ve CSV içe aktarma paneli
- Cloudflare D1 ile mağaza ayarları, R2 ile yüklenen görseller
- Supabase tabanlı yönetici kimlik doğrulaması

## Sayfalar

- `/index.html` — ana sayfa
- `/collection.html` — koleksiyon
- `/about.html` — mağaza hakkında
- `/contact.html` — iletişim
- `/account` — müşteri hesabı
- `/admin` — yönetim paneli

## Yerel çalıştırma

Gerekenler:

- Node.js 22.13 veya üzeri
- pnpm 11.25 veya üzeri

Komutlar:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Üretim derlemesi:

```bash
pnpm build
```

Kaynak ve bağlantı kontrolü:

```bash
pnpm check
```

## Ortam değişkenleri

Yönetim ve üyelik özellikleri için yayın ortamında şu değişkenleri tanımlayın:

| Değişken | Açıklama |
| --- | --- |
| `SUPABASE_URL` | Supabase proje adresi |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon anahtarı |
| `ADMIN_EMAIL` | Mağaza yöneticisinin e-posta adresi |
| `MEMBER_EMAIL_READY` | Kayıt ve parola sıfırlama e-postaları hazırsa `true` |

Gizli değerleri GitHub deposuna eklemeyin. `.env` ve `.dev.vars` dosyaları zaten `.gitignore` kapsamındadır.

## GitHub'a yükleme

1. Bu ZIP'i bilgisayarınızda bir klasöre çıkarın.
2. GitHub'da boş bir depo oluşturun; README veya `.gitignore` ekletmeyin.
3. Çıkardığınız klasörde terminal açın.
4. Aşağıdaki komutlarda `KULLANICI_ADINIZ` bölümünü değiştirin:

```bash
git init
git add .
git commit -m "StarVisualStudio sitesini ekle"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/starvisualstudio.git
git push -u origin main
```

Bu proje sunucu API'leri, D1 ve R2 kullandığı için doğrudan GitHub Pages'ta tam özellikli çalışmaz. GitHub kaynak kodunu saklamak için uygundur; canlı yayın için Cloudflare uyumlu bir çalışma ortamı gerekir.

## Güvenlik

- Yönetici API'leri doğrulanmış kullanıcı ve yetki kontrolü uygular.
- Yönetici yazma istekleri aynı kaynak kontrolü ve veri doğrulaması kullanır.
- Görsel yüklemeleri dosya türü ve boyut açısından sınırlandırılır.
- Ödeme ve sipariş işlemleri bu sitede tutulmaz; Etsy üzerinde tamamlanır.

## Mağaza

[StarVisualStudio Etsy mağazası](https://starvisualstudio.etsy.com)
