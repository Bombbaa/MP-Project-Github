"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Stack from "@mui/material/Stack";

import { Navigation } from "@/components/Navigation";
import Title from "@/components/Title";
import dayjs from "dayjs";
import EmployeeCard from "./NameListItem";
import { updateAttendance } from "../../../func/sent";

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

type DailyProps = {
  sectionData: Section[];
};

export default function Dailypage({ sectionData }: DailyProps) {
  const [sectionFilter, setSectionFilter] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sectionSelected, setSectionSelected] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const handleSectionChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: Section | null) => {
      setSectionFilter(newValue);
      reset();
      setSectionSelected(!!newValue);
    },
    [reset]
  );

  const handleDateChange = useCallback(
    (newDate: any) => {
      setSelectedDate(newDate);
    },
    [selectedDate]
  );

  const onSubmit = (data: any) => {
    console.log(data);
    updateAttendance(data);
  };

  const filteredSections = useMemo(() => {
    if (selectedDate && sectionFilter) {
      const hasMatchingEmployee = sectionFilter.employee.some(
        (employee: Employee) =>
          employee.attendance.some((attendance: Attendance) =>
            dayjs(attendance.created_Date).isSame(selectedDate, "day")
          )
      );

      if (hasMatchingEmployee) {
        return sectionFilter;
      } else {
        return null;
      }
    }
    return null;
  }, [selectedDate, sectionData, sectionFilter]);

  console.log(filteredSections);

  return (
    <>
      <Navigation />
      <Title>Daily Records</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col p-10 w-full bg-white mx-auto gap-y-10 justify-around border border-gray-300 rounded-md">
          <ul className="grid grid-cols-1 w-full gap-x-10 gap-y-5 md:grid-cols-2">
            <li className="col-span-1 flex flex-col gap-y-2 ">
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
        <h2
          className={` flex justify-center text-3xl mt-10 mb-5 text-black font-bold`}
        >
          รายชื่อพนักงาน
        </h2>
        {filteredSections === null ? (
          <h2
            className={`text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold ${
              sectionSelected ? "text-red-500" : ""
            }`}
          >
            {sectionSelected
              ? "ไม่มีข้อมูลในวันที่นี้"
              : "กรุณาเลือก section ของคุณ.."}
          </h2>
        ) : filteredSections.employee.length === 0 ? (
          <h2 className="text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold text-red-500">
            ไม่มีรายชื่อพนักงานใน Section
          </h2>
        ) : (
          <ul className="flex flex-col p-10 w-full bg-white mx-auto gap-y-10 justify-around border border-gray-200 rounded-md">
            {filteredSections.employee.map((employee: Employee) => (
              <EmployeeCard
                key={employee.id}
                employee={{ ...employee, id: employee.id }}
                control={control}
                currentDates={selectedDate}
              />
            ))}
          </ul>
        )}
        <button
          type="submit"
          disabled={
            filteredSections === null ||
            filteredSections.employee?.length === 0 ||
            isSubmitting
          }
          className={`px-6 py-3.5 text-base font-medium text-white my-5 flex justify-center w-4/5 mx-auto ${
            filteredSections === null || filteredSections.employee?.length === 0
              ? "bg-gray-300 cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
              : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          }`}
        >
          Submit
        </button>
      </form>
    </>
  );
}
