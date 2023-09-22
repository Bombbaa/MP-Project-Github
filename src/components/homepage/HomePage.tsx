"use client";
import React, { useEffect, useMemo, useState } from "react";
import Title from "@/components/Title";
import PieChart from "@/components/homepage/PieChart";
import OverallTable from "@/components/homepage/OverallTable";
import DepartmentGroupChart from "./DepartmentGroupChart";
import DepartmentChart from "./DepartmentChart";
import MonthlyBarChart from "./MonthlyBarChart";
import YearlyLineChart from "./YearlyLineChart";
import { Navigation } from "@/components/Navigation";
type HomeProps = {
  OverallTableData: Table[];
  DepartmentGroupData: DepartmentGroup[];
  DepartmentData: Department[];
  MonthlyYearlyData: DepartmentGroupWorkMonthlyYearly[];
};

type Table = {
  id: number;
  section_Code: number;
  section_Name: string;
  employeeWorkCount: number;
  employeeSumCount: number;
};

type DepartmentGroup = {
  id: number;
  departmentgroups: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

type Department = {
  id: number;
  departments: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

interface DepartmentGroupWorkMonthlyYearly {
  departmentgroups: string;
  dailyCounts: MonthlyData[];
  monthlyAverages: number[];
}

type MonthlyData = {
  dailyCounts: number[];
  monthlyAverage: number;
};

export function Homepage({
  OverallTableData,
  DepartmentGroupData,
  DepartmentData,
  MonthlyYearlyData,
}: HomeProps) {
  return (
    <>
      <Navigation />
      <Title>Overall Dashboard</Title>
      <main className="grid-container grid grid-cols-1 md:grid-cols-6 gap-4 max-w-screen-xl">
        <PieChart DepartmentGroupAPI={DepartmentGroupData} />
        <DepartmentGroupChart DepartmentGroupAPI={DepartmentGroupData} />
        <DepartmentChart DepartmentAPI={DepartmentData} />
        <MonthlyBarChart MonthlyAPI={MonthlyYearlyData} />
        <YearlyLineChart YearlyAPI={MonthlyYearlyData} />
      </main>

      <OverallTable OverallTableAPI={OverallTableData} />
    </>
  );
}
