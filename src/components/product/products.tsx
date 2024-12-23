/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ProductType } from "@/types/product";
import { api } from "@/utils/fetch";
import { useEffect, useState } from "react";
import { Product } from "./product";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { toast } from "react-toastify";

export const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productAction, setProductAction] = useState<
    Omit<ProductType, "createdAt" | "stocks">
  >({
    id: "",
    name: "",
    price: 0,
    quantityPerBox: 0,
  });

  const productActionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductAction((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? +e.target.value : e.target.value,
    }));
  };

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const getProducts = async () => {
    const { data } = await api.get("/product", {
      params: {
        pageSize: 2000,
        pageNumber: 1,
      },
    });

    setProducts(data.result.data);
  };

  const productActionSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data;
    try {
      const { id, ...rest } = productAction;

      data = await api[productAction.id ? "put" : "post"](
        `/product/${productAction.id || "create"}`,
        productAction.id ? productAction : rest
      );
      if (data.data.status === "success") {
        getProducts();
        setIsComponentVisible(false);
        toast.success(data.data.message);
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const data = await api.delete(`/product/${id}`);
      if (data.data.status === "success") {
        getProducts();
        toast.success(data.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-5">
      <Popup
        handleClose={() => setIsComponentVisible(false)}
        isOpen={isComponentVisible}
        ref={ref}
      >
        <form onSubmit={productActionSubmit} className="flex flex-col gap-2">
          <label htmlFor="name">Ürün İsmi</label>
          <input
            type="text"
            name="name"
            id="name"
            className="focus:outline-none border p-2 rounded-md"
            placeholder="Ürün İsmi"
            onChange={productActionHandler}
            value={productAction.name}
          />
          <label htmlFor="name">Koli İçi Adet</label>
          <input
            type="number"
            name="quantityPerBox"
            id="quantityPerBox"
            className="focus:outline-none border p-2 rounded-md"
            placeholder="Koli İçi Adet"
            onChange={productActionHandler}
            value={productAction.quantityPerBox}
          />
          <label htmlFor="price">Ürün Fiyatı</label>
          <input
            type="number"
            name="price"
            id="price"
            className="focus:outline-none border p-2 rounded-md"
            placeholder="Ürün Fiyatı"
            onChange={productActionHandler}
            value={productAction.price}
          />
          <button type="submit" className="p-2 bg-green-600 text-white">
            {productAction.id ? "Güncelle" : "Oluştur"}
          </button>
        </form>
      </Popup>
      <button
        onClick={() => {
          setIsComponentVisible(true);
          setProductAction({
            id: "",
            name: "",
            price: 0,
            quantityPerBox: 0,
          });
        }}
        className="rounded-lg border p-2 flex items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
      >
        Yeni Ürün Ekle
      </button>
      {products?.map((product) => {
        return (
          <Product
            callback={() => {
              setIsComponentVisible(true);
              setProductAction({
                id: product.id,
                name: product.name,
                price: product.price,
                quantityPerBox: product.quantityPerBox,
              });
            }}
            deleteProduct={deleteProduct}
            key={product.id}
            product={product}
          />
        );
      })}
    </div>
  );
};
