"use client";

import { Box } from "@/components/box";
import Pagination from "@/components/pagination";
import { Popup } from "@/components/popup";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { usePagination } from "@/hooks/usePagination";
import { GetLedgerType, LedgerType } from "@/types/ledger";
import { api } from "@/utils/fetch";
import { numberSlicer } from "@/utils/tools";
import { useCallback, useEffect, useState } from "react";
import { CgRemove } from "react-icons/cg";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import { DocumentGenerator } from "@/components/pdf-generator";
import { FaRegFilePdf } from "react-icons/fa6";

const initialTransaction = {
  id: "",
  description: "",
  amount: 0,
};

export default function LedgerDetail({ id }: { id: string }) {
  const [ledgerDetail, setLedgerDetail] = useState<
    GetLedgerType & {
      transaction: GetTransactionType[];
    }
  >();

  const { data, currentPage, totalPage, setPage } = usePagination({
    data: ledgerDetail?.transaction,
  });

  const [selectedTransaction, setSelectedTransaction] =
    useState(initialTransaction);

  const getLedgerDetail = useCallback(async () => {
    try {
      const { data } = await api.get(`/ledger/${id}`);
      setLedgerDetail(data?.result);
    } catch (e) {
      console.log(e);
    }
  }, [id]);

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/ledger/transaction/${id}`);
      await getLedgerDetail();
    } catch (e) {
      console.log(e);
    } finally {
      setIsComponentVisible(false);
      setSelectedTransaction(initialTransaction);
    }
  };

  useEffect(() => {
    getLedgerDetail();
  }, [id, getLedgerDetail]);

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const transactionType = {
    ADD_DEBT: "BORÇ",
    CC_RECEIVE_PAYMENT: "K.K. TAHSİLAT",
    RECEIVE_PAYMENT: "TAHSİLAT",
  };

  const handleOpenPDF = async () => {
    const pdfDoc = pdf(
      <DocumentGenerator
        title="Cari Hesap Dökümü"
        ledger={ledgerDetail as GetLedgerType}
        items={data}
      />
    );
    const pdfBlob = await pdfDoc.toBlob();

    const pdfURL = URL.createObjectURL(pdfBlob);

    window.open(pdfURL, "_blank");
  };

  return (
    <Box
      title="Cari kullanıcıları ile ilgili işlemler bu sayfada yapılır."
      className="flex flex-col gap-2 divide divide-y-2"
      ActionButton={
        <>
          <button
            onClick={() => {
              handleOpenPDF();
            }}
            className="rounded-lg border p-2 flex gap-2 items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
          >
            RAPOR AL <FaRegFilePdf className="text-sm" />
          </button>
          <TransactionHandler
            ledger={ledgerDetail as GetLedgerType}
            getLedgerDetail={getLedgerDetail}
          />
        </>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-2">
        <span>
          <b>Cari Adı:</b> {ledgerDetail?.name}
        </span>
        <span>
          <b>Bakiye:</b>{" "}
          <span>{numberSlicer(ledgerDetail?.balance as number)}₺</span>
        </span>
        <span>
          <b>Telefon No:</b> {ledgerDetail?.phone}
        </span>
        <span className="col-span-2">
          <b>Adresi:</b> {ledgerDetail?.address}
        </span>
        <span className="col-span-1">
          <b>Türü:</b>{" "}
          {LedgerType[ledgerDetail?.type as keyof typeof LedgerType]}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap border-spacing-y-1 border-separate py-4">
          <thead>
            <tr className="[&>th]:text-start [&>th]:min-w-[150px] [&>th]:max-w-[200px] [&>th]:pr-10">
              <th className="w-10">Kayıt Türü</th>
              <th>İşlem No</th>
              <th>Tarih/Saat</th>
              <th>Açıklama</th>
              <th>Tutar</th>
              <th>Bakiye</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((transaction: GetTransactionType) => {
              const date = new Date(transaction.createdAt);
              return (
                <tr
                  className="[&>td]:text-start [&>td]:py-2 [&>td]:px-1 first:[&>td]:rounded-l-md last:[&>td]:rounded-r-md odd:bg-[#EDEDEE]"
                  key={transaction.id}
                >
                  <td
                    className={`${
                      transaction.transactionType.includes("RECEIVE_PAYMENT")
                        ? "bg-green-600"
                        : "bg-red-600"
                    } text-white`}
                  >
                    {transactionType[transaction.transactionType]}
                  </td>
                  <td>{transaction.id}</td>
                  <td>
                    {date.toLocaleDateString()} - {date.toLocaleTimeString()}
                  </td>
                  <td className="min-w-96">{transaction.description || "-"}</td>
                  <td
                    className={`${
                      transaction.transactionType.includes("RECEIVE_PAYMENT")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transactionType.includes("RECEIVE_PAYMENT") &&
                      "-"}
                    {numberSlicer(transaction.paymentAmount)} ₺
                  </td>
                  <td>{numberSlicer(transaction.balance)} ₺</td>
                  <td
                    onClick={() => {
                      setSelectedTransaction({
                        id: transaction.id,
                        description: transaction.description,
                        amount: transaction.paymentAmount,
                      });
                      setIsComponentVisible(true);
                    }}
                    className="!flex items-center gap-2 pl-4 mt-1"
                  >
                    <CgRemove className="text-red-600" />
                  </td>
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

      <Popup
        isOpen={isComponentVisible}
        handleClose={() => {
          setIsComponentVisible(false);
          setSelectedTransaction(initialTransaction);
        }}
        displayCloseButton={true}
        displaySaveButton={true}
        handleAction={() => deleteTransaction(selectedTransaction.id)}
        ref={ref}
      >
        <p className="flex flex-col">
          İşlemi silmek istediğinize emin misiniz?
        </p>
        <div className="border-dotted p-5 border-4">
          {selectedTransaction.description || "-"}
          <p>{numberSlicer(selectedTransaction.amount)}₺</p>
        </div>
      </Popup>
    </Box>
  );
}

