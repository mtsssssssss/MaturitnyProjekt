"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import type { ChartSubjectItem } from "@/lib/stats";

type AttemptsChartProps = {
  data: ChartSubjectItem[];
};

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function AttemptsChart({ data }: AttemptsChartProps) {
  if (!data.length) return null;

  return (
    <div className="h-64 w-full min-h-[200px] sm:min-h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: data.length > 4 ? 56 : 24 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, textAnchor: "end" }}
            angle={data.length > 4 ? -45 : 0}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Úspešnosť"]}
            labelFormatter={(_, payload) => payload[0]?.payload?.name}
          />
          <Bar dataKey="uspesnost" radius={[4, 4, 0, 0]} maxBarSize={48} name="Úspešnosť">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
