/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { api } from "@/utils/fetch";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { toast } from "react-toastify";

import { Box } from "../box";
import { GetLedgerType } from "@/types/ledger";
import { Ledger } from "./ledger";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "../pagination";

const baseLedger = {
  name: "",
  type: "CUSTOMER",
  phone: "",
  address: "",
  balance: 0,
};

const initialLedgerAction = {
  ...baseLedger,
  id: "",
};

const ledgerActionReducer = (
  state: typeof initialLedgerAction,
  action: any
) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ACTION":
      const { createdAt, updatedAt, timeAgo, orders, ...rest } = action.payload;
      return rest;
    case "RESET":
      return initialLedgerAction;
    default:
      return state;
  }
};

export const Ledgers = () => {
  const [ledgers, setLedgers] = useState<GetLedgerType[]>([]);
  const [ledgerType, setLedgerType] = useState("");
  const [ledgerAction, dispatch] = useReducer(
    ledgerActionReducer,
    initialLedgerAction
  );

  const { data, currentPage, totalPage, setPage } = usePagination({
    data: ledgers,
  });

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const fetchLedgers = useCallback(async () => {
    try {
      const { data } = await api.get("/ledger", {
        params: { pageSize: 2000, pageNumber: 1, ledgerType },
      });
      setLedgers(data?.result?.data);
    } catch (error) {
      toast.error("Cari listesi alınırken hata oluştu!");
    }
  }, [ledgerType]);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, ...rest } = ledgerAction;

    try {
      const response = await api[id ? "put" : "post"](
        `/ledger/${id || "create"}`,
        id ? ledgerAction : rest
      );

      if (response.data.status === "success") {
        fetchLedgers();
        setIsComponentVisible(false);
        toast.success(response.data.message);
      }
    } catch (e) {
      e.response?.data?.details?.forEach((item: any) =>
        toast.error(item.message)
      );
    }
  };

  const deleteLedger = async (id: string) => {
    try {
      const response = await api.delete(`/ledger/${id}`);
      if (response.data.status === "success") {
        fetchLedgers();
        toast.success(response.data.message);
      }
    } catch (e) {
      toast.error("Silme işlemi başarısız oldu!");
    }
  };

  const handleFilter = (type: string) => {
    setLedgerType((prev) => (prev === type ? "" : type));
  };

  useEffect(() => {
    fetchLedgers();
  }, [ledgerType, fetchLedgers]);

  return (
    <Box
      ActionButton={
        <AddNewPersonelButton
          setIsComponentVisible={setIsComponentVisible}
          dispatch={dispatch}
        />
      }
      Filters={
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleFilter("CUSTOMER")}
            className={`${
              ledgerType === "CUSTOMER"
                ? "bg-green-600 text-white"
                : "bg-[#EDEDEE]"
            } px-3 py-2 border rounded-md`}
          >
            MÜŞTERİ
          </button>
          <button
            onClick={() => handleFilter("WHOLESALER")}
            className={`${
              ledgerType === "WHOLESALER"
                ? "bg-green-600 text-white"
                : "bg-[#EDEDEE]"
            } px-3 py-2 border rounded-md`}
          >
            TOPTANCI
          </button>
        </div>
      }
      title="Cari Listesi"
    >
      <Table
        ledgers={data}
        deleteLedger={deleteLedger}
        dispatch={dispatch}
        setIsComponentVisible={setIsComponentVisible}
      />
      <div className="flex justify-end">
        <div className="ml-auto flex flex-col items-center font-bold">
          BAKİYE
          <div className="flex gap-2 font-medium">
            <div className="bg-green-600 px-2 py-1 rounded-md text-white">
              BORÇLUSUNUZ
            </div>
            <div className="bg-red-500 px-2 py-1 rounded-md text-white">
              ALACAKLISINIZ
            </div>
          </div>
        </div>
      </div>
      <Popup
        handleClose={() => setIsComponentVisible(false)}
        isOpen={isComponentVisible}
        ref={ref}
      >
        <LedgerForm
          ledgerAction={ledgerAction}
          dispatch={dispatch}
          handleSubmit={handleSubmit}
        />
      </Popup>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        setPage={setPage}
      />
    </Box>
  );
};

