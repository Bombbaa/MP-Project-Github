import React from "react";
import Summary from "../../components/summarypage/SummaryPage";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type EmployeeAttendance = {
  created_Date: Date;
  shift_Id: number;
  status_Id: number;
  employee: {
    nameThai: string;
  };
  status: {
    description: string | null;
  };
};

type AttendanceByDate = Record<string, EmployeeAttendance[]>;

type SummaryData = {
  id: number;
  create_Date: Date;
  sectionCode: number;
  sectionName: string;
  sumPlanDay: number;
  workPlanDay: number;
  absentDay: number;
  ratioDay: number;
  statusMappingShiftDay: string[];
  sumPlanNight: number;
  workPlanNight: number;
  absentNight: number;
  ratioNight: number;
  statusMappingShiftNight: string[];
  sumPlanSummary: number;
  workPlanSummary: number;
  absentSummary: number;
  ratioSummary: number;
  statusMappingSummary: string[];
};

export default async function SummaryPage() {
  try {
    const sections = await prisma.section.findMany({
      select: {
        id: true,
        section_Code: true,
        section_Name: true,
        employee: {
          select: {
            attendance: {
              select: {
                created_Date: true,
                shift_Id: true,
                status_Id: true,
                employee: {
                  select: {
                    nameThai: true,
                  },
                },
                status: {
                  select: {
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const sectionsWithResults = sections.flatMap((section) => {
      const attendances = section.employee.flatMap((emp) => emp.attendance);

      const attendancesByDate: AttendanceByDate = attendances.reduce(
        (result, attendance) => {
          const date = attendance.created_Date.toISOString().split("T")[0];

          if (!result[date]) {
            result[date] = [];
          }
          result[date].push(attendance);
          return result;
        },
        {} as AttendanceByDate
      );

      // Convert grouped attendances to desired format
      const results: SummaryData[] = Object.entries(attendancesByDate).map(
        ([date, attendances]) => {
          const sumPlanDay = attendances.filter(
            (att) => att.shift_Id === 2
          ).length;
          const workPlanDay = attendances.filter(
            (att) => att.shift_Id === 2 && att.status_Id === 2
          ).length;
          const absentDay = attendances.filter(
            (att) => att.shift_Id === 2 && att.status_Id !== 2
          ).length;

          const ratioDay =
            sumPlanDay !== 0 ? Math.floor((workPlanDay / sumPlanDay) * 100) : 0;

          const sumPlanNight = attendances.filter(
            (att) => att.shift_Id === 3
          ).length;
          const workPlanNight = attendances.filter(
            (att) => att.shift_Id === 3 && att.status_Id === 2
          ).length;
          const absentNight = attendances.filter(
            (att) => att.shift_Id === 3 && att.status_Id !== 2
          ).length;

          const ratioNight =
            sumPlanNight !== 0
              ? Math.floor((workPlanNight / sumPlanNight) * 100)
              : 0;

          const employeeStatusForDate = attendances
            .filter(
              (att) => att.created_Date.toISOString().split("T")[0] === date
            )
            .map((att) => ({
              employeeName: att.employee.nameThai, // Use employee's nameThai property
              status_Id: att.status_Id,
              status_desc: att.status.description,
              shift_Id: att.shift_Id,
            }));

          const statusMappingShiftDay: string[] = employeeStatusForDate
            .filter((data) => data.status_Id !== 2 && data.shift_Id === 2)
            .map((data) => `- ${data.employeeName}: ${data.status_desc}`);
          const statusMappingShiftNight: string[] = employeeStatusForDate
            .filter((data) => data.status_Id !== 2 && data.shift_Id === 3)
            .map((data) => `- ${data.employeeName}:  ${data.status_desc}`);

          const statusMappingSummary: string[] = statusMappingShiftDay.concat(
            statusMappingShiftNight
          );

          const sumPlanSummary = sumPlanDay + sumPlanNight;
          const workPlanSummary = workPlanDay + workPlanNight;
          const absentSummary = absentDay + absentNight;

          const ratioSummary =
            sumPlanSummary !== 0
              ? Math.floor((workPlanSummary / sumPlanSummary) * 100)
              : 0;

          return {
            create_Date: new Date(date),
            id: section.id,
            sectionCode: section.section_Code,
            sectionName: section.section_Name,
            sumPlanDay,
            workPlanDay,
            absentDay,
            ratioDay,
            statusMappingShiftDay,
            sumPlanNight,
            workPlanNight,
            absentNight,
            ratioNight,
            statusMappingShiftNight,
            sumPlanSummary,
            workPlanSummary,
            absentSummary,
            ratioSummary,
            statusMappingSummary,
          };
        }
      );

      return results;
    });

    return (
      <>
        <Summary SectionData={sectionsWithResults} />
      </>
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
