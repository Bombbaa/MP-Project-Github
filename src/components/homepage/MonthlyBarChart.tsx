import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import { useMemo } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type MonthlyData = {
  dailyCounts: number[];
  monthlyAverage: number;
};

interface DepartmentGroupWorkMonthly {
  departmentgroups: string;
  dailyCounts: MonthlyData[];
  monthlyAverages: number[];
}

interface MonthlyBarChartProps {
  MonthlyAPI: DepartmentGroupWorkMonthly[];
}

export default function MonthlyBarchart({ MonthlyAPI }: MonthlyBarChartProps) {
  const currentDay = dayjs().date();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonthIndex = dayjs().month();

  const currentMonthDailyCounts = useMemo(
    () => MonthlyAPI.map((item) => item.dailyCounts[currentMonthIndex]),
    [MonthlyAPI, currentMonthIndex]
  );

  const dailyCountsArrays = useMemo(
    () => currentMonthDailyCounts.map((item) => item.dailyCounts),
    [currentMonthDailyCounts]
  );

  const dailyCountsArraysLength = useMemo(
    () => dailyCountsArrays[0].length,
    [dailyCountsArrays]
  );

  const dailyCountsSummary = useMemo(() => {
    const summary = new Array(dailyCountsArraysLength).fill(0);
    for (let i = 0; i < dailyCountsArraysLength; i++) {
      for (let j = 0; j < dailyCountsArrays.length; j++) {
        summary[i] += dailyCountsArrays[j][i];
      }
    }
    return summary;
  }, [dailyCountsArrays, dailyCountsArraysLength]);

  const employeeWorkMonthly = useMemo(
    () => MonthlyAPI.map((item) => item.monthlyAverages),
    [MonthlyAPI]
  );

  const summedWorkDaily = useMemo(() => {
    const summed = employeeWorkMonthly[0].map(() => 0);
    for (const matrix of employeeWorkMonthly) {
      for (let i = 0; i < matrix.length; i++) {
        summed[i] += matrix[i];
      }
    }
    return summed;
  }, [employeeWorkMonthly]);

  // Create an array of data values, set the value to null for days that haven't happened yet
  const labelMonthly = Array.from({ length: daysInMonth }, (_, index) => {
    if (index + 1 <= currentDay) {
      return dayjs()
        .date(index + 1)
        .format("DD / MM / YYYY");
    } else {
      return null;
    }
  });

  const data = {
    labels: labelMonthly,
    datasets: [
      {
        label: "จำนวนของพนักงานที่เข้าทำงานเฉลี่ยต่อเดือน",
        data: dailyCountsSummary,
        backgroundColor: "#40e0d0",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 40,
        },

        fullSize: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          // Use the callback function to customize the tick values
          callback: (index: number) => {
            if (
              index === 0 ||
              index === Math.floor(labelMonthly.length / 2) ||
              index === labelMonthly.length - 1
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
        grid: {
          display: false,
        },
      },
    },

    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
    height: 300, // Set the height of the canvas
  };

  return (
    <section className="grid-box col-span-3">
      <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานเข้างานเฉลี่ย</span>
        <span className="font-semibold text-4xl text-active">
          {summedWorkDaily[currentMonthIndex]}{" "}
          <span className="font-semibold text-primary text-base">คนต่อวัน</span>
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div style={{ width: "100%", height: "300px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