const AddNewPersonelButton = ({
  setIsComponentVisible,
  dispatch,
}: {
  setIsComponentVisible: React.Dispatch<SetStateAction<boolean>>;
  dispatch: React.Dispatch<any>;
}) => (
  <button
    onClick={() => {
      setIsComponentVisible(true);
      dispatch({ type: "RESET" });
    }}
    className="rounded-lg border p-2 flex items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
  >
    Yeni Cari Ekle
  </button>
);

const Table = ({
  ledgers,
  deleteLedger,
  dispatch,
  setIsComponentVisible,
}: {
  ledgers: GetLedgerType[];
  deleteLedger: (id: string) => void;
  dispatch: React.Dispatch<any>;
  setIsComponentVisible: React.Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="overflow-x-auto">
    <div className="w-full table whitespace-nowrap">
      <div className="[&>div]:text-start font-bold table-row [&>div]:table-cell [&>div]:min-w-[150px] [&>div]:max-w-[200px] [&>div]:pr-10">
        <div>Kategori</div>
        <div>İsim</div>
        <div>Telefon Numarası</div>
        <div>Adres</div>
        <div>Bakiye</div>
        <div>Gelir-Gider</div>
        <div>İşlemler</div>
      </div>
      {ledgers?.map((ledger) => (
        <Ledger
          key={ledger.id}
          ledger={ledger}
          deleteLedger={deleteLedger}
          callback={() => {
            setIsComponentVisible(true);
            dispatch({ type: "SET_ACTION", payload: ledger });
          }}
        />
      ))}
    </div>
  </div>
);

const LedgerForm = ({
  ledgerAction,
  dispatch,
  handleSubmit,
}: {
  ledgerAction: typeof initialLedgerAction;
  dispatch: React.Dispatch<any>;
  handleSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
}) => (
  <form
    onSubmit={handleSubmit}
    className="grid grid-cols-2 gap-3"
    autoComplete="off"
  >
    {[
      { label: "Cari İsmi", name: "name", type: "text", colSpan: 2 },
      {
        label: "Cari Türü",
        name: "type",
        colSpan: 2,
        options: [
          {
            id: 0,
            value: "CUSTOMER",
            title: "MÜŞTERİ",
          },
          {
            id: 1,
            value: "WHOLESALER",
            title: "TOPTANCI",
          },
        ],
      },
      { label: "Cari Cep No", name: "phone", type: "tel", colSpan: 2 },
      { label: "Adres", name: "address", type: "textarea", colSpan: 2 },
    ].map(({ label, name, type, colSpan, options }) => (
      <div
        className={`flex flex-col gap-1 ${
          colSpan ? `col-span-${colSpan}` : ""
        }`}
        key={name}
      >
        <label htmlFor={name}>{label}</label>
        {!options && type !== "textarea" && (
          <input
            type={type}
            name={name}
            id={name}
            className={`focus:outline-none border p-2 rounded-md`}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: name,
                value: type === "number" ? +e.target.value : e.target.value,
              })
            }
            value={ledgerAction[name as keyof typeof ledgerAction] || ""}
          />
        )}
        {options && (
          <select
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: name,
                value: e.target.value,
              })
            }
            className="p-2 border rounded-md focus:outline-none"
            name="role"
            defaultValue={ledgerAction[name as keyof typeof ledgerAction]}
          >
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
              dispatch({
                type: "UPDATE_FIELD",
                field: name,
                value: e.target.value,
              })
            }
            className="focus:outline-none border p-2 rounded-md"
            value={ledgerAction[name as keyof typeof ledgerAction] || ""}
            name={name}
            id={name}
          ></textarea>
        )}
      </div>
    ))}
    <button type="submit" className="p-2 bg-green-600 text-white col-start-2">
      {ledgerAction.id ? "Güncelle" : "Oluştur"}
    </button>
  </form>
);
