/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { api } from "@/utils/fetch";
import { SetStateAction, useEffect, useState } from "react";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { toast } from "react-toastify";
import { GetUsersType, UserRole, UserType } from "@/types/employee";
import { Box } from "../box";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "../pagination";

const initialOrder = {
  title: "",
  note: "",
};

export const Orders = () => {
  const [orders, setOrders] = useState<
    { id: string; note: string; title: string }[]
  >([]);

  const { data, currentPage, totalPage, setPage } = usePagination({
    data: orders,
  });
  const [orderAction, setOrderAction] =
    useState<typeof initialOrder>(initialOrder);

  const orderActionHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrderAction((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const getOrders = async () => {
    const { data } = await api.get("/order", {
      params: {
        pageSize: 2000,
        pageNumber: 1,
      },
    });

    setOrders(data.result);
  };

  const employeeActionSubmit = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`/order/create`, orderAction);
      if (data.status === "success") {
        getOrders();
        setIsComponentVisible(false);
        toast.success(data.message);
        setPage(0);
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { data } = await api.delete(`/order/${id}`);
      if (data.status === "success") {
        getOrders();
        toast.success(data.message);
        setPage(0);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box
      ActionButton={
        <AddNewPersonelButton
          setOrderAction={setOrderAction}
          setIsComponentVisible={setIsComponentVisible}
        />
      }
      title="Sipariş Listesi"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.map((order: { id: string; title: string; note: string }) => (
          <article
            key={order.id}
            className="p-4 pb-6 flex flex-col gap-3 items-start rounded-lg border relative overflow-hidden group"
          >
            <div className="flex justify-between w-full border-b pb-2">
              <h1 className="flex-1">{order.title}</h1>
              <p>#{order.id}</p>
            </div>
            <p className="z-[9] break-all">{order.note}</p>
            <div className="absolute bottom-0 right-0 group-hover:opacity-100 opacity-0 duration-200 flex">
              <button
                onClick={async () => {
                  await deleteEmployee(order.id);
                }}
                className="bg-red-800 flex items-center justify-center text-white px-2"
              >
                Sil
              </button>
            </div>
          </article>
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        setPage={setPage}
      />

      <Popup
        handleClose={() => setIsComponentVisible(false)}
        isOpen={isComponentVisible}
        ref={ref}
      >
        <form
          onSubmit={employeeActionSubmit}
          className="grid grid-cols-2 gap-3"
          autoComplete="off"
        >
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="name">Sipariş Başlığı</label>
            <input
              type="text"
              name="title"
              id="title"
              className="focus:outline-none border p-2 rounded-md"
              placeholder="_____"
              onChange={orderActionHandler}
              value={orderAction.title}
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="surname">Sipariş Notu</label>
            <textarea
              name="note"
              id="note"
              className="focus:outline-none border p-2 rounded-md"
              onChange={orderActionHandler}
              value={orderAction.note}
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-green-600 text-white col-start-2"
          >
            Oluştur
          </button>
        </form>
      </Popup>
    </Box>
  );
};

const AddNewPersonelButton = ({
  setIsComponentVisible,
  setOrderAction,
}: {
  setIsComponentVisible: React.Dispatch<SetStateAction<boolean>>;
  setOrderAction: React.Dispatch<
    SetStateAction<{ title: string; note: string }>
  >;
}) => (
  <button
    onClick={() => {
      setIsComponentVisible(true);
      setOrderAction(initialOrder);
    }}
    className="rounded-lg border p-2 flex items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
  >
    Yeni Sipariş Oluştur
  </button>
);
