/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { api } from "@/utils/fetch";
import { SetStateAction, useEffect, useState } from "react";
import { Employee } from "./employee";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { Popup } from "../popup";
import { toast } from "react-toastify";
import { GetUsersType, UserRole, UserType } from "@/types/employee";
import { Box } from "../box";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "../pagination";
import { days_between, numberSlicer } from "@/utils/tools";
import { pdf } from "@react-pdf/renderer";
import { SalaryDocumentGenerator } from "../salary-pdf-generator";

const initialEmployee = {
  id: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: UserRole["EMPLOYEE"],
  employee: {
    hourlyRate: 0,
    dailyHours: 0,
  },
};

const initialSalary = {
  id: "",
  name: "",
  surname: "",
  startDate: null,
  endDate: null,
};

export type CalculateSalary = {
  id: string;
  name: string;
  surname: string;
  startDate: Date | null;
  endDate: Date | null;
};

export const Employees = () => {
  const [employees, setEmployees] = useState<GetUsersType[]>([]);

  const { data, currentPage, totalPage, setPage } = usePagination({
    data: employees,
  });

  const [employeeAction, setEmployeeAction] =
    useState<UserType>(initialEmployee);

  const [calculateSalary, setCalculateSalary] =
    useState<CalculateSalary>(initialSalary);

  const employeeActionHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEmployeeAction((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? +e.target.value : e.target.value,
    }));
  };

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const calculateSalaryFormOpen = useComponentVisible(false);

  const getEmployees = async () => {
    const { data } = await api.get("/employee", {
      params: {
        pageSize: 2000,
        pageNumber: 1,
      },
    });

    setEmployees(data.result.data);
  };

  const employeeActionSubmit = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    let data;
    try {
      const { id, ...rest } = employeeAction;

      data = await api[employeeAction.id ? "put" : "post"](
        `/user/${employeeAction.id || "create"}`,
        employeeAction.id ? employeeAction : rest
      );
      if (data.data.status === "success") {
        getEmployees();
        setIsComponentVisible(false);
        toast.success(data.data.message);
      }
    } catch (e) {
      const errors = e.response?.data?.details;
      errors?.forEach((item: any) => toast.error(item.message));
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const data = await api.delete(`/user/${id}`);
      if (data.data.status === "success") {
        getEmployees();
        toast.success(data.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    if (employeeAction.role === ("MEMBER" as any)) {
      setEmployeeAction((prev) => ({ ...prev, email: "", password: "" }));
    }
  }, [employeeAction.role]);

  const selectedEmployee: GetUsersType | undefined = employees.find(
    (item) => item.id === calculateSalary?.id
  );

  const handleOpenPDF = async () => {
    const pdfDoc = pdf(
      <SalaryDocumentGenerator
        title="Personel Maaş Dökümü"
        salary={{ ...calculateSalary, salary: employeeSalary }}
      />
    );
    const pdfBlob = await pdfDoc.toBlob();

    const pdfURL = URL.createObjectURL(pdfBlob);

    window.open(pdfURL, "_blank");
  };

  const employeeSalary =
    days_between(calculateSalary?.startDate, calculateSalary?.endDate) *
    (selectedEmployee?.hourlyRate || 0) *
    (selectedEmployee?.dailyHours || 0);

  return (
    <Box
      ActionButton={
        <>
          <button
            onClick={() => {
              setCalculateSalary(initialSalary);
              calculateSalaryFormOpen.setIsComponentVisible(true);
            }}
            className="rounded-lg border p-2 flex gap-2 items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
          >
            MAAŞ HESAPLA
          </button>
          <AddNewPersonelButton
            setEmployeeAction={setEmployeeAction}
            setIsComponentVisible={setIsComponentVisible}
          />
        </>
      }
      title="Personel Listesi"
    >
      <div className="flex justify-between items-center pb-4">
        <p>Bu sayfada personellerin listesine erişebilirsiniz.</p>
      </div>
      <div className="overflow-x-auto">
        <div className="w-full table whitespace-nowrap">
          <div className="[&>div]:text-start font-bold table-row [&>div]:table-cell [&>div]:min-w-[150px] [&>div]:max-w-[200px] [&>div]:pr-10">
            <div>İsim - Soy İsim</div>
            <div>Personel Türü</div>
            <div>Telefon Numarası</div>
            <div>Saatlik Ücreti</div>
            <div>Günlük Çalışma Saati</div>
            <div>İşlemler</div>
          </div>

          {data?.map((employee: GetUsersType) => {
            return (
              <Employee
                callback={() => {
                  setIsComponentVisible(true);
                  setEmployeeAction({
                    id: employee.user.id,
                    name: employee.user.name,
                    surname: employee.user.surname,
                    email: employee.user.email,
                    role: employee.user.role,
                    employee: {
                      hourlyRate: employee.hourlyRate,
                      dailyHours: employee.dailyHours,
                    },
                    phoneNumber: employee.user.phoneNumber,
                  });
                }}
                deleteEmployee={deleteEmployee}
                key={employee.user.id}
                employee={employee as unknown as GetUsersType}
              />
            );
          })}

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
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Çalışan İsmi</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="focus:outline-none border p-2 rounded-md"
                  placeholder="_____"
                  onChange={employeeActionHandler}
                  value={employeeAction.name}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="surname">Çalışan Soy İsim</label>
                <input
                  type="text"
                  name="surname"
                  id="surname"
                  className="focus:outline-none border p-2 rounded-md"
                  placeholder="_____"
                  onChange={employeeActionHandler}
                  value={employeeAction.surname}
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="password">Çalışan Tipi</label>
                <select
                  onChange={employeeActionHandler}
                  className="p-2 border rounded-md focus:outline-none"
                  name="role"
                  defaultValue={employeeAction.role}
                >
                  <option value="ADMIN">YÖNETİCİ</option>
                  <option value="EMPLOYEE">ÇAVUŞ</option>
                  <option value="MEMBER">PERSONEL</option>
                </select>
              </div>
              {employeeAction.role !== ("MEMBER" as any) && (
                <>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label htmlFor="email">Çalışan Mail Adresi</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="focus:outline-none border p-2 rounded-md"
                      placeholder="_____"
                      onChange={employeeActionHandler}
                      value={employeeAction.email}
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label htmlFor="password">Çalışan Şifre</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="new-password"
                      className="focus:outline-none border p-2 rounded-md"
                      onChange={employeeActionHandler}
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="phoneNumber">Çalışan Cep No</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="05"
                  className="focus:outline-none border p-2 rounded-md"
                  value={employeeAction.phoneNumber}
                  onChange={employeeActionHandler}
                />
              </div>
              {employeeAction.role !== UserRole["ADMIN"] && (
                <>
                  <div className="flex flex-col gap-1 col-span-1">
                    <label htmlFor="hourlyRate">Saatlik Ücreti</label>
                    <input
                      type="number"
                      name="hourlyRate"
                      id="hourlyRate"
                      placeholder="0"
                      min={0.01}
                      step="0.01"
                      className="focus:outline-none border p-2 rounded-md"
                      value={employeeAction.employee?.hourlyRate || 0}
                      onChange={(e) => {
                        setEmployeeAction((prev) => ({
                          ...prev,
                          employee: {
                            ...prev.employee,
                            hourlyRate: +e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-1">
                    <label htmlFor="dailyHours">Günlük Çalışma Saati</label>
                    <input
                      type="number"
                      name="dailyHours"
                      id="dailyHours"
                      placeholder="0"
                      min="1"
                      max="24"
                      step="1"
                      className="focus:outline-none border p-2 rounded-md"
                      value={employeeAction.employee?.dailyHours || 0}
                      onChange={(e) => {
                        setEmployeeAction((prev) => ({
                          ...prev,
                          employee: {
                            ...prev.employee,
                            dailyHours: +e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="p-2 bg-green-600 text-white col-start-2"
              >
                {employeeAction.id ? "Güncelle" : "Oluştur"}
              </button>
            </form>
          </Popup>

          {/* CALCULATE SALARY */}
          <Popup
            handleClose={() =>
              calculateSalaryFormOpen.setIsComponentVisible(false)
            }
            isOpen={calculateSalaryFormOpen.isComponentVisible}
            ref={calculateSalaryFormOpen.ref}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenPDF();
              }}
              className="grid grid-cols-2 gap-3"
              autoComplete="off"
            >
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="password">Çalışan Listesi</label>
                <select
                  onChange={(e) => {
                    setCalculateSalary((prev) => ({
                      ...prev,
                      id: e.target.value,
                      name:
                        employees.find((item) => item.id === e.target.value)
                          ?.user?.name || "",
                      surname:
                        employees.find((item) => item.id === e.target.value)
                          ?.user?.surname || "",
                    }));
                  }}
                  className="p-2 border rounded-md focus:outline-none"
                  name="role"
                  value={calculateSalary.id}
                >
                  <option disabled={!!calculateSalary.id} value="">
                    Lütfen bir çalışan seçiniz.
                  </option>
                  {employees.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.user.name} {item.user.surname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                <label htmlFor="employeeSalary">Çalışanın Saatlik Ücreti</label>
                <input
                  type="text"
                  name="employeeSalary"
                  id="employeeSalary"
                  disabled
                  className="focus:outline-none border p-2 rounded-md"
                  value={(selectedEmployee?.hourlyRate || 0) + " ₺"}
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                <label htmlFor="employeeSalary">Günlük Çalışma Saati</label>
                <input
                  type="text"
                  name="employeeSalary"
                  id="employeeSalary"
                  disabled
                  className="focus:outline-none border p-2 rounded-md"
                  value={(selectedEmployee?.dailyHours || 0) + " Saat"}
                />
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <label htmlFor="salaryStartDate">Tarih Başlangıç</label>
                <input
                  type="date"
                  name="salaryStartDate"
                  id="salaryStartDate"
                  className="focus:outline-none border p-2 rounded-md"
                  max={
                    calculateSalary.endDate
                      ? calculateSalary.endDate.toISOString().slice(0, 10)
                      : ""
                  }
                  value={
                    calculateSalary.startDate
                      ? calculateSalary.startDate.toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setCalculateSalary((prev) => ({
                      ...prev,
                      startDate: e.target.value
                        ? new Date(e.target.value)
                        : null,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <label htmlFor="salaryEndDate">Tarih Bitiş</label>
                <input
                  type="date"
                  name="salaryEndDate"
                  id="salaryEndDate"
                  min={
                    calculateSalary.startDate
                      ? calculateSalary.startDate.toISOString().slice(0, 10)
                      : ""
                  }
                  className="focus:outline-none border p-2 rounded-md"
                  value={
                    calculateSalary.endDate
                      ? calculateSalary.endDate.toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setCalculateSalary((prev) => ({
                      ...prev,
                      endDate: e.target.value ? new Date(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="p-2 border col-span-2">
                Maaş:{" "}
                {numberSlicer(
                  days_between(
                    calculateSalary?.startDate,
                    calculateSalary?.endDate
                  ) *
                    (selectedEmployee?.hourlyRate || 0) *
                    (selectedEmployee?.dailyHours || 0)
                )}{" "}
                ₺
              </div>

              <button
                type="submit"
                className="p-2 bg-green-600 text-white col-start-2 disabled disabled:bg-black/10"
                disabled={
                  days_between(
                    calculateSalary?.startDate,
                    calculateSalary?.endDate
                  ) *
                    (selectedEmployee?.hourlyRate || 0) *
                    (selectedEmployee?.dailyHours || 0) <
                  0.01
                }
              >
                Hesapla
              </button>
            </form>
          </Popup>
          {/* CALCULATE SALARY END */}
        </div>
      </div>
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
  setEmployeeAction,
}: {
  setIsComponentVisible: React.Dispatch<SetStateAction<boolean>>;
  setEmployeeAction: React.Dispatch<SetStateAction<UserType>>;
}) => (
  <button
    onClick={() => {
      setIsComponentVisible(true);
      setEmployeeAction(initialEmployee);
    }}
    className="rounded-lg border p-2 flex items-center justify-center bg-[#EDEDEE] hover:bg-white duration-200"
  >
    Yeni Personel Ekle
  </button>
);
