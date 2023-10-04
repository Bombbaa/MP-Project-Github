import { Homepage } from "@/components/homepage/HomePage";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export default async function Home() {
  const tomorrowStart = dayjs().add(1, "day").startOf("day"); // เวลาเริ่มต้นของวันพรุ่งนี้ (00:00:00)
  const startTime = dayjs().startOf("day");
  const endTime = dayjs().endOf("day");

  const departmentGroups = await prisma.departmentgroup.findMany({
    include: {
      department: {
        include: {
          section: {
            include: {
              employee: {
                include: {
                  attendance: {
                    where: {
                      created_Date: {
                        gte: startTime.toDate(),
                        lte: endTime.toDate(),
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const DepartmentGroupCount = departmentGroups.map((group) => {
    const countStatus2 = group.department.reduce((acc, department) => {
      const departmentCount = department.section.reduce(
        (departmentAcc, section) => {
          const sectionCount = section.employee.reduce(
            (sectionAcc, employee) => {
              if (employee.attendance) {
                const status2Count = employee.attendance.filter(
                  (attendance) => attendance.status_Id === 2
                ).length;
                return sectionAcc + status2Count;
              }
              return sectionAcc;
            },
            0
          );
          return departmentAcc + sectionCount;
        },
        0
      );
      return acc + departmentCount;
    }, 0);

    const countStatus3 = group.department.reduce((acc, department) => {
      const departmentCount = department.section.reduce(
        (departmentAcc, section) => {
          const sectionCount = section.employee.reduce(
            (sectionAcc, employee) => {
              if (employee.attendance) {
                const status3Count = employee.attendance.filter(
                  (attendance) =>
                    attendance.status_Id !== 1 && attendance.status_Id !== 2
                ).length;
                return sectionAcc + status3Count;
              }
              return sectionAcc;
            },
            0
          );
          return departmentAcc + sectionCount;
        },
        0
      );
      return acc + departmentCount;
    }, 0);

    const employeeCount = group.department.reduce((acc, department) => {
      const departmentCount = department.section.reduce(
        (departmentAcc, section) => {
          const sectionCount = section.employee.length;
          return departmentAcc + sectionCount;
        },
        0
      );
      return acc + departmentCount;
    }, 0);

    return {
      id: group.id,
      departmentgroups: group.departmentgroup_Name, // Extracting departmentgroup_Name
      employeeCount: employeeCount,
      employeeWorkCount: countStatus2,
      employeeAbsentCount: countStatus3,
    };
  });

  const departmentWorkGroupAllDate = await prisma.departmentgroup.findMany({
    include: {
      department: {
        include: {
          section: {
            include: {
              employee: {
                include: {
                  attendance: {
                    where: {
                      status_Id: 2,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const DepartmentGroupWorkMonthlyYearlyCount = departmentWorkGroupAllDate.map(
    (group) => {
      // สร้างอาร์เรย์เพื่อเก็บค่า dailyCounts และค่าเฉลี่ยรายเดือน
      const monthlyData = Array.from({ length: 12 }, () => ({
        dailyCounts: Array(31).fill(0),
        monthlyAverage: 0,
      }));

      // วนลูปผ่านแผนกและพนักงานในแต่ละ department group
      group.department.forEach((department) => {
        // วนลูปผ่านแผนกและพนักงานในแต่ละแผนก
        department.section.forEach((section) => {
          // วนลูปผ่านพนักงานในแต่ละแผนก
          section.employee.forEach((employee) => {
            // วนลูปผ่านประวัติการเข้างานของพนักงาน
            employee.attendance.forEach((attendance) => {
              // แปลงวันที่ของประวัติการเข้างานเป็นวัตถุ dayjs
              const attendanceDate = dayjs(attendance.created_Date);
              // หาค่าดัชนีของเดือน (0 - 11)
              const month = attendanceDate.month();

              // ตรวจสอบว่าวันที่เข้างานอยู่ในเดือนปัจจุบันหรือไม่

              // ตรวจสอบว่าวันที่เข้างานไม่ใช่วันเสาร์หรืออาทิตย์
              if (attendanceDate.day() !== 0 && attendanceDate.day() !== 6) {
                // เพิ่มค่าในอาร์เรย์ dailyCounts โดยใช้วันที่เข้างาน - 1 เป็นดัชนี
                monthlyData[month].dailyCounts[attendanceDate.date() - 1]++;
              }
            });
          });
        });
      });

      // คำนวณค่าเฉลี่ยรายเดือนจาก dailyCounts ของแต่ละเดือน
      for (let i = 0; i < monthlyData.length; i++) {
        const monthData = monthlyData[i];
        // console.log(monthData);
        const dailyCounts = monthData.dailyCounts;
        // console.log(dailyCounts);
        const nonZeroCounts = dailyCounts.filter((count) => count !== 0);
        if (nonZeroCounts.length > 0) {
          const total = nonZeroCounts.reduce((acc, count) => acc + count, 0);
          const average = Math.floor(total / nonZeroCounts.length);
          // console.log(average);
          monthData.monthlyAverage = average;
        }
      }

      // สร้างอาร์เรย์ของ monthlyAverages จาก monthlyData
      const monthlyAverages = monthlyData.map(
        (monthData) => monthData.monthlyAverage
      );

      // สร้างและคืนค่าออกมาเป็นออบเจกต์
      return {
        departmentgroups: group.departmentgroup_Name,
        dailyCounts: monthlyData,
        monthlyAverages,
      };
    }
  );

  const departmentsWithCounts = await prisma.department.findMany({
    include: {
      section: {
        include: {
          employee: {
            select: {
              id: true,
              attendance: {
                where: {
                  created_Date: {
                    gte: startTime.toDate(),
                    lte: endTime.toDate(),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Calculate the counts for each department
  const departmentCounts = departmentsWithCounts.map((department) => {
    const employeeCount = department.section.reduce(
      (count, section) => count + section.employee.length,
      0
    );

    const employeeWorkCount = department.section.reduce(
      (count, section) =>
        count +
        section.employee.reduce(
          (sectionCount, employee) =>
            sectionCount +
            employee.attendance.filter(
              (attendance) => attendance.status_Id === 2
            ).length,
          0
        ),
      0
    );

    const employeeAbsentCount = department.section.reduce(
      (count, section) =>
        count +
        section.employee.reduce(
          (sectionCount, employee) =>
            sectionCount +
            employee.attendance.filter(
              (attendance) =>
                attendance.status_Id !== 1 && attendance.status_Id !== 2
            ).length,
          0
        ),
      0
    );

    return {
      id: department.id,
      departments: department.department_Name,
      employeeCount,
      employeeWorkCount,
      employeeAbsentCount,
    };
  });

  const sectionWithEmployeeWork = await prisma.section.findMany({
    include: {
      employee: {
        include: {
          attendance: {
            where: {
              status_Id: 2,
              created_Date: {
                gte: new Date(),
                lte: tomorrowStart.toDate(),
              },
            },
          },
        },
      },
    },
  });

  // นับจำนวนพนักงานที่มาทำงานในแต่ละ section
  const Table = sectionWithEmployeeWork.map((section) => {
    const employeeWorkCount = section.employee.reduce((count, employee) => {
      count += employee.attendance.length; // Counting attendances with status 2 for each employee
      return count;
    }, 0);

    return {
      id: section.id,
      section_Code: section.section_Code,
      section_Name: section.section_Name,
      employeeWorkCount: employeeWorkCount,
      employeeSumCount: section.employee.length,
    };
  });

  return (
    <>
      <Homepage
        OverallTableData={Table}
        DepartmentGroupData={DepartmentGroupCount}
        DepartmentData={departmentCounts}
        MonthlyYearlyData={DepartmentGroupWorkMonthlyYearlyCount}
      />
    </>
  );
}
