import { GoHomeFill } from "react-icons/go";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BsBasket } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { BsBoxSeamFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";

export const menu = [
  {
    id: 0,
    name: "Ana Sayfa",
    url: "/",
    icon: GoHomeFill,
    permission: ["ADMIN", "EMPLOYEE"],
  },
  {
    id: 1,
    name: "Cari Yönetim",
    url: "/cari-yonetim",
    icon: MdAccountBalanceWallet,
    permission: ["ADMIN"],
  },
  {
    id: 2,
    name: "Sipariş Yönetim",
    url: "/siparis-yonetim",
    icon: BsBasket,
    permission: ["ADMIN"],
  },
  {
    id: 3,
    name: "Stok Merkezi",
    url: "/stok-merkezi",
    icon: BsBoxSeamFill,
    permission: ["EMPLOYEE", "ADMIN"],
  },
  {
    id: 4,
    name: "Personel Yönetim",
    url: "/personel-yonetim",
    icon: MdManageAccounts,
    permission: ["ADMIN"],
  },
  {
    id: 5,
    name: "Ürün Yönetim",
    url: "/urun-yonetim",
    icon: AiFillProduct,
    permission: ["ADMIN"],
  },
];
