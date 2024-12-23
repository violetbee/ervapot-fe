import { useComponentVisible } from "@/hooks/useComponentVisible";
import { ProductType } from "@/types/product";
import { Popup } from "../popup";

export const Product = ({
  product,
  callback,
  deleteProduct,
}: {
  product: ProductType;
  callback: (props: unknown) => void;
  deleteProduct: (id: string) => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const currentStock = product.stocks.reduce((acc, curr) => {
    return curr.stockType === "OUT" ? acc - curr.totalBox : acc + curr.totalBox;
  }, 0);

  return (
    <div
      className="rounded-lg border p-2 flex flex-col justify-between text-start relative overflow-hidden group min-h-24"
      key={product.id}
    >
      <h3>{product.name}</h3>
      <div className="flex items-center justify-between gap-2 text-white">
        <p className="py-1 px-3 rounded-full bg-slate-800">
          Stok: {currentStock} Koli
        </p>
        <span className="py-1 px-3 rounded-full bg-slate-800">
          Koli Ücreti {product.price * product.quantityPerBox}₺
        </span>
      </div>

      <div className="absolute top-0 right-0 group-hover:opacity-100 opacity-0 duration-200 flex">
        <button
          onClick={() => {
            setIsComponentVisible(true);
          }}
          className="bg-red-800 flex items-center justify-center text-white px-2"
        >
          Sil
        </button>
        <button
          onClick={() => {
            callback(true);
          }}
          className="bg-slate-800 flex items-center justify-center text-white px-2"
        >
          Düzenle
        </button>
      </div>

      <Popup
        isOpen={isComponentVisible}
        handleClose={() => setIsComponentVisible(false)}
        displayCloseButton={true}
        displaySaveButton={true}
        handleAction={() => deleteProduct(product.id)}
        ref={ref}
      >
        <p className="flex flex-col">
          Bu ürünü silmek istediğinize emin misiniz?
        </p>
        <div className="border-dotted p-5 border-4">{product.name}</div>
      </Popup>
    </div>
  );
};
