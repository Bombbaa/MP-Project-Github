"use client";
import React from "react";
import Title from "@/components/Title";
import { TableSummary } from "./TableSummary";
import SummaryMonthlyChart from "./SummaryMonthly";
import SummaryShiftChart from "./SummaryShiftChart";
import { Navigation } from "@/components/Navigation";

type SummaryProps = {
  SectionData: Section[];
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

const SummaryPage = ({ SectionData }: SummaryProps) => {
  return (
    <>
      <Navigation />
      <Title>Daily Summary Report</Title>
      <main>
        <section className="grid grid-cols-1 mx-5 gap-5 lg:grid-cols-7">
          <SummaryMonthlyChart MonthlyChartAPI={SectionData} />
          <SummaryShiftChart MonthlyChartAPI={SectionData} />
        </section>
      </main>
      <section className="w-full my-10">
        <TableSummary SummaryTableAPI={SectionData} />
      </section>
    </>
  );
};

export default SummaryPage;
