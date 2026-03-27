import React, { useState } from 'react';
import axios from 'axios';
import '../output.css';

function ProfittoMonth() {
    // กำหนดค่าเริ่มต้นเป็นเดือน/ปี ปัจจุบัน
    const initialDate = new Date();
    const [month, setMonth] = useState(initialDate.getMonth() + 1);
    const [year, setYear] = useState(initialDate.getFullYear() + 543);
    const [monthlySales, setMonthlySales] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMonthChange = async (e) => {
        const value = e.target.value; // format: "YYYY-MM"
        if (!value) return;

        const [selectedYear, selectedMonth] = value.split("-");
        const monthInt = parseInt(selectedMonth, 10);
        const yearInt = parseInt(selectedYear, 10);

        // อัปเดต State สำหรับแสดงผล (พ.ศ.)
        setMonth(monthInt);
        setYear(yearInt + 543);

        try {
            setLoading(true);
            const response = await axios.get(
                `https://projectposserver-production.up.railway.app/api/sales_by_month/${selectedYear}-${selectedMonth}`
            );
            setMonthlySales(response.data.data || []);
            // console.log("👉 Sales by month response:", response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
            setMonthlySales([]);
        } finally {
            setLoading(false);
        }
    };

    // คำนวณยอดรวม
    // const totalProfit = monthlySales[0] && monthlySales[0].items ? monthlySales[0].items.reduce((total, item) => total + (item.total || 0), 0) : 0;

    return (
        <div className="max-w-md mx-auto my-8 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">รายงานกำไรรายเดือน</h2>
            
            <div className="mb-6">
                <input
                    type="month"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    onChange={handleMonthChange}
                />
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="py-4">
                {loading ? (
                    <p className="text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</p>
                ) : monthlySales.length > 0 ? (
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            ยอดขายประจำเดือน <span className="font-medium text-gray-800">{month}/{year} จำนวน {monthlySales[0].total_bill} บิล</span>
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                            {/* ฿{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
                            ฿{Number(monthlySales[0].total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500">* กำไรหลังหักค่าใช้จ่าย</p>
                        ฿{Number(monthlySales[0].profit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">ไม่มีข้อมูลยอดขายสำหรับเดือนนี้</p>
                )}
            </div>
        </div>
    );
}

export default ProfittoMonth;