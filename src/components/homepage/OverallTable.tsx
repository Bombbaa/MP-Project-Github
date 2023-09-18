"use client";
import React, { useCallback, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// import { useStoreAPI } from "../../../stores/store";

// Interface for table row
type TableCellProps = {
  sectionId: number;
  sectionCode: number;
  sectionName: string;
  employeeWork: number;
  employeeCount: number;
  status: string;
  recommend: string;
  manpowerRatio: string;
};

function TableCells(
  sectionId: number,
  sectionCode: number,
  sectionName: string,
  employeeWork: number,
  employeeCount: number
): TableCellProps {
  const status =
    employeeWork === 0 && employeeCount === 0
      ? "• Unavailable"
      : employeeWork >= employeeCount
      ? "• Complete"
      : "• Pending..";
  const recommend = employeeWork >= employeeCount ? "-" : "ต้องการคนเพิ่ม..";
  const manpowerRatio = `${employeeWork}/${employeeCount}`;
  return {
    sectionId,
    sectionCode,
    sectionName,
    employeeCount,
    employeeWork,
    status,
    recommend,
    manpowerRatio,
  };
}

interface OverallTableProps {
  OverallTableAPI: Section[];
}

interface Section {
  id: number;
  section_Code: number;
  section_Name: string;
  employeeWorkCount: number;
  employeeSumCount: number;
}

export default function OverallTable({ OverallTableAPI }: OverallTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sectionFliter, setSectionFliter] = useState<TableCellProps | null>(
    null
  );

  const generateTableCellsData = useCallback(() => {
    return OverallTableAPI.map((item) =>
      TableCells(
        item.id,
        item.section_Code,
        item.section_Name,
        item.employeeWorkCount,
        item.employeeSumCount
      )
    );
  }, [OverallTableAPI]);

  const TableCellsData = useMemo(
    () => generateTableCellsData(),
    [generateTableCellsData]
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFilteredAndPaginatedRows = () => {
    let filteredRows = TableCellsData;

    if (sectionFliter) {
      filteredRows = TableCellsData.filter(
        (row) => row.sectionCode === sectionFliter.sectionCode
      );
    }

    return filteredRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  return (
    <>
      <section className="flex flex-col gap-5 my-10">
        {/* Search inputs */}
        <div className="flex mx-10 flex-col gap-2">
          <label className="text-sm font-semibold mb-1">เลือก Section</label>
          <Autocomplete
            className="bg-white"
            options={TableCellsData}
            value={sectionFliter}
            onChange={(event, newValue) => {
              setSectionFliter(newValue);
            }}
            getOptionLabel={(option: TableCellProps) =>
              option.sectionCode.toString()
            }
            isOptionEqualToValue={(option, value) => {
              return option.sectionCode === value.sectionCode;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Section Code" />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.sectionId}>
                  {option.sectionCode}
                </li>
              );
            }}
          />
        </div>

        <TableContainer className="w-full">
          <Table>
            <TableHead className="bg-[#ECE9FD]">
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  <span className="font-bold whitespace-nowrap">
                    Section Code
                  </span>
                </TableCell>
                <TableCell align="center" colSpan={2} style={{ width: "20%" }}>
                  <span className="font-bold whitespace-nowrap">
                    Section Name
                  </span>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <span className="font-bold whitespace-nowrap">Mp Count</span>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <span className="font-bold whitespace-nowrap">Status</span>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <span className="font-bold whitespace-nowrap">Recommend</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-white">
              {getFilteredAndPaginatedRows().map(
                (row: TableCellProps, index: number) => (
                  <TableRow
                    hover
                    key={`${row.sectionCode}-${index}`}
                    className={index % 2 === 1 ? "bg-gray-100" : ""}
                  >
                    <TableCell align="center" colSpan={3}>
                      <span className=" whitespace-nowrap">
                        {row.sectionCode}
                      </span>
                    </TableCell>
                    <TableCell
                      align="left"
                      colSpan={2}
                      style={{ width: "20%" }}
                    >
                      <span className=" whitespace-nowrap">
                        {row.sectionName}
                      </span>
                    </TableCell>
                    <TableCell align="center" colSpan={1}>
                      <span className=" whitespace-nowrap bg-blue-700 text-white  rounded-md p-1">
                        {row.manpowerRatio}
                      </span>
                    </TableCell>
                    <TableCell align="center" colSpan={1}>
                      {row.employeeWork === 0 && row.employeeCount === 0 ? (
                        <span className="whitespace-nowrap bg-gray-500 text-white rounded-md p-1">
                          {row.status}
                        </span>
                      ) : row.employeeWork === row.employeeCount ? (
                        <span className="whitespace-nowrap bg-green-500 text-white rounded-md p-1">
                          {row.status}
                        </span>
                      ) : (
                        <span className="whitespace-nowrap bg-red-500 text-white rounded-md p-1">
                          {row.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="center" colSpan={1}>
                      <span className=" whitespace-nowrap">
                        {row.recommend}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>

          {/* Table Pagination */}
          <TablePagination
            className="bg-white"
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={TableCellsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </section>
    </>
  );
}
