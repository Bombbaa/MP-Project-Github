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
import React, { useMemo, useEffect } from "react";
import { useStoreAPI } from "../../../stores/store";
import dayjs from "dayjs";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type MonthlyChartProps = {
  MonthlyChartAPI: Section[];
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

export default function SummaryMonthlyChart({
  MonthlyChartAPI,
}: MonthlyChartProps) {
  const { datepickerAPI } = useStoreAPI();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonth = dayjs().month(); // ต้อง import dayjs ในโค้ดก่อน

  const parts = datepickerAPI.split("/");
  const day = parseInt(parts[0], 10);

  const filteredSummaryAPI = useMemo(() => {
    return MonthlyChartAPI.filter((sectionResult) => {
      const resultMonth = dayjs(sectionResult.create_Date).month();
      return resultMonth === currentMonth;
    });
  }, [MonthlyChartAPI, currentMonth]);

  const filteredDailyData = useMemo(() => {
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      date: dayjs()
        .date(index + 1)
        .format("YYYY-MM-DD"),
      sumPlan: 0,
      workPlan: 0,
      absent: 0,
    }));

    filteredSummaryAPI.forEach((sectionResult) => {
      const dayIndex = dayjs(sectionResult.create_Date).date() - 1;

      data[dayIndex].sumPlan += sectionResult.sumPlanSummary;
      data[dayIndex].workPlan += sectionResult.workPlanSummary;
      data[dayIndex].absent += sectionResult.absentSummary;
    });

    return data;
  }, [filteredSummaryAPI, daysInMonth]);

  const getLabelMonthly = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      if (index + 1 <= day) {
        return dayjs()
          .date(index + 1)
          .format("DD / MM / YYYY");
      } else {
        return null;
      }
    });
  }, [day, daysInMonth]);

  const data = {
    labels: getLabelMonthly,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: filteredDailyData.map((entry) => entry.workPlan),
        backgroundColor: "#3DD0AE",
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: filteredDailyData.map((entry) => entry.absent),
        backgroundColor: "#FF2121",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (index: any) => {
            if (
              index === 0 ||
              index === Math.floor(getLabelMonthly.length / 2) ||
              index === getLabelMonthly.length - 1
            ) {
              const currentDate = dayjs()
                .date(index + 1)
                .format("DD/MM/YYYY");

              return currentDate;
            } else {
              return null;
            }
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
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="col-span-1 p-5 bg-white rounded-2xl flex-1 drop-shadow-lg md:col-span-5">
      <h2 className="text-center text-2xl font-bold my-4">
        รายงานสรุปการมาทำงานประจำเดือน
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
