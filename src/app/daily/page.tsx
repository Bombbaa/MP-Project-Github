import React from "react";
import Daily from "../../components/dailypage/DailyPage";
import { PrismaClient } from "@prisma/client";

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

  return (
    <>
      <Daily sectionData={section} />
    </>
  );
}
