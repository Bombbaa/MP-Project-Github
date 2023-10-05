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
import dayjs from "dayjs";
import { useStoreAPI } from "../../../stores/store";

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

export default function SummaryShiftChart({
  MonthlyChartAPI,
}: MonthlyChartProps) {
  const { datepickerAPI } = useStoreAPI();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonth = dayjs().month();

  const parts = datepickerAPI.split("/");
  const day = parseInt(parts[0], 10);

  // Filter summary data for the current month
  const filteredSummaryAPI = useMemo(() => {
    return MonthlyChartAPI.filter((sectionResult) => {
      const resultMonth = dayjs(sectionResult.create_Date).month();
      return resultMonth === currentMonth;
    });
  }, [MonthlyChartAPI, currentMonth]);

  const filteredDailyData = useMemo(() => {
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      created_Date: dayjs()
        .date(index + 1)
        .format("YYYY-MM-DD"),
      workplanDay: 0,
      absentDay: 0,
      workplanNight: 0,
      absentNight: 0,
    }));

    filteredSummaryAPI.forEach((sectionResult) => {
      const dayIndex = dayjs(sectionResult.create_Date).date() - 1;

      data[dayIndex].workplanDay += sectionResult.workPlanDay;
      data[dayIndex].absentDay += sectionResult.absentDay;
      data[dayIndex].workplanNight += sectionResult.workPlanNight;
      data[dayIndex].absentNight += sectionResult.absentNight;
    });

    return data;
  }, [filteredSummaryAPI, daysInMonth]);

  // Define the data and options variables
  const data = {
    labels: ["Day", "Night"],
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: [
          filteredDailyData[day - 1]?.workplanDay || 0,
          filteredDailyData[day - 1]?.workplanNight || 0,
        ],
        backgroundColor: "#3DD0AE",
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: [
          filteredDailyData[day - 1]?.absentDay || 0,
          filteredDailyData[day - 1]?.absentNight || 0,
        ],
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
    <div className="col-span-1 p-5 bg-white rounded-2xl flex-1 drop-shadow-lg md:col-span-2">
      <h2 className="text-center text-2xl font-bold my-4">{datepickerAPI}</h2>
      <Bar data={data} options={options} height={421} />
    </div>
  );
}
