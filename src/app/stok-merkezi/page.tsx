"use client";
import { Layout } from "@/components/layout";
import AddStock from "@/components/stock/add-stock";
import { useUser } from "@/hooks/useUser";
import { UserRole, UserType } from "@/types/employee";
import Link from "next/link";

export default function StokMerkezi() {
  const { user } = useUser();
  console.log(user);
  return (
    <Layout
      title="Stok Merkezi"
      ActionButton={
        (user as UserType)?.role === ("ADMIN" as UserRole) && (
          <Link
            href="/stok-merkezi/liste"
            className="border-b-2 border-green-600 hover:-translate-y-[1px] duration-200"
          >
            Stok Listesine Git
          </Link>
        )
      }
    >
      <AddStock />
    </Layout>
  );
}
