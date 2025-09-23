import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from "qrcode";
import promptpay from 'promptpay-qr';
import logo from './img/prompt-pay-logo.png';
import Swal from 'sweetalert2';
import axios from 'axios';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import "./font/THSarabunNew-normal.js";

function Payment({ total, selected }) {
    // const { id } = useParams();
    const [product, setProduct] = useState(selected || []);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [cashMethod, setCashMethod] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const [shopaddress, setShopaddress] = useState({});
    // const navigate = useNavigate();

    // setProduct(money => [...money, ...selected]);
    const [qrImage, setQrImage] = useState("");
    const [money, setMoney] = useState(0);
    const [head, setHead] = useState("ชำระเงิน")

    const phone = "0819077307"; // เบอร์ PromptPay

    const generateQR = async () => {
        try {
            const qrData = promptpay(phone, { amount: total });
            const qr = await QRCode.toDataURL(qrData);
            setQrImage(qr);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchShop = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shop_address');
            setShopaddress(response.data.data || []);
            // console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };
    useEffect(() => {
        fetchShop();
    }, []);

    const handlePayment = (method) => {
        // Handle payment logic here
        generateQR();
        setPaymentMethod(true);
    };

    const handleCash = () => {
        setCashMethod(true);
        // setHead("ชำระแบบ เงินสด")
    }

    const handleClose = () => {
        setCashMethod(false);
        setPaymentMethod(false);
        // setProduct(selected || []);
        setMoney(0);
        setHead("ชำระเงิน")
    }

    const handleMoney = () => {
        if (money >= total) {
            const newBillNo = generateBillNo();
            setBillNo(newBillNo);

            const sum = (money - total);
            const updatedProducts = product.map(item => ({
                ...item,
                billNo: newBillNo,
                total: total,
                cash: Number(money).toFixed(2),
                paymentStatus: "paid",
                paymentMethod: "cash",
                paidDate: dateTime.toLocaleDateString("th-TH"),
                paidTime: dateTime.toLocaleTimeString("th-TH")
            }));
            // console.log(updatedProducts);
            Swal.fire({
                title: "ชำระเงินเรียบร้อย",
                text: 'เงินทอน ' + Number(sum).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' ฿',
                icon: "success",
                showConfirmButton: false,
                draggable: true,
                timer: 1500
            });
            BillItem(newBillNo);
            ReportBill(newBillNo);
            generatePDF(updatedProducts, newBillNo, shopaddress);
            // ใส่ฟังก์ชันบันทึกการชำระเงินตรงนี้
        } else {
            Swal.fire({
                title: "จำนวนเงินไม่พอ",
                icon: "error",
                showConfirmButton: false,
                draggable: true,
                timer: 1500
            });
        }
    }

    const handle_Payment = async () => {
        const newBillNo = generateBillNo();
        setBillNo(newBillNo);
        setMoney(0);

        const updatedProducts = product.map((item) => ({
            ...item,
            billNo: newBillNo,
            total: total,
            cash: 0,
            paymentStatus: "paid",
            paymentMethod: "payment",
            paidDate: dateTime.toLocaleDateString("th-TH"),
            paidTime: dateTime.toLocaleTimeString("th-TH")
        }));
        // console.log(updatedProducts);
        // console.log(shopaddress[0].shop_name);
        Swal.fire({
            title: "ชำระเงินเรียบร้อย",
            icon: "success",
            showConfirmButton: false,
            draggable: true,
            timer: 1500
        });
        BillItem(newBillNo);
        ReportBill(newBillNo);
        generatePDF(updatedProducts, newBillNo, shopaddress);
        // console.log(updatedProducts);
    }

    const [billNo, setBillNo] = useState("");

    // ฟังก์ชันสร้างเลขบิล (เช่น BILL-20250909-0001)
    const generateBillNo = () => {
        const today = new Date();
        const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20250909
        const randomPart = Math.floor(1000 + Math.random() * 9000); // ตัวเลขสุ่ม 4 หลัก
        return `BILL-${datePart}-${randomPart}`;
    };

    useEffect(() => {
        // ตั้ง interval ให้เวลาอัปเดตทุก 1 วินาที
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // cleanup ตอน component ถูก unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selected && selected.length > 0) {
            // flatten ถ้ามันเป็น array ซ้อน array
            const flat = Array.isArray(selected[0]) ? selected[0] : selected;
            setProduct(flat);
        }
    }, [selected]);


    // useEffect(() => {
    //     if (selected && selected.length > 0) {
    //         setProduct(selected);
    //     }
    // }, [selected]);


    // const BillItem = async () => {
    //     // const newBillNo = generateBillNo();
    //     const billItem = {
    //         billNo: billNo,
    //         user_id: product[0][0]?.user_id || null,
    //         products: product[0].map(item => ({
    //             product_id: item.product_id,
    //             quantity: item.quantity
    //         }))
    //     };

    //     console.log("ส่ง billItem:", billItem);

    //     try {
    //         const response = await axios.post('http://localhost:5000/api/addbillitem', billItem);
    //         console.log('บันทึกข้อมูลบิลลงใน Bill Item สำเร็จ:', response.data);
    //     } catch (error) {
    //         // console.error(error);
    //         alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล billItem: ' + error.message);
    //     }
    // };

    const BillItem = async (newBillNo) => {
        if (!newBillNo) {
            console.error("❌ ไม่มี billNo- BillItem");
            return;
        }

        if (!product || product.length === 0) {
            console.error("❌ ไม่มีสินค้า");
            return;
        }

        const billItem = {
            billNo: newBillNo,
            user_id: product[0]?.user_id ?? 1,   // ✅ ใส่ default user_id = 1
            products: product.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        };

        // console.log("👉 ส่ง billItem:", billItem);

        try {
            const response = await axios.post("http://localhost:5000/api/addbillitem", billItem);
            // console.log("✅ บันทึกข้อมูล BillItem สำเร็จ:", response.data);
        } catch (error) {
            console.error("❌ Error:", error.response?.data || error.message);
            alert("เกิดข้อผิดพลาดในการบันทึก billItem: " + (error.response?.data?.error || error.message));
        }
    };

    const ReportBill = async (newBillNo) => {
        if (!newBillNo) {
            console.error("❌ ไม่มี billNo- ReportBill");
            return;
        }

        if (!product || product.length === 0) {
            console.error("❌ ไม่มีสินค้า");
            return;
        }
        const reportData = {
            billNo: newBillNo,
            paymentStatus: "paid",
            paymentMethod: paymentMethod ? "promptpay" : "cash",
            paidDate: dateTime.toLocaleDateString("th-TH"),
            paidTime: dateTime.toLocaleTimeString("th-TH"),
            cash: Number(money),
            total: total,
        }
        // console.log("ส่ง ReportBill:", reportData);

        try {
            const response = await axios.post('http://localhost:5000/api/reportbill', reportData);
            // console.log('บันทึกข้อมูลบิลลงใน Report_Bill สำเร็จ:', response.data);
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล ReportBill: ' + error.message);
        }
    }
    //----------------------------------------------------------------------------------------------------------------
    const generatePDF = (data, billNo, Shop) => {
        const doc = new jsPDF({
            orientation: "p",   // "p" = portrait (แนวตั้ง), "l" = landscape (แนวนอน)
            unit: "mm",         // หน่วย: mm, cm, in, px, pt
            format: "a4"        // หรือจะใส่ [210, 297] ก็ได้
        });

        doc.setFontSize(18);
        doc.setFont("THSarabunNew", "normal");

        // Header ร้านค้า
        doc.setFontSize(24);
        doc.text(`${shopaddress[0].shop_name}`, 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`${shopaddress[0].shop_address}`, 105, 28, { align: "center" });
        doc.text(`โทร: ${shopaddress[0].shop_tel}`, 105, 34, { align: "center" });

        // ข้อมูลบิล
        doc.setFontSize(14);
        doc.text(`เลขที่บิล: ${billNo}`, 14, 50);
        doc.text(`วันที่: ${dateTime.toLocaleDateString("th-TH")} เวลา: ${dateTime.toLocaleTimeString("th-TH")}`, 14, 58);
        doc.text(`ชื่อลูกค้า:           `, 14, 66);
        const method = paymentMethod ? "PromptPay" : "เงินสด";
        doc.text(`ชำระแบบ: ${method}`, 160, 66);

        // doc.setFontSize(16);
        doc.text(`ลำดับ                                สินค้า                                 จำนวน                               ราคา                       รวม`, 15, 78);
        // ตารางสินค้า
        autoTable(doc, {
            startY: 80,
            // head: [["ลำดับ", "สินค้า", "จำนวน", "ราคา", "รวม"]],
            body: [
                ...data.map((item, index) => [
                    index + 1,
                    item.product_name,
                    "x" + item.quantity,
                    Number(item.product_price).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                    Number(item.quantity * item.product_price).toLocaleString('en-US', { minimumFractionDigits: 2 })
                ])
            ],
            styles: { font: "THSarabunNew", fontSize: 12, halign: "center" },
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: {
                0: { halign: "left" },
                1: { halign: "left" },
                2: { halign: "right" },
                3: { halign: "right" }
            }
        });

        const finalY = doc.lastAutoTable.finalY || 100;
        const cash = money - total;
        doc.setFontSize(14);
        doc.text(`ยอดรวมสุทธิ: ${(Number(total) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 10, { align: "right" });
        doc.text(`รับ: ${(Number(money) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 20, { align: "right" });
        doc.text(`เงินทอน: ${(method === "PromptPay" ? 0 : (Number(cash) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 30, { align: "right" });


        // Footer
        doc.setFontSize(12);
        doc.text("ขอบคุณที่ใช้บริการ", 105, finalY + 40, { align: "center" });

        doc.save(`${billNo}.pdf`);
        // doc.autoPrint();
        // window.open(doc.output('bloburl'), '_blank');
        //
        doc.output("dataurlnewwindow");

    };
    //----------------------------------------------------------------------------------------------------------------

    return (
        <div className="p-8">
            <h2 className='text-xl font-semibold'>- {head} -</h2>
            <div className='mt-4'>
                <h1 className='text-sm'>ยอดที่ต้องชำระ</h1>
                <p className='text-3xl font-bold'>-- {Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿ --</p>
            </div>

            {paymentMethod === false && cashMethod === false && (
                <div className='flex justify-center grid-cols-2 gap-4 mt-4 border-collapse rounded-lg shadow-lg p-8'>
                    <div>
                        <button className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                            onClick={() => handlePayment(total)}
                        >
                            <span className='mt-2'>PromptPay</span>
                        </button>
                    </div>

                    <div>
                        <button className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                            onClick={() => handleCash()}
                        >
                            <span className='mt-2'>เงินสด</span>
                        </button>
                    </div>
                </div>
            )}

            {paymentMethod === true && (
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-bold mb-4">สแกนเพื่อชำระเงิน</h2>
                    {/* ตรงนี้คุณใส่ QR Code หรือรายละเอียดการจ่าย */}
                    <img src={qrImage} alt="QR Code" className="mx-auto w-64 h-64" />
                    <div className='flex justify-center items-center'>
                        <img src={logo}
                            style={{ height: '70px', objectFit: 'cover' }}
                        />
                    </div>
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleClose()} // กดปิด
                    >
                        กลับไปเลือกวิธีชำระ
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            handle_Payment();
                            // generatePDF(product, billNo);
                        }}
                    // กดชำระเงิน
                    >
                        ชำระเงิน
                    </button>
                </div>
            )}

            {cashMethod === true && (
                <div className="mt-8 border-gray-300 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">เงินสด</h2>

                    <div className='gap-2 text-left'>
                        <label>รับมา : </label>
                        <input
                            type='text'
                            value={money}
                            onChange={(e) => setMoney(e.target.value)}
                        />฿
                    </div>

                    {money < total && money > 0 && (
                        <p className="text-red-500 mb-2">จำนวนเงินไม่พอ</p>
                    )}

                    {money >= total && (
                        <p className="text-green-500 mb-2">เงินทอน: {Number(money - total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                    )}
    
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleClose()} // กดปิด
                    >
                        กลับไปเลือกวิธีชำระ
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            handleMoney(money);
                            // generatePDF(product, billNo);
                        }}
                    >
                        ชำระเงิน
                    </button>
                </div>
            )}
            <p>วันที่: {dateTime.toLocaleDateString("th-TH")}</p>
            <p>เวลา: {dateTime.toLocaleTimeString("th-TH")}</p>
        </div>
    );
}

export default Payment;