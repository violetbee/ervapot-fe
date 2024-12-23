export enum UserRole {
  ADMIN = "YÖNETİCİ",
  EMPLOYEE = "ÇAVUŞ",
  MEMBER = "PERSONEL",
}

export type EmployeeType = {
  id?: string;
  hourlyRate?: number;
  dailyHours?: number;
};

export type UserType = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  employee?: EmployeeType;
};

export type GetUsersType = EmployeeType & {
  user: Omit<UserType, "employee">;
  totalHours: number;
  totalSalary: number;
  dailyHours: number;
};
