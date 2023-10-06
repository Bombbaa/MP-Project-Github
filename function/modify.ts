"use server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
// import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function modifyAttendance(e: any) {
  try {
    for (const key in e) {
      const entry = e[key];
      const employeeId = entry.employee_Id;
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

      await prisma.attendance.updateMany({
        where: {
          employee_Id: employeeId,
          created_Date: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
        data: {
          status_Id: 1,
          shift_Id: 1,
          updated_Date: currentDate.toDate(),
          submitted: false,
        },
      });
    }
    // revalidatePath("/daily");
    // console.log("Attendance records ready to be modify.");
  } catch (err) {
    console.error("Error updating attendance:", err);
  } finally {
    await prisma.$disconnect();
  }
}
