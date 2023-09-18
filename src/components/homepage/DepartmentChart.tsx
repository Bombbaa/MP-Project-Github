"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useMemo } from "react";

type DepartmentProps = {
  DepartmentAPI: Departments[];
};

type Departments = {
  id: number;
  departments: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export default function DepartmentChart({ DepartmentAPI }: DepartmentProps) {
  const {
    departmentNames,
    departmentEmployeeWork,
    departmentEmployeeAbsent,
    totalEmployeeWorkCount,
  } = useMemo(() => {
    const names = DepartmentAPI.map((item: Departments) => item.departments);
    const workCounts = DepartmentAPI.map(
      (item: Departments) => item.employeeWorkCount
    );
    const absentCounts = DepartmentAPI.map(
      (item: Departments) => item.employeeAbsentCount
    );
    const totalWorkCount = DepartmentAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );

    return {
      departmentNames: names,
      departmentEmployeeWork: workCounts,
      departmentEmployeeAbsent: absentCounts,
      totalEmployeeWorkCount: totalWorkCount,
    };
  }, [DepartmentAPI]);

  const data = {
    labels: [
      "Mfg.1",
      "Mfg.2",
      "Mfg.3",
      "P Mfg.1",
      "P Mfg.2",
      "Q.A.",
      "Logistic",
    ],
    labelFullname: departmentNames,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: departmentEmployeeWork,
        backgroundColor: [
          "#22D3EE",
          "#22D3EE",
          "#22D3EE",
          "#007FFF",
          "#007FFF",
        ], // Different colors for each department
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: departmentEmployeeAbsent,
        backgroundColor: [
          "#FF1E00",
          "#FF1E00",
          "#FF1E00",
          "#FF1E00",
          "#FF1E00",
        ], // Different colors for each department
      },
    ],
  };

  const options = {
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
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
  };

  return (
    <section className="grid-box col-span-3 lg:col-span-2">
      <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานที่มาทำงานในวันนี้</span>
        <span className="font-semibold text-4xl text-active">
          {totalEmployeeWorkCount}{" "}
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
