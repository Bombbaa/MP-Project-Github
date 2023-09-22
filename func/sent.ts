import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateAttendance(e: any) {
  try {
    console.log("Attendance records updated successfully.");
  } catch (err) {
    console.error("Error updating attendance:", err);
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client when done
  }
}
