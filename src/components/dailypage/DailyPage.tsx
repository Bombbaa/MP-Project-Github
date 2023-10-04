"use client";
import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import SuccessModal from "@/components/SuccessModal";
import { Navigation } from "@/components/Navigation";
import Title from "@/components/Title";
import dayjs from "dayjs";
import EmployeeCard from "./NameListItem";
import { TotalListItem } from "./TotalListItem";

import { modifyAttendance } from "../../../function/modify";
import { updateAttendance } from "../../../function/update";

type Section = {
  id: number;
  section_Code: number;
  section_Name: string;
  employee: Employee[];
};

interface Employee {
  id: number;
  asso_No: number;
  nameThai: string;
  attendance: Attendance[];
}

type Attendance = {
  id: number;
  employee_Id: number;
  shift_Id: number;
  status_Id: number;
  created_Date: Date;
  updated_Date: Date;
  submitted: boolean;
};

type DailyProps = {
  sectionData: Section[];
};

type AttendanceData = {
  [employeeId: number]: {
    employee_Id: number;
    status_Id: number;
    shift_Id: number;
    updated_Date: string;
  };
};

export default function Dailypage({ sectionData }: DailyProps) {
  const [sectionFilter, setSectionFilter] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const { reset, handleSubmit, control } = useForm();

  const attendanceSubmitted = useMemo(
    () =>
      sectionFilter?.employee.some((employee: Employee) =>
        employee.attendance.some(
          (attendance: Attendance) =>
            dayjs(attendance.created_Date).isSame(selectedDate, "day") &&
            attendance.submitted
        )
      ),
    [sectionFilter, selectedDate]
  );

  const handleSectionChange = (
    event: React.ChangeEvent<{}>,
    newValue: Section | null
  ) => {
    setSectionFilter(newValue);
    reset();
  };

  const handleDateChange = (newDate: any) => {
    setSelectedDate(newDate);
    reset();
  };

  const onSubmit = async (data: AttendanceData) => {
    setIsSwitchOnMap((prevIsSwitchOnMap) => {
      const updatedIsSwitchOnMap = { ...prevIsSwitchOnMap };
      for (const key in updatedIsSwitchOnMap) {
        updatedIsSwitchOnMap[key] = false;
      }
      return updatedIsSwitchOnMap;
    });
    reset();

    try {
      await updateAttendance(data);
      Swal.fire({
        icon: "success",
        title: "ยอดเยี่ยม!",
        text: "ฟอร์ม Section ของคุณถูกยืนยันเรียบร้อย!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      window.location.reload();
      console.error("Submission error:", error);
    }

    setDescriptionOn((prevDescriptionOn) => {
      const updatedDescriptionOn = { ...prevDescriptionOn };
      for (const key in updatedDescriptionOn) {
        updatedDescriptionOn[key] = false;
      }
      return updatedDescriptionOn;
    });
  };

  const handleModifySubmit = async (data: AttendanceData) => {
    try {
      await modifyAttendance(data);
      Swal.fire({
        icon: "warning",
        title: "คุณได้ทำการกดแก้ไขฟอร์ม",
        text: "อย่าลืม! กรุณากรอกฟอร์ม Section ของคุณอีกครั้ง!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      window.location.reload();
      console.error("Submission error:", error);
    }
  };

  const [isSwitchOnMap, setIsSwitchOnMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [descriptionOn, setDescriptionOn] = useState<{
    [key: number]: boolean;
  }>({});

  return (
    <>
      <Navigation />
      <Title>Daily Record</Title>
      <main>
        <div className="flex flex-col p-10 w-full bg-white mx-auto gap-y-10 justify-around border border-gray-300 rounded-md">
          <ul className="grid grid-cols-1 w-full gap-x-10 gap-y-5 md:grid-cols-2">
            <li className="col-span-1 flex flex-col gap-y-2">
              <label className="text-sm font-semibold mb-1">
                เลือก Section
              </label>
              <Autocomplete
                className="bg-white"
                options={sectionData}
                value={sectionFilter}
                onChange={handleSectionChange}
                getOptionLabel={(option: Section) =>
                  option.section_Code.toString()
                }
                isOptionEqualToValue={(option, value) => {
                  return option.section_Code === value.section_Code;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Section Code" required />
                )}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.section_Code}
                    </li>
                  );
                }}
              />
            </li>
            <li className="col-span-1 flex flex-col gap-y-2">
              <label className="text-sm font-semibold mb-1">
                กรุณาเลือกวันที่
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="bg-white"
                  value={selectedDate}
                  onChange={handleDateChange}
                  maxDate={dayjs()}
                  views={["year", "month", "day"]}
                  label="date"
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </li>
          </ul>
        </div>
        <h2 className="flex justify-center text-3xl text-black font-bold text-center mt-10 mb-5">
          รายชื่อพนักงาน
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {sectionFilter === null ? (
            <h2
              className={`text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold ${
                sectionFilter ? "text-red-500" : ""
              }`}
            >
              {sectionFilter
                ? `ไม่มีข้อมูลในวันที่  ${selectedDate.format("DD/MM/YYYY")}`
                : "กรุณาเลือก section ของคุณ.."}
            </h2>
          ) : sectionFilter.employee.length === 0 ? (
            <h2 className="text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold text-red-500">
              ไม่มีรายชื่อพนักงานใน Section
            </h2>
          ) : (
            <EmployeeCard
              filterData={sectionFilter.employee}
              selectedDate={selectedDate}
              Control={control}
              isSwitchOnMap={isSwitchOnMap}
              setIsSwitchOnMap={setIsSwitchOnMap}
              descriptionOn={descriptionOn}
              setDescriptionOn={setDescriptionOn}
              attendanceSubmitted={attendanceSubmitted}
            />
          )}

          <TotalListItem />
          <div className="flex w-4/5 mx-auto my-5 gap-10">
            <button
              type="button"
              onClick={handleSubmit(handleModifySubmit)}
              disabled={attendanceSubmitted === false || sectionFilter === null}
              title={sectionFilter === null ? "กรุณาเลือก Section " : ""}
              className={`flex-1 justify-center text-white font-medium rounded-lg text-sm px-5 py-5 ${
                attendanceSubmitted
                  ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              แก้ไข
            </button>
            <button
              type="submit"
              className={`flex-1 justify-center text-white font-medium rounded-lg text-sm px-5 py-5 ${
                attendanceSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : sectionFilter === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              }`}
              disabled={attendanceSubmitted || sectionFilter === null}
            >
              {attendanceSubmitted
                ? "Section ถูกบันทึกเรียบร้อยแล้ว"
                : "บันทึก"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
