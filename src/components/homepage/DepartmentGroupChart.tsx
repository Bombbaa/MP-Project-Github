"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import React, { useMemo, useEffect } from "react";
// import { useStoreAPI } from "../../../stores/store";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type DepartmentGroupProps = {
  DepartmentGroupAPI: DepartmentGroups[];
};

type DepartmentGroups = {
  id: number;
  departmentgroups: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

export default function DepartmentGroupChart({
  DepartmentGroupAPI,
}: DepartmentGroupProps) {
  const {
    departmentGroupNames,
    departmentGroupEmployeeWork,
    departmentGroupEmployeeAbsent,
    employeeWorkCount,
  } = useMemo(() => {
    const names = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.departmentgroups
    );
    const workCounts = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.employeeWorkCount
    );
    const absentCounts = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.employeeAbsentCount
    );
    const totalWorkCount = DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );

    return {
      departmentGroupNames: names,
      departmentGroupEmployeeWork: workCounts,
      departmentGroupEmployeeAbsent: absentCounts,
      employeeWorkCount: totalWorkCount,
    };
  }, [DepartmentGroupAPI]);

  const data = {
    labels: ["Mfg.", "Parts Mfg.", "Q.A.", "Logistic"],
    labelFullname: departmentGroupNames,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: departmentGroupEmployeeWork,
        backgroundColor: "#3DD0AE",
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: departmentGroupEmployeeAbsent,
        backgroundColor: "#FF2121",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // This callback function is used to customize the tooltip label for each data point
          label: (context: any) => {
            const datasetLabel = context.dataset.label || "";

            const value = context.parsed.y || 0;

            // Get the corresponding fullname from the labelFullname array
            const fullname = data.labelFullname[context.dataIndex];

            // Modify the tooltip label to include the fullname
            return `${fullname} ${datasetLabel}: ${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
  };

  // Register Chart.js components once on component mount using useEffect
  useEffect(() => {
    ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  }, []);
  return (
    <section className="grid-box col-span-3 lg:col-span-2">
      <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานที่มาทำงานในวันนี้</span>
        <span className="font-semibold text-4xl text-active">
          {employeeWorkCount}{" "}
          <span className="font-semibold text-primary text-base">คน</span>
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div style={{ width: "100%", height: "300px" }}>
          <Bar data={data} options={options} style={{ width: "100%" }} />
        </div>
      </div>
    </section>
  );
}