export type GetTransactionType = {
  id: string;
  createdAt: Date;
  description: string;
  transactionType: "ADD_DEBT" | "RECEIVE_PAYMENT" | "CC_RECEIVE_PAYMENT";
  paymentAmount: number;
  balance: number;
  ledgerId: string;
  ledger: GetLedgerType;
};

type SetTransactionType = Omit<
  GetTransactionType,
  "id" | "createdAt" | "ledger"
>;

const initialSetTransaction = {
  transactionType: "ADD_DEBT" as GetTransactionType["transactionType"],
  paymentAmount: 0,
  description: "",
  ledgerId: "",
  balance: 0,
};

const TransactionHandler = ({
  ledger,
  getLedgerDetail,
}: {
  ledger: GetLedgerType;
  getLedgerDetail: () => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const [transaction, setTransaction] = useState<SetTransactionType>(
    initialSetTransaction
  );

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/ledger/transaction/create", {
        ...transaction,
        ledgerId: ledger?.id,
      });

      if (data.status === "success") {
        getLedgerDetail();
        toast.success(data.message);
        setIsComponentVisible(false);
        setTransaction(initialSetTransaction);
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const inputHandler = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) =>
    setTransaction((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? +e.target.value : e.target.value,
    }));
  return (
    <>
      <Popup
        isOpen={isComponentVisible}
        handleClose={() => setIsComponentVisible(false)}
        ref={ref}
      >
        <form
          onSubmit={submitTransaction}
          className="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="ledger">İşlem Yapılan Cari</label>
            <input
              type="text"
              name="ledger"
              id="ledger"
              className="focus:outline-none border p-2 rounded-md"
              value={ledger?.name}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="name">İşlem Türü</label>
            <select
              className="p-2 border rounded-md focus:outline-none"
              name="transactionType"
              onChange={inputHandler}
              value={transaction?.["transactionType"]}
            >
              <option value="ADD_DEBT">BORÇ EKLE</option>
              <option value="RECEIVE_PAYMENT">TAHSİLAT YAP</option>
              <option value="CC_RECEIVE_PAYMENT">
                KREDİ KARTI İLE TAHSİLAT YAP
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="paymentAmount">Tutar</label>
            <input
              type="number"
              min={0}
              name="paymentAmount"
              id="paymentAmount"
              className="focus:outline-none border p-2 rounded-md"
              onChange={inputHandler}
              value={transaction?.paymentAmount}
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="description">Açıklama</label>
            <textarea
              name="description"
              id="description"
              className="focus:outline-none border p-2 rounded-md"
              onChange={inputHandler}
              value={transaction?.description}
            />
          </div>
          <button
            type="submit"
            className="p-2 col-span-2 bg-green-600 text-white"
          >
            Oluştur
          </button>
        </form>
      </Popup>
      <button
        onClick={() => {
          setIsComponentVisible(true);
        }}
        className="rounded-lg border p-2 flex items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
      >
        İşlem Oluştur
      </button>
    </>
  );
};
