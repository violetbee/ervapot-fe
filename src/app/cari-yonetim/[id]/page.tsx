import { Layout } from "@/components/layout";
import LedgerDetail from "@/components/ledger/id/ledger-detail";

export default async function LedgerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Layout title="Cari Detay">
      <LedgerDetail id={id} />
    </Layout>
  );
}
