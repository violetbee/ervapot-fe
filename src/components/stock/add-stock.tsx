"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Box } from "../box";
import { ProductType } from "@/types/product";
import { api } from "@/utils/fetch";
import { toast } from "react-toastify";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { ShiftType } from "@/types/stock";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/types/employee";

const stockSteps = [
  {
    id: 0,
    description: "Lütfen eklemek istediğiniz ürünü seçiniz.",
    component: StockStepOne,
  },
  {
    id: 1,
    description: "Lütfen seçtiğiniz ürün için bilgileri doldurunuz",
    component: StockStepTwo,
  },
];

const initialCreateStock = {
  barcode: "",
  totalBox: 0,
  shift: "MORNING",
  employeeId: "",
  productId: "",
  stockType: "IN",
};

export default function Stocks() {
  const { user } = useUser();
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [products, setProducts] = useState<ProductType[]>([]);

  const [createStock, setCreateStock] = useState(initialCreateStock);

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCreateStock((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? +e.target.value : e.target.value,
    }));
  };

  const getProducts = async () => {
    try {
      const { data } = await api.get("/product/", {
        params: {
          pageSize: 2000,
          pageNumber: 1,
        },
      });

      setProducts(data.result.data);
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const createStockHandler = async () => {
    try {
      const { data } = await api.post("/stock/create", {
        ...createStock,
        userId: user?.id,
        employeeId: user?.employee?.id,
      });

      if (data.status === "success") {
        getProducts();
        toast.success(data.message);
        setCreateStock(initialCreateStock);
        setCurrentFormStep(0);
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const stepHandler = (direction: string) => {
    setCurrentFormStep((prev) => {
      if (direction === "-" && prev < 1) return prev;
      if (direction === "+" && prev === stockSteps.length - 1) return prev;

      return direction === "+" ? prev + 1 : prev - 1;
    });
  };

  useEffect(() => {
    getProducts();
  }, []);
  const CurrentStep = stockSteps[currentFormStep].component;
  return (
    <Box
      title={stockSteps[currentFormStep].description}
      ActionButton={
        <ActionHandler
          currentFormStep={currentFormStep}
          stepHandler={stepHandler}
        />
      }
    >
      {products.length > 0 ? (
        <CurrentStep
          inputHandler={inputHandler}
          products={products}
          stepHandler={stepHandler}
          createStock={createStock}
          setCreateStock={setCreateStock}
          user={user}
          createStockHandler={createStockHandler}
        />
      ) : (
        <p>Henüz herhangi bir ürün eklenmedi.</p>
      )}
    </Box>
  );
}

// ------------------------------------- COMPONENTS -------------------------------------

function ActionHandler({
  stepHandler,
  currentFormStep,
}: {
  stepHandler: (direction: string) => void;
  currentFormStep: number;
}) {
  return (
    <div className="flex gap-2">
      <button
        className="disabled:opacity-35"
        onClick={() => stepHandler("-")}
        disabled={currentFormStep === 0}
      >
        <CgChevronLeft />
      </button>
      <button
        disabled={currentFormStep === stockSteps.length - 1}
        className="disabled:opacity-35"
        onClick={() => stepHandler("+")}
      >
        <CgChevronRight />
      </button>
    </div>
  );
}

function StockStepOne({
  products,
  stepHandler,
  setCreateStock,
}: {
  products: ProductType[];
  stepHandler: (direction: string) => void;
  setCreateStock: React.Dispatch<SetStateAction<typeof initialCreateStock>>;
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-5">
      {products?.map((product) => (
        <div
          key={product.id}
          className="rounded-lg border flex flex-col items-center justify-between group min-h-24 overflow-hidden"
        >
          <p className="flex-1 flex items-center justify-center p-2">
            {product.name}
          </p>
          <button
            onClick={() => {
              stepHandler("+");
              setCreateStock((prev) => ({ ...prev, productId: product.id }));
            }}
            className="w-full bg-green-600 p-2 text-white"
          >
            SEÇ
          </button>
        </div>
      ))}
    </div>
  );
}
function StockStepTwo({
  inputHandler,
  createStock,
  products,
  user,
  createStockHandler,
}: {
  inputHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  createStock: typeof initialCreateStock;
  products: ProductType[];
  user?: UserType;
  createStockHandler: () => void;
}) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
      <ul className="border-[4px] border-dashed p-4 space-y-1 col-span-2 row-start-3">
        <li>
          Seçili Ürün:{" "}
          <b>
            {products.find((item) => item.id === createStock.productId)?.name}
          </b>
        </li>
        <li>
          İşlem Yapan: <b>{user?.name + " " + user?.surname}</b>
        </li>
        <li>
          Toplam Koli Sayısı: <b>{createStock.totalBox}</b>
        </li>
        <li>
          Vardiya:{" "}
          <b>{ShiftType[createStock.shift as keyof typeof ShiftType]}</b>
        </li>
        <div className="w-full h-[1px] border-t border-black/10 !my-2" />
        <button
          onClick={createStockHandler}
          className="bg-green-600 w-full text-white py-2"
        >
          Onayla
        </button>
      </ul>

      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
        <label htmlFor="totalBox">Toplam Koli Sayısı</label>
        <input
          type="number"
          min={0}
          name="totalBox"
          id="totalBox"
          className="focus:outline-none border p-2 rounded-md"
          placeholder="_____"
          onChange={inputHandler}
          value={createStock.totalBox}
        />
      </div>
      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
        <label htmlFor="shift">Vardiya</label>
        <select
          className="p-2 border rounded-md focus:outline-none"
          name="shift"
          onChange={inputHandler}
          defaultValue={createStock.shift}
        >
          <option value="MORNING">SABAH</option>
          {/* <option value="NOON">ÖĞLE</option> */}
          <option value="EVENING">AKŞAM</option>
        </select>
      </div>
    </div>
  );
}
