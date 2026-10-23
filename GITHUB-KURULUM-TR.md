# StarVisualStudio — GitHub kaynak kodu

Bu paket mevcut yayındaki Site'in kaynak dosyalarını içerir.
Yayınlanan kaynak commit: 0c7ac5b7c6391f31b67d0e3ded5dca1be01694e5

## Dahil olanlar
- Ana sayfa, ürün koleksiyonu, Hakkımızda ve İletişim sayfaları.
- Ana sayfada kısa sipariş rehberi, Etsy müşterilerinden alınmış üç yorum ve açılır SSS.
- 120 ürünün katalog verileri ve görselleri.
- Yönetici girişi, ürün yönetimi, dosya yükleme ve Supabase üye yönetimi kodu.
- Uygulama bağımlılıkları, kilit dosyası, veritabanı geçişleri ve proje yapılandırmaları.
- Yerel Nunito Sans yazı tipi ve lisansı.

## Ürün bağlantıları
85 ürün doğrudan eşleştirilmiş Etsy ilanını açar. Geriye kalan 35 ürünün başlıkları tekrarlı olduğu için tek tek ilan kimliği görsel ile doğrulanamadı; bu ürünler Etsy mağazasında başlıkla arama açar. Kaynakta `data/etsy-links.json` doğrulanmış bağlantıları, `data/seed-products.json` katalog verisini içerir.

## GitHub'a yükleme
1. ZIP'i bilgisayarında bir klasöre çıkart.
2. GitHub'da yeni bir depo oluştur; projede sunucu tarafı ve mağaza yapılandırması bulunduğundan depoyu Private olarak başlat.
3. GitHub Desktop kullanıyorsan çıkarılmış klasörü yeni yerel depo olarak ekleyip yayımla. Terminal kullanıyorsan klasör içinde Git deposu başlatıp dosyaları commit et ve kendi deponu remote olarak ekleyip push et.
4. ZIP dosyasının kendisini değil, içindeki proje dosyalarını depoya yükle. `.gitignore` dosyasını koru.

GitHub'a yüklemek tek başına siteyi çalıştırmaz. Proje Vinext/React, Cloudflare Workers, D1, R2 ve Supabase kullanır. GitHub Pages bu API ve yönetici işlevlerini çalıştırmaz.

Başka bir sunucuda çalıştırmak için D1 ve R2 bağlamalarını, Supabase URL ve publishable key ayarlarını, izin verilen giriş/yönlendirme adreslerini ve mağaza sahibinin doğrulanmış kimliğini kendi sunucuna göre yapılandırman gerekir. Gizli servis anahtarlarını yalnızca sunucu ortamında tut. `README.md` geliştirme komutlarını ve proje ayrıntılarını içerir.

## Pakete alınmayanlar
`.env`, `.dev.vars`, anahtarlar, oturumlar, `node_modules`, yerel runtime verileri ve canlı D1/R2 veritabanı içerikleri pakete alınmadı. Site yönetim panelinde daha sonra kaydedilmiş canlı ürün ve ayarların dışa aktarımı da bu kaynak ZIP'inin dışında kalır.
