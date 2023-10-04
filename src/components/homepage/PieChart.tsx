"use client";
import { useMemo, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  DepartmentGroupAPI: DepartmentGroups[];
};

type DepartmentGroups = {
  id: number;
  departmentgroups: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

export default function PieChart({ DepartmentGroupAPI }: PieChartProps) {
  const totalEmployeeCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const totalEmployeeWorkCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const totalEmployeeAbsentCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeAbsentCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const data = {
    labels: ["จำนวนพนักงานที่มา", "จำนวนพนักงานที่ไม่มา"],
    datasets: [
      {
        label: "จำนวนของพนักงาน",
        data: [totalEmployeeWorkCount, totalEmployeeAbsentCount],
        backgroundColor: ["#3DD0AE", "#FF2121"],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: true,
    responsive: true,
  };

  // Register Chart.js components once on component mount using useEffect
  useEffect(() => {
    ChartJS.register(ArcElement, Tooltip, Legend);
  }, []);

  return (
    <section className="grid grid-cols-3 bg-white rounded-2xl h-full drop-shadow-lg gap-y-2 p-4 m-1 max-md:mx-2 my-0 basis-0 grow col-span-3 lg:col-span-2">
      {/* Content on the left side */}
      <article className="col-span-1 flex flex-col gap-y-10">
        <section className="flex flex-col gap-y-2">
          <h3 className="font-semibold balance">จำนวนพนักงานทั้งหมด</h3>
          <p className="font-semibold text-4xl text-blue-950">
            {totalEmployeeCount}{" "}
            <span className="font-semibold text-primary text-base ">คน</span>
          </p>
        </section>
        <section className="flex flex-col gap-y-2">
          <h3 className="font-semibold balance">จำนวนพนักงานที่มาทำงาน</h3>
          <p className="font-semibold text-4xl text-active">
            {totalEmployeeWorkCount}{" "}
            <span className="font-semibold text-primary text-base">คน</span>
          </p>
        </section>
        <section className="flex flex-col gap-y-2">
          <h3 className="font-semibold balance">จำนวนพนักงานที่ลางาน</h3>
          <p className="font-semibold text-4xl text-deactive">
            {totalEmployeeAbsentCount}{" "}
            <span className="font-semibold text-base text-primary">คน</span>
          </p>
        </section>
      </article>
      {/* Piechart container on the right side */}
      <div className="col-span-2 flex items-center justify-center">
        {/* Replace 'div' with 'figure' for semantic HTML */}
        <figure
          style={{ width: "100%", height: "200px" }}
          className="flex justify-center"
        >
          <Pie data={data} options={options} />
        </figure>
      </div>
    </section>
  );
}
