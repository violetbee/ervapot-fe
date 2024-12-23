import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      {/* <MainPage /> */}
      <section className="bg-white">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-4">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-red-500 antialiased">erva</span>pot Yönetim
              Sistemine Hoş Geldiniz
            </h2>
            <p className="text-gray-600 mb-6">
              Cari hesaplarınızı, stoklarınızı, personel bilgilerinizi ve
              siparişlerinizi tek bir platformda kolayca yönetin.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="pb-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-800 text-left mb-4">
            Sistem Özellikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cari Hesap Yönetimi",
                desc: "Tüm müşterilerinizin finansal verilerini düzenleyin.",
              },
              {
                title: "Stok Yönetimi",
                desc: "Stok giriş-çıkışlarını anlık olarak takip edin.",
              },
              {
                title: "Personel Yönetimi",
                desc: "Çalışan bilgilerini yönetin ve izleyin.",
              },
              {
                title: "Ürün Yönetimi",
                desc: "Ürün detaylarını düzenleyin ve kategori oluşturun.",
              },
              {
                title: "Sipariş Takibi",
                desc: "Gelen siparişlerinizi anında kontrol edin.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-6 shadow rounded text-center"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
