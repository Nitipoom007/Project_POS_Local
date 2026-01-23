import React, { useState, useEffect } from "react";
import axios from "axios";
import '../output.css';
import { VscGraphLine } from "react-icons/vsc";
import PieChartExample from "../chart/Pai";
import BarChartExample from "../chart/Bar";

function Report() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalsales, setTotalsales] = useState([]);
    const [bill, setBill] = useState([]);
    const [date, setDate] = useState(new Date());
    const [month, setMonth] = useState(date.getMonth() + 1);
    const [year, setYear] = useState(date.getFullYear() + 543);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/showproducts');
                setProducts(response.data.data || []);
            } catch (error) {
                setProducts([]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchTotalsales = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/totalsales');
                // console.log("👉 total_sales response:", response.data);
                setTotalsales(response.data.data || []);
            } catch (error) {
                setTotalsales([]);
                // console.error('Error fetching total sales:', error);
            }
        };
        fetchTotalsales();
    }, []);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/report');
                setBill(response.data.data || []);
            } catch (error) {
                setBill([]);
            }
        };
        fetchBill();
    }, []);

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split("-");
        setMonth(parseInt(month, 10));
        setYear(parseInt(year, 10) + 543);
        try {
            const fetchSalesByMonth = async () => {
                const response = await axios.get(`http://localhost:5000/api/sales_by_month/${month}-${year}`);
                console.log("👉 sales_by_month response:", response.data);
                setTotalsales(response.data.data || []);

                response.data.data.forEach(item => {
                    console.log(`Month: ${item.date}, Total Sales: ${item.total_sum}`);
                });
                
                // console.log("👉 totalsales after fetch:", totalsales);
                // setTotalsales(response.data.total_sum || []);
            };
            fetchSalesByMonth();
        } catch (error) {
            // Handle error if needed
        }
        // console.log("Selected month:", month, "Selected year:", year);
        };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg mt-8 pb-4">
            <div className="justify-between items-center mb-8 px-8 pt-8">
                <h1 className="flex text-4xl font-bold text-blue-700 gap-2">
                    <div className="text-4xl text-blue-700 mt-1">
                        <VscGraphLine />
                    </div>
                    Report
                </h1>
                <div className="flex flex-wrap mt-4">
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                        <h1 className="text-xl">สินค้าทั้งหมดภายในร้าน</h1>
                        <div className="text-2xl font-bold ">
                            <p>จำนวนสินค้า: {products.length}</p>
                        </div>
                    </div>
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                        <h1 className="text-xl">รายการบิลทั้งหมด</h1>
                        <div className="text-2xl font-bold ">
                            <p>จำนวนบิล: {bill.length}</p>
                        </div>
                    </div>
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                        <h1 className="text-xl">ยอดขายรวม</h1>
                        <div className="text-2xl font-bold ">
                            <p>{Number(totalsales.totalsales).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                        </div>
                    </div>
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3 ">
                        <h1 className="text-xl">กำไรหลักจากหักค่าใช้จ่าย</h1>
                        <div className="text-2xl font-bold text-white border border-black stocks-black-5 bg-green-400 p-2 rounded-lg">
                            <p>{Number(totalsales.totalsales).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                            {/* <p>{totalsales.map(item => item.total_sum - item.total_cost).reduce((acc, curr) => acc + curr, 0)}</p> */}
                        </div>
                    </div>
                </div>

                <input
                    type="month"
                    className="mb-4 p-2 border border-gray-300 rounded"
                    onChange={(e) => { handleMonthChange(e);
                        // const [year, month] = e.target.value.split("-");
                        // setMonth(parseInt(month, 10));
                        // setYear(parseInt(year, 10) + 543);
                        // console.log("Selected month:", month, "Selected year:", year);
                    }}
                />

            </div>
            <div className="flex flex-wrap mt-4">
                <div className="mb-8 px-8">
                    <PieChartExample />
                </div>
                <div className="mb-8 px-8">
                    <BarChartExample />
                </div>
            </div>
        </div>
    );
}

export default Report;
