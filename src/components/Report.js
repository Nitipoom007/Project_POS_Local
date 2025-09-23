import React, { useState, useEffect } from "react";
import axios from "axios";
import '../output.css';
import { VscGraphLine } from "react-icons/vsc";

function Report() {
    // const [reportData, setReportData] = useState([]);

    // useEffect(() => {
    //     const fetchReportData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/api/report');
    //             setReportData(response.data.data || []);
    //         } catch (error) {
    //             console.error('Error fetching report data:', error);
    //         }
    //     };

    //     fetchReportData();
    // }, []);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalsales, setTotalsales] = useState(0);
    const [bill, setBill] = useState([]);


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
                        <div className="text-2xl font-bold text-green-600">
                            <p>จำนวนสินค้า: {products.length}</p>
                        </div>
                    </div>
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                        <h1 className="text-xl">รายการบิลทั้งหมด</h1>
                        <div className="text-2xl font-bold text-green-600">
                            <p>จำนวนบิล: {bill.length}</p>
                        </div>
                    </div>
                    <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                        <h1 className="text-xl">ยอดขายรวม</h1>
                        <div className="text-2xl font-bold text-green-600">
                            <p>{Number(totalsales.totalsales).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
