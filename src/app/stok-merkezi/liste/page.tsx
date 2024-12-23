import { Layout } from "@/components/layout";
import StockList from "@/components/stock/list";
import Link from "next/link";

export default function StockListesi() {
  return (
    <Layout
      title="Stok Listesi"
      ActionButton={
        <Link
          href="/stok-merkezi"
          className="border-b-2 border-green-600 hover:-translate-y-[1px] duration-200"
        >
          Stok Merkezine Geri Git
        </Link>
      }
    >
      <StockList />
    </Layout>
  );
}
