import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { GetUsersType, UserRole } from "@/types/employee";
import { CgRemove } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";

export const Employee = ({
  employee,
  callback,
  deleteEmployee,
}: {
  employee: GetUsersType;
  callback: (props: unknown) => void;
  deleteEmployee: (id: string) => void;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  return (
    <>
      <div className="[&>div]:text-start [&>div]:p-2 first:[&>div]:rounded-l-md last:[&>div]:rounded-r-md even:bg-[#EDEDEE] table-row [&>div]:table-cell">
        <div>{employee.user.name + " " + employee.user.surname}</div>
        <div>
          {UserRole[employee.user.role as unknown as keyof typeof UserRole]}
        </div>
        <div>{employee.user.phoneNumber}</div>
        <div>{employee.hourlyRate}</div>
        <div>{employee.dailyHours}</div>

        <div className="!flex items-center gap-2 mt-1">
          <CgRemove
            className="text-red-600"
            onClick={() => setIsComponentVisible(true)}
          />
          <BiEdit
            size={18}
            className="text-blue-500"
            onClick={() => callback(true)}
          />
        </div>
      </div>
      <Popup
        isOpen={isComponentVisible}
        handleClose={() => setIsComponentVisible(false)}
        displayCloseButton={true}
        displaySaveButton={true}
        handleAction={() => deleteEmployee(employee.user.id)}
        ref={ref}
      >
        <p className="flex flex-col">
          Personeli silmek istediğinize emin misiniz?
        </p>
        <div className="border-dotted p-5 border-4">
          {employee.user.name + " " + employee.user.surname}
        </div>
      </Popup>
    </>
  );
};
