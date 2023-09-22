import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs, { Dayjs } from "dayjs";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { usePopupState } from "material-ui-popup-state/hooks";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import create from "zustand";
import { useStoreAPI } from "../../../stores/store";

type TableSummaryProps = {
  SummaryTableAPI: Section[];
};

type Section = {
  create_Date: Date;
  id: number;
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

interface Rows {
  id: number;
  sectionCode: number;
  sectionName: string;
  employeeTotalCountShiftDay: number;
  employeeWorkCountShiftDay: number;
  employeeAbsentCountShiftDay: number;
  employeeRatioShiftDay: number;
  statusInfoShiftDay: string[];
  employeeTotalCountShiftNight: number;
  employeeWorkCountShiftNight: number;
  employeeAbsentCountShiftNight: number;
  employeeRatioShiftNight: number;
  statusInfoShiftNight: string[];
  employeeTotalSummary: number;
  employeeWorkCountSummary: number;
  employeeAbsentCountSummary: number;
  employeeRatioSummary: number;
  statusInfoSummary: string[];
  create_Date: Date;
}

export function TableSummary({ SummaryTableAPI }: TableSummaryProps) {
  const [page, setPage] = useState(0);
  const [sectionFliter, setSectionFliter] = useState<Rows | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const today = dayjs();

  const filteredDataTable = useMemo(() => {
    return SummaryTableAPI.filter(
      (section) =>
        dayjs(section.create_Date).format("DD/MM/YYYY") ===
        selectedDate.format("DD/MM/YYYY")
    );
  }, [SummaryTableAPI, selectedDate]);

  const rows: Rows[] = useMemo(() => {
    return filteredDataTable.map((section) => ({
      id: section.id,
      sectionCode: section.sectionCode,
      sectionName: section.sectionName,
      employeeTotalCountShiftDay: section.sumPlanDay,
      employeeWorkCountShiftDay: section.workPlanDay,
      employeeAbsentCountShiftDay: section.absentDay,
      employeeRatioShiftDay: section.ratioDay,
      statusInfoShiftDay: section.statusMappingShiftDay,
      employeeTotalCountShiftNight: section.sumPlanNight,
      employeeWorkCountShiftNight: section.workPlanNight,
      employeeAbsentCountShiftNight: section.absentNight,
      employeeRatioShiftNight: section.ratioNight,
      statusInfoShiftNight: section.statusMappingShiftNight,
      employeeTotalSummary: section.sumPlanSummary,
      employeeWorkCountSummary: section.workPlanSummary,
      employeeAbsentCountSummary: section.absentSummary,
      employeeRatioSummary: section.ratioSummary,
      statusInfoSummary: section.statusMappingSummary,
      create_Date: section.create_Date,
    }));
  }, [filteredDataTable]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getFilteredAndPaginatedRows = useCallback(() => {
    let filteredRows = rows;
    if (sectionFliter) {
      filteredRows = rows.filter(
        (row) => row.sectionCode === sectionFliter.sectionCode
      );
    }

    filteredRows = filteredRows.filter((row) => {
      const rowDateFormatted = dayjs(row.create_Date).format("DD/MM/YYYY");
      const selectedDateFormat = dayjs(selectedDate).format("DD/MM/YYYY");
      if (rowDateFormatted === selectedDateFormat) {
        return true;
      }
      return false;
    });

    return filteredRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredDataTable, sectionFliter, page, rowsPerPage]);

  const { setDatepickerAPI } = useStoreAPI();

  useEffect(() => {
    setDatepickerAPI(selectedDate.format("DD/MM/YYYY"));
  }, [selectedDate]);

  return (
    <>
      <div className="flex m-10 gap-10 flex-col sm:flex-row">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold mb-1">เลือก Section</label>
          <Autocomplete
            className="bg-white w-full sm:w-64"
            options={rows}
            value={sectionFliter}
            onChange={(event, newValue) => {
              setSectionFliter(newValue);
            }}
            getOptionLabel={(option: Rows) => option.sectionCode.toString()}
            isOptionEqualToValue={(option, value) => {
              return option.sectionCode === value.sectionCode;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Section Code" />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.sectionCode}
                </li>
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold mb-1">
            เลือกวัน/เดือน/ปี
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="bg-white w-full sm:w-64"
              value={selectedDate}
              onChange={(newDate: any) => setSelectedDate(newDate)}
              maxDate={today}
              views={["year", "month", "day"]}
              label="date"
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
        </div>
      </div>

      <TableContainer className="w-full">
        <Table>
          {/* Table Header */}
          <TableHead className="bg-[#ECE9FD]">
            <TableRow>
              <TableCell
                align="center"
                className="font-bold whitespace-nowrap"
                colSpan={2}
                style={{
                  background:
                    "linear-gradient(135deg, #f0f4f8 0%, #D1D5DB 100%)",
                }}
              >
                Section
              </TableCell>
              <TableCell
                align="center"
                className="font-bold whitespace-nowrap border-none"
                colSpan={5}
                style={{
                  background:
                    "linear-gradient(135deg, #c9ebff 0%, #6BBEFF 100%)",
                }}
              >
                Day
              </TableCell>
              <TableCell
                align="center"
                className="font-bold whitespace-nowrap text-gray-100"
                colSpan={5}
                style={{
                  background:
                    "linear-gradient(135deg, #7475b6 0%, #3D3D63 100%)",
                }}
              >
                Night
              </TableCell>
              <TableCell
                align="center"
                className="font-bold whitespace-nowrap "
                colSpan={5}
                style={{
                  background:
                    "linear-gradient(135deg, #A7F3D0 0%, #68D391 100%)",
                }}
              >
                Total
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontSize: 12,
                  padding: "8px",
                }}
                className="font-bold whitespace-nowrap"
              >
                SectionCode
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                SectionName
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Sumplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Workplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap "
              >
                Absent
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Work%
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Reason
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap "
              >
                Sumplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap "
              >
                Workplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Absent
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Work%
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Reason
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap "
              >
                Sumplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap "
              >
                Workplan
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Absent
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Work%
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 12, padding: "8px" }}
                className="font-bold whitespace-nowrap"
              >
                Reason
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <TableBody className="bg-white">
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={20}
                  className="py-16 bg-gray-100 text-xl"
                >
                  No result ! table doesn&apos;t have any data.
                </TableCell>
              </TableRow>
            ) : (
              getFilteredAndPaginatedRows().map((rows: Rows, index: number) => (
                <TableRow
                  hover
                  key={`${rows.sectionCode}-${index}`}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell align="center">{rows.sectionCode}</TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontSize: 11 }}
                    className="balance"
                  >
                    {rows.sectionName}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeTotalCountShiftDay}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeWorkCountShiftDay}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeAbsentCountShiftDay}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeRatioShiftDay}%
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    <PopupState
                      variant="popover"
                      popupId={`popup-popover-${index}`}
                      {...usePopupState}
                    >
                      {(popupState) => (
                        <div>
                          <Button
                            {...bindTrigger(popupState)}
                            className="bg-[#ECE9FD] text-slate-700 hover:bg-[#d2cbf7] lowercase"
                            size="small"
                          >
                            details
                          </Button>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            transitionDuration={{ enter: 300, exit: 200 }}
                          >
                            {/* Popover content */}
                            {rows.statusInfoShiftDay &&
                            rows.statusInfoShiftDay.length > 0 ? (
                              <Typography sx={{ p: 1 }}>
                                <h2 className="flex justify-center mb-2 font-bold text-lg text-red-600 underline decoration-double">
                                  รายชื่อพนักงานที่ลา
                                </h2>
                                {rows.statusInfoShiftDay.map(
                                  (status, statusIndex) => (
                                    <Typography
                                      key={statusIndex}
                                      sx={{ display: "block" }}
                                    >
                                      {status}
                                    </Typography>
                                  )
                                )}
                              </Typography>
                            ) : (
                              <Typography sx={{ p: 2 }}>
                                ไม่มีพนักงานที่ลา
                              </Typography>
                            )}
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeTotalCountShiftNight}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeWorkCountShiftNight}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeAbsentCountShiftNight}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeRatioShiftNight}%
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    <PopupState
                      variant="popover"
                      popupId={`popup-popover-${index}`}
                      {...usePopupState}
                    >
                      {(popupState) => (
                        <div>
                          <Button
                            {...bindTrigger(popupState)}
                            className="bg-[#ECE9FD] text-slate-700 hover:bg-[#d2cbf7] lowercase"
                            size="small"
                          >
                            details
                          </Button>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            transitionDuration={{ enter: 300, exit: 200 }}
                          >
                            {/* Popover content */}
                            {rows.statusInfoShiftNight &&
                            rows.statusInfoShiftNight.length > 0 ? (
                              <Typography sx={{ p: 1 }}>
                                <h2 className="flex justify-center mb-2 font-bold text-lg text-red-600 underline decoration-double">
                                  รายชื่อพนักงานที่ลา
                                </h2>
                                {rows.statusInfoShiftNight.map(
                                  (status, statusIndex) => (
                                    <Typography
                                      key={statusIndex}
                                      sx={{ display: "block" }}
                                    >
                                      {status}
                                    </Typography>
                                  )
                                )}
                              </Typography>
                            ) : (
                              <Typography sx={{ p: 2 }}>
                                ไม่มีพนักงานที่ลา
                              </Typography>
                            )}
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeTotalSummary}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeWorkCountSummary}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeAbsentCountSummary}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    {rows.employeeRatioSummary}%
                  </TableCell>
                  <TableCell align="center" sx={{ padding: 1 }}>
                    <PopupState
                      variant="popover"
                      popupId={`popup-popover-${index}`}
                      {...usePopupState}
                    >
                      {(popupState) => (
                        <div>
                          <Button
                            {...bindTrigger(popupState)}
                            className="bg-[#ECE9FD] text-slate-700 hover:bg-[#d2cbf7] lowercase"
                            size="small"
                          >
                            details
                          </Button>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            transitionDuration={{ enter: 300, exit: 200 }}
                          >
                            {/* Popover content */}
                            {rows.statusInfoSummary &&
                            rows.statusInfoSummary.length > 0 ? (
                              <Typography sx={{ p: 1 }}>
                                <h2 className="flex justify-center mb-2 font-bold text-lg text-red-600 underline decoration-double">
                                  รายชื่อพนักงานที่ลา
                                </h2>
                                {rows.statusInfoSummary.map(
                                  (status, statusIndex) => (
                                    <Typography
                                      key={statusIndex}
                                      sx={{ display: "block" }}
                                    >
                                      {status}
                                    </Typography>
                                  )
                                )}
                              </Typography>
                            ) : (
                              <Typography sx={{ p: 2 }}>
                                ไม่มีพนักงานที่ลา
                              </Typography>
                            )}
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Table Pagination */}
        <TablePagination
          className="bg-white"
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredDataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}
