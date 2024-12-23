/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Box } from "@/components/box";
import Pagination from "@/components/pagination";
import { Popup } from "@/components/popup";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { usePagination } from "@/hooks/usePagination";
import { useUser } from "@/hooks/useUser";
import { GetLedgerType } from "@/types/ledger";
import { ProductType } from "@/types/product";
import { ShiftType, type StockType } from "@/types/stock";
import { api } from "@/utils/fetch";
import { numberSlicer } from "@/utils/tools";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

export default function StockList() {
  const [stocks, setStocks] = useState<StockType[]>([]);
  const { data, currentPage, totalPage, setPage } = usePagination({
    data: stocks,
  });
  const getStockList = async () => {
    try {
      const { data } = await api.get("/stock/", {
        params: {
          pageSize: 2000,
          pageNumber: 1,
        },
      });
      setStocks(data.result.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getStockList();
  }, []);

  return (
    <Box
      title="Stok Listesi"
      ActionButton={<DispatchStockButton getStockList={getStockList} />}
    >
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap border-spacing-y-1 border-separate">
          <thead>
            <tr className="[&>th]:text-start [&>th]:min-w-[150px] [&>th]:max-w-[200px] [&>th]:pr-10">
              <th>Kayıt Türü</th>
              <th>Kayıt Giriş Tarih/Saat</th>
              <th>Personel Adı</th>
              <th>Vardiya</th>
              <th>Ürün Adı</th>
              <th>Koli Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((stock: StockType) => {
              const date = new Date(stock.createdAt);
              return (
                <tr
                  className="[&>td]:text-start [&>td]:p-2 first:[&>td]:rounded-l-md last:[&>td]:rounded-r-md odd:bg-[#EDEDEE]"
                  key={stock.id}
                >
                  <td
                    className={`${
                      stock.stockType === "IN" ? "bg-green-600" : "bg-red-600"
                    } text-white`}
                  >
                    {stock.stockType === "IN" ? "GİRİŞ" : "ÇIKIŞ"}
                  </td>
                  <td>
                    {date.toLocaleDateString()} - {date.toLocaleTimeString()}
                  </td>
                  <td>
                    {stock.employee
                      ? stock.employee.user.name +
                        " " +
                        stock.employee.user.surname
                      : "YÖNETİCİ"}
                  </td>
                  <td>{ShiftType[stock.shift as keyof typeof ShiftType]}</td>
                  <td>{stock.product.name}</td>
                  <td>{stock.totalBox}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        setPage={setPage}
      />
    </Box>
  );
}

const DispatchStock = ({
  setIsComponentVisible,
  getStockList,
}: {
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
  getStockList: () => void;
}) => {
  const { user } = useUser();

  const initialDispatchStock = {
    totalBox: 0,
    productId: "",
    stockType: "OUT",
    ledgerId: "",
    userId: "",
    balance: "",
    isSpecialPrice: false,
    specialPrice: 0,
  };

  const [dispatchStock, setDispatchStock] =
    useState<typeof initialDispatchStock>(initialDispatchStock);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [ledgers, setLedgers] = useState<GetLedgerType[]>([]);

  const selectedProduct = products?.find(
    (product) => product.id === dispatchStock.productId
  );

  const createDispatchStock = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { specialPrice, isSpecialPrice, ...payload } = dispatchStock;
    try {
      const { data } = await api.post("/stock/create", {
        ...payload,
        balance:
          ((dispatchStock["specialPrice"] || selectedProduct?.price) ?? 0) *
          (selectedProduct?.quantityPerBox ?? 0) *
          dispatchStock["totalBox"],
        specialPrice: +dispatchStock.specialPrice || 0,
        totalBox: +dispatchStock.totalBox,
      });

      if (data.status === "success") {
        setIsComponentVisible(false);
        toast.success(data.message);
        getStockList();
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await api.get("/product", {
        params: {
          pageSize: 2000,
          pageNumber: 1,
        },
      });
      setProducts(data.result.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getLedgers = async () => {
    try {
      const { data } = await api.get("/ledger", {
        params: {
          pageSize: 2000,
          pageNumber: 1,
        },
      });
      setLedgers(data.result.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProducts();
    getLedgers();

    if (user) {
      setDispatchStock((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user]);
  return (
    <form
      onSubmit={createDispatchStock}
      className="grid grid-cols-2 gap-3"
      autoComplete="off"
    >
      {[
        {
          label: "İşlemi Yapan",
          name: "userId",
          colSpan: 2,
          disabled: true,
          value: `${user?.name} ${user?.surname}`,
        },
        {
          label: "Cari Seçiniz",
          name: "ledgerId",
          colSpan: 2,
          options: ledgers?.map((item) => ({
            id: item.id,
            value: item.id,
            title: item.name,
          })),
        },
        {
          label: "Ürün Seçiniz",
          name: "productId",
          colSpan: 2,
          options: products?.map((item) => ({
            id: item.id,
            value: item.id,
            title: item.name,
          })),
        },
        {
          label: "Özel Fiyat Belirle",
          name: "isSpecialPrice",
          type: "checkbox",
          colSpan: 2,
        },
        {
          label: "Ürün Fiyatı (₺)",
          name: "specialPrice",
          type: "number",
          colSpan: 2,
        },
        {
          label: "Toplam Koli Miktarı",
          name: "totalBox",
          type: "number",
          colSpan: 2,
        },
        {
          label: "Eklenecek Borç",
          name: "balance",
          type: "text",
          disabled: true,
          colSpan: 2,
          value:
            numberSlicer(
              ((dispatchStock["specialPrice"] || selectedProduct?.price) ?? 0) *
                (selectedProduct?.quantityPerBox ?? 0) *
                dispatchStock["totalBox"]
            ) + "₺",
        },
      ].map(({ label, name, type, colSpan, options, disabled, value }) => (
        <div
          className={`flex ${
            type === "checkbox" ? "flex-row gap-2" : "flex-col"
          } gap-1 ${colSpan ? `col-span-${colSpan}` : ""}`}
          key={name}
        >
          <label
            hidden={
              !!(
                name === "specialPrice" &&
                !dispatchStock["isSpecialPrice" as keyof typeof dispatchStock]
              )
            }
            htmlFor={name}
          >
            {label}
          </label>
          {!options && type !== "textarea" && (
            <input
              type={type}
              name={name}
              id={name}
              className="focus:outline-none border p-2 rounded-md"
              disabled={disabled}
              hidden={
                !!(
                  name === "specialPrice" &&
                  !dispatchStock["isSpecialPrice" as keyof typeof dispatchStock]
                )
              }
              min={0}
              onChange={(e) =>
                setDispatchStock((prev) => ({
                  ...prev,
                  [name]:
                    type === "number"
                      ? e.target.value.replace(/^0+/, "")
                      : type === "checkbox"
                      ? e.target.checked
                      : e.target.value,
                }))
              }
              value={
                value ||
                (dispatchStock[name as keyof typeof dispatchStock] as string)
              }
            />
          )}
          {options && (
            <select
              onChange={(e) =>
                setDispatchStock((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="p-2 border rounded-md focus:outline-none"
              name="role"
              defaultValue={
                dispatchStock[name as keyof typeof dispatchStock] as string
              }
            >
              <option
                disabled={!!dispatchStock[name as keyof typeof dispatchStock]}
              >
                Lütfen seçim yapınız.
              </option>
              {options.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.title}
                </option>
              ))}
            </select>
          )}
          {type === "textarea" && (
            <textarea
              onChange={(e) =>
                setDispatchStock((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="focus:outline-none border p-2 rounded-md"
              value={
                dispatchStock[name as keyof typeof dispatchStock] as string
              }
              name={name}
              id={name}
            ></textarea>
          )}
        </div>
      ))}
      <button type="submit" className="p-2 bg-green-600 text-white col-start-2">
        Oluştur
      </button>
    </form>
  );
};

const DispatchStockButton = ({
  getStockList,
}: {
  getStockList: () => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  return (
    <>
      <button
        onClick={() => setIsComponentVisible(true)}
        className="bg-red-600 text-white py-2 px-3 rounded-md"
      >
        Stok Çıkışı Yap
      </button>
      <Popup
        isOpen={isComponentVisible}
        ref={ref}
        handleClose={() => setIsComponentVisible(false)}
      >
        <DispatchStock
          getStockList={getStockList}
          setIsComponentVisible={setIsComponentVisible}
        />
      </Popup>
    </>
  );
};
