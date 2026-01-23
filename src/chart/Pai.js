import React, { useState, useEffect, use } from 'react';
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const data = [
//   { name: 'สินค้า A', value: 400 },
//   { name: 'สินค้า B', value: 300 },
//   { name: 'สินค้า C', value: 300 },
//   { name: 'สินค้า D', value: 200 },
// ];



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function PieChartExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bill_items');
      const result = await response.data;
      setData(result.data || []);
    }
    catch (error) {
      setData([]);
    }
    setLoading(false);
  };
  fetchData();
}, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>สัดส่วนการขายสินค้า</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data.map(item => ({ name: item.name, value: item.value }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default PieChartExample;