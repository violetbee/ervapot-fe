import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { CgRemove } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { GetLedgerType, LedgerType } from "@/types/ledger";
import Link from "next/link";
import { MdTableView } from "react-icons/md";
import { numberSlicer } from "@/utils/tools";

export const Ledger = ({
  ledger,
  callback,
  deleteLedger,
}: {
  ledger: GetLedgerType;
  callback: (props: unknown) => void;
  deleteLedger: (id: string) => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  return (
    <>
      <div className="[&>div]:text-start [&>div]:p-2 first:[&>div]:rounded-l-md last:[&>div]:rounded-r-md even:bg-[#EDEDEE] table-row [&>div]:table-cell">
        <div>{LedgerType[ledger.type as keyof typeof LedgerType]}</div>
        <div>{ledger.name}</div>
        <div>{ledger.phone}</div>
        <div>{ledger.address}</div>
        <div
          className={`${
            ledger.balance > 0
              ? "bg-red-500"
              : ledger.balance === 0
              ? "!text-black"
              : "bg-green-600"
          } text-white`}
        >
          {numberSlicer(ledger.balance as number)}₺
        </div>
        <div className="font-medium">
          <Link
            className="hover:underline duration-100 hover:text-blue-400 pl-2 flex items-center gap-1"
            href={`/cari-yonetim/${ledger.id}`}
          >
            İNCELE
            <MdTableView />
          </Link>
        </div>
        <div className="!flex items-center gap-2 mt-1">
          <CgRemove
            className="text-red-600"
            onClick={() => setIsComponentVisible(true)}
          />
          <BiEdit size={18} className="text-blue-500" onClick={callback} />
        </div>
      </div>
      <Popup
        isOpen={isComponentVisible}
        handleClose={() => setIsComponentVisible(false)}
        displayCloseButton={true}
        displaySaveButton={true}
        handleAction={() => deleteLedger(ledger.id)}
        ref={ref}
      >
        <p className="flex flex-col">
          Cariyi silmek istediğinize emin misiniz?
        </p>
        <div className="border-dotted p-5 border-4">{ledger.name}</div>
      </Popup>
    </>
  );
};
