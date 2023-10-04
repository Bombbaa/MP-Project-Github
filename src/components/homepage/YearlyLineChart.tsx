"use client";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartOptions,
} from "chart.js";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

type MonthlyData = {
  dailyCounts: number[];
  monthlyAverage: number;
};

type DepartmentGroupWorkYearly = {
  departmentgroups: string;
  dailyCounts: MonthlyData[];
  monthlyAverages: number[];
};

type YearlyLineChartProps = {
  YearlyAPI: DepartmentGroupWorkYearly[];
};

export default function YearlyLineChart({ YearlyAPI }: YearlyLineChartProps) {
  const currentYear = dayjs().year(); // ปีปัจจุบัน
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const summedWorkDaily = useMemo(() => {
    const employeeWorkMonthly = YearlyAPI.map(
      (item: DepartmentGroupWorkYearly) => item.monthlyAverages
    );

    // สร้าง array ขึ้นมารองรับข้อมูลจำนวนพนักงานที่มาทำงาน
    const summedWorkDaily = employeeWorkMonthly[0].map(() => 0);

    // loop ใส่ข้อมูลพนักงานทุกๆ departmentgroup ให้อยู่ใน array เดียว
    // Loop through each matrix and add the corresponding values
    for (const matrix of employeeWorkMonthly) {
      for (let i = 0; i < matrix.length; i++) {
        summedWorkDaily[i] += matrix[i];
      }
    }

    return summedWorkDaily;
  }, [YearlyAPI]);

  // คำนวณค่าอื่นๆ และแปลงผลลัพธ์ให้กลายเป็น memoized value โดยใช้ useMemo
  const nonZeroCounts = useMemo(() => {
    return summedWorkDaily.some((count) => count !== 0)
      ? summedWorkDaily.filter((count) => count !== 0).length
      : 0;
  }, [summedWorkDaily]);

  const totalWorkCounts = useMemo(() => {
    return summedWorkDaily.reduce((sum, count) => sum + count, 0);
  }, [summedWorkDaily]);

  const averageWorkCount = useMemo(() => {
    return nonZeroCounts > 0 ? Math.floor(totalWorkCounts / nonZeroCounts) : 0;
  }, [nonZeroCounts, totalWorkCounts]);

  const monthYearArray = months.map((month) => `${month} ${currentYear}`);

  const data = {
    labels: months,
    labelFullname: monthYearArray,
    datasets: [
      {
        label: "จำนวนของพนักงานที่เข้าทำงานเฉลี่ยต่อเดือน",
        data: summedWorkDaily,
        backgroundColor: "#3DD0AE",
        borderColor: "#40e0d0",
        tension: 0.2,
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
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        min: 0,
      },
    },
    elements: {
      line: {
        fill: true,
        backgroundColor: "rgba(52, 211, 153, 0.2)", // Add the background color here
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <section className="grid-box col-span-3">
      <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานเข้างานเฉลี่ย</span>
        <span className="font-semibold text-4xl text-active">
          {averageWorkCount}{" "}
          <span className="font-semibold text-primary text-base">
            คนต่อเดือน
          </span>
        </span>
      </div>
      <div className="flex justify-center items-center mb-2">
        <div style={{ width: "100%", height: "300px" }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
