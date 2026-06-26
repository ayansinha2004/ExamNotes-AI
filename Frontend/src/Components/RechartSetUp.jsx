import React from "react";
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
];

const RechartSetUp = ({ charts }) => {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="space-y-8">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">
            {chart.title}
          </h4>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chart.type === "bar" ? (
                <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chart.data?.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : chart.type === "line" ? (
                <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : chart.type === "pie" ? (
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={chart.data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                  >
                    {chart.data?.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : null}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RechartSetUp;