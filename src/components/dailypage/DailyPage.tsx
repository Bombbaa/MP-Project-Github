"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Title from "@/components/Title";
import dayjs from "dayjs";

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
  const [sectionFliter, setSectionFliter] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  console.log(sectionFliter);

  return (
    <>
      <Title>Daily Records</Title>
      <div className="flex flex-col p-10 w-full bg-white mx-auto gap-y-10 justify-around border border-gray-300 rounded-md">
        <ul className="grid grid-cols-1 w-full gap-x-10 gap-y-5 md:grid-cols-2">
          <li className="col-span-1 flex flex-col gap-y-2 ">
            <label className="text-sm font-semibold mb-1">เลือก Section</label>
            <Autocomplete
              className="bg-white"
              options={sectionData}
              value={sectionFliter}
              onChange={(event, newValue) => {
                setSectionFliter(newValue);
              }}
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
                onChange={(newDate: any) => setSelectedDate(newDate)}
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
      {sectionFliter === null ? (
        <h2 className="text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold">
          กรุณาเลือก section ของคุณ..
        </h2>
      ) : sectionFliter.employee?.length === 0 ? (
        <h2 className="text-center p-10 w-full bg-white border border-gray-200 rounded-md text-2xl font-bold text-red-500">
          ไม่มีรายชื่อพนักงานใน Section
        </h2>
      ) : (
        <div className="flex flex-col p-10 w-full bg-white mx-auto gap-y-10 justify-around border border-gray-200 rounded-md ">
          {sectionFliter.employee.map((employee: Employee) => (
            <ul
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4  p-5 rounded-lg "
              key={employee.id}
            >
              <li className="flex items-center">
                <TextField
                  label="ชื่อ-นามสกุล"
                  defaultValue={employee.nameThai}
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                  className="w-full"
                />
              </li>
              <li className="flex items-center">
                <TextField
                  label="รหัสพนักงาน"
                  defaultValue={employee.asso_No}
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                  className="w-full"
                />
              </li>
            </ul>
          ))}
        </div>
      )}
    </>
  );
}
