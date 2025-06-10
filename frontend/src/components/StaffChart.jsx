import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#ffca28", "#66bb6a", "#ef5350"];

const StaffChart = ({ pieData }) => {
  return (
    <div className="pie-chart-wrapper">
      <PieChart width={225} height={225}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default StaffChart;
