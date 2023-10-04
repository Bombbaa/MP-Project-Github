"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function updateAttendance(e: any) {
  try {
    for (const key in e) {
      const entry = e[key];
      const employeeId = entry.employee_Id;
      const statusId = entry.status_Id;
      const shiftId = entry.shift_Id;
      const updatedDate = dayjs(entry.updated_Date);
      const description = entry.description;
      const currentDate = dayjs();

      const startOfDay = updatedDate.startOf("day");
      const endOfDay = updatedDate.endOf("day");

      let newStatusId = null;

      if (description) {
        const createdStatus = await prisma.status.create({
          data: {
            status_Name: "อื่นๆ",
            description: description,
          },
        });
        newStatusId = createdStatus.id;
      }

      // Check if attendance record exists
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          employee_Id: employeeId,
          created_Date: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
      });

      if (!existingAttendance) {
        await prisma.attendance.create({
          data: {
            employee_Id: employeeId,
            status_Id: newStatusId || statusId,
            shift_Id: shiftId,
            created_Date: startOfDay.toDate(),
            updated_Date: currentDate.toDate(),
            submitted: true,
          },
        });
      } else {
        await prisma.attendance.updateMany({
          where: {
            employee_Id: employeeId,
            created_Date: {
              gte: startOfDay.toISOString(),
              lte: endOfDay.toISOString(),
            },
          },
          data: {
            status_Id: newStatusId || statusId,
            shift_Id: shiftId,
            updated_Date: currentDate.toDate(),
            submitted: true,
          },
        });
      }
    }
    revalidatePath("/daily");
    // console.log("Attendance records updated successfully.");
  } catch (err) {
    console.error("Error updating attendance:", err);
  } finally {
    await prisma.$disconnect();
  }
}
