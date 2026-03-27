import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../output.css';

function EditProduct({ pdId, onClose }) {
    const [productId, setProductId] = useState(pdId);

    const [form, setForm] = useState({
        name: '',
        price: '',
        cost: '',
        detail: '',
        date: '',
        quantity: '',
        unit: '',
        category: ''
    });

    // ✅ ดึงข้อมูลสินค้าตัวเดียว
    const fetchProduct = useCallback(async () => {
        try {
            const res = await axios.get(`https://projectposserver-production.up.railway.app/api/getproduct/${productId}`);
            const data = res.data.data;

            setForm({
                name: data.product_name,
                price: data.product_price,
                cost: data.product_cost,
                detail: data.product_detail,
                date: data.date?.split("T")[0],
                quantity: data.product_quantity,
                unit: data.unit_name,
                category: data.category_name
            });
        } catch (err) {
            console.error(err);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ✅ update เฉพาะ 3 ค่า
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://projectposserver-production.up.railway.app/api/updateproduct/${productId}`, {
                price: form.price,
                cost: form.cost,
                quantity: form.quantity
            });

            Swal.fire({
                title: "อัพเดทสำเร็จ",
                icon: "success",
                timer: 1500
            });

        } catch (err) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: err.message,
                icon: "error"
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className='text-2xl font-bold text-black-700'>- แก้ไขรายการสินค้า -</h2>

            <div className="container bg-white rounded-xl shadow-lg p-8 mx-auto ">

                {/* ชื่อสินค้า + ราคาขาย */}
                <div className="flex" style={{ width: '100%' }}>
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ชื่อสินค้า</label>
                        <input type="text" value={form.name} readOnly style={inputStyle} />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ขาย</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} style={inputStyle} required />
                    </div>
                </div>

                {/* ต้นทุน */}
                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ต้นทุน</label>
                        <input type="number" name="cost" value={form.cost} onChange={handleChange} style={inputStyle} required />
                    </div>
                </div>

                {/* รายละเอียด + วันที่ */}
                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ข้อมูลสินค้า</label>
                        <input type="text" value={form.detail} readOnly style={inputStyle} />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>วันที่เพิ่มสินค้า</label>
                        <input type="date" value={form.date} readOnly style={inputStyle} />
                    </div>
                </div>

                {/* จำนวน + หน่วย + ประเภท */}
                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>จำนวนสินค้า</label>
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} style={inputStyle} required />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>หน่วยนับ</label>
                        <input type="text" value={form.unit} readOnly style={inputStyle} />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ประเภทสินค้า</label>
                        <input type="text" value={form.category} readOnly style={inputStyle} />
                    </div>
                </div>

                {/* ปุ่ม */}
                <div className="flex flex-row-reverse">
                    <button
                        type="submit"
                        className="font-bold py-2 px-4 rounded ml-5"
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                    >
                        บันทึกข้อมูล
                    </button>
                </div>

            </div>
        </form>
    );
}

const inputStyle = {
    width: '100%',
    height: '35px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '5px'
};

export default EditProduct;
