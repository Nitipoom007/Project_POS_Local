import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { name: "มกราคม", sales: 4000 },
  { name: "กุมภาพันธ์", sales: 3000 },
  { name: "มีนาคม", sales: 5000 },
  { name: "เมษายน", sales: 4500 },
];

function BarChartExample() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>ยอดขายรายเดือน</h2>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default BarChartExample;