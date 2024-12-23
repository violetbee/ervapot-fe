import { ForwardedRef, forwardRef } from "react";
import { CgClose } from "react-icons/cg";

interface PopupProps {
  children: React.ReactNode;
  handleAction?: (props: unknown) => void;
  handleClose: () => void;
  isOpen?: boolean;
  displayCloseButton?: boolean;
  displaySaveButton?: boolean;
  actionButtonName?: string;
}

export const Popup = forwardRef(
  (
    {
      children,
      handleAction,
      handleClose,
      isOpen = false,
      displaySaveButton = false,
      displayCloseButton = false,
      actionButtonName = "Evet",
    }: PopupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      isOpen && (
        <div
          className={`z-[999] inset-0 fixed flex items-center justify-center w-full h-screen bg-black/20 overflow-hidden`}
        >
          <div
            ref={ref}
            className="p-4 bg-white relative rounded-lg flex flex-col w-[calc(100vw-20px)] sm:w-96 gap-7"
          >
            <button onClick={handleClose} className="absolute top-2 right-2">
              <CgClose size={20} />
            </button>
            {children}
            {(displayCloseButton || displaySaveButton) && (
              <div className="flex gap-2 justify-end">
                {displaySaveButton && (
                  <button
                    onClick={handleAction}
                    className="p-2 rounded-md bg-green-600 text-white min-w-20"
                  >
                    {actionButtonName}
                  </button>
                )}
                {displayCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-2 border rounded-md min-w-20"
                  >
                    Kapat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )
    );
  }
);

Popup.displayName = "Popup";
