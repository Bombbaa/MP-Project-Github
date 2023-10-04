import React from "react";
import { useStoreAPI } from "../../../stores/store";
import { TextField } from "@mui/material";

export function TotalListItem() {
  const { setCountAPI, setWorkAPI, setAbsentAPI } = useStoreAPI();

  return (
    <section className="flex flex-col items-center m-10">
      <ul className="grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-3 text-black text-lg">
        <li className="bg-blue-100 rounded-lg py-5 px-10">
          <h2 className="mb-2 text-blue-700 text-center">พนักงานทั้งหมด</h2>
          <TextField
            value={`${setCountAPI} คน`}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              input: {
                fontSize: "20px",
                textAlign: "center",
              },
            }}
          />
        </li>
        <li className="bg-green-100 rounded-lg py-5 px-10">
          <h2 className="mb-2 text-green-700 text-center">
            จำนวนพนักงานที่มาทำงาน
          </h2>
          <TextField
            value={`${setWorkAPI} คน`}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              input: {
                fontSize: "20px",
                textAlign: "center",
              },
            }}
          />
        </li>
        <li className="bg-red-100 rounded-lg py-5 px-10">
          <h2 className="mb-2 text-red-700 text-center">
            จำนวนพนักงานที่ลางาน
          </h2>
          <TextField
            value={`${setAbsentAPI} คน`}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              input: {
                fontSize: "20px",
                textAlign: "center",
              },
            }}
          />
        </li>
      </ul>
    </section>
  );
}
