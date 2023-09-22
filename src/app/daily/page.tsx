import React from "react";
import Daily from "../../components/dailypage/DailyPage";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

interface Section {
  id: number;
  section_Code: number;
  section_Name: string;
  employee: Employee[];
}

interface Employee {
  id: number;
  asso_No: number;
  nameThai: string;
  attendance: Attendance[];
}

interface Attendance {
  id: number;
  employee_Id: number;
  shift_Id: number;
  status_Id: number;
  created_Date: Date;
  updated_Date: Date;
}

export default async function DailyPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set the time to the start of the day (midnight)

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // Set the time to the end of the day (just before midnight)

  const section: Section[] = await prisma.section.findMany({
    select: {
      id: true,
      section_Code: true,
      section_Name: true,
      employee: {
        select: {
          id: true,
          asso_No: true,
          nameThai: true,
          attendance: true,
        },
      },
    },
  });

  const sectionWithEmployeeWork = await prisma.section.findMany({
    include: {
      employee: {
        include: {
          attendance: {
            where: {
              created_Date: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          },
        },
      },
    },
  });

  const attendanceData: any = [];

  sectionWithEmployeeWork.forEach((section) => {
    section.employee.forEach((employee) => {
      employee.attendance.forEach((attendance) => {
        attendanceData.push({
          id: attendance.id,
          employee_Id: attendance.employee_Id,
          shift_Id: attendance.shift_Id,
        });
      });
    });
  });

  return (
    <>
      <Daily sectionData={section} />
    </>
  );
}
