import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import Swal from 'sweetalert2';

function Input() {
    const role = localStorage.getItem('userRole');
    const [category, setCategory] = useState([]);
    const [unit, setUnit] = useState([]);
    const [existingProducts, setExistingProducts] = useState([]);
    const [form, setForm] = useState({
        userID: role === 'admin' ? "1" : "2",
    });

    // --- 1. ประกาศฟังก์ชันทั้งหมดก่อน (ใช้ useCallback) ---
    
    const fetchCategory = useCallback(async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/category');
            setCategory(response.data.data || []);
        } catch (error) { console.error(error); }
    }, []);

    const fetchUnit = useCallback(async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/unit');
            setUnit(response.data.data || []);
        } catch (error) { console.error(error); }
    }, []);

    const fetchExistingProducts = useCallback(async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/showproducts');
            setExistingProducts(response.data.data || []);
        } catch (error) { console.error(error); }
    }, []);

    const fetchProducts = useCallback(async (productData) => {
        try {
            await axios.post('https://projectposserver-production.up.railway.app/api/addproducts', productData);
            Swal.fire({ title: "บันทึกข้อมูลสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ title: 'ผิดพลาด: ' + (error.response?.data?.error || error.message), icon: "error" });
        }
    }, []);

    // --- 2. เรียกใช้ useEffect (วางไว้หลังฟังก์ชัน) ---
    
    useEffect(() => {
        fetchExistingProducts();
        fetchCategory();
        fetchUnit();
    }, [fetchExistingProducts, fetchCategory, fetchUnit]);

    // --- 3. Event Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. ดึงข้อมูลล่าสุดจาก State มาเช็คอีกรอบ
    const currentBarcode = form.barcode;
    const found = existingProducts.find(item => item.barcode === currentBarcode);

    if (found) {
        // --- กรณีเจอสินค้าซ้ำ: คำนวณค่า ---
        const qtyOld = Number(found.quantity) || 0;
        const qtyNew = Number(form.quantity) || 0; // ค่าที่เพิ่งพิมพ์ในฟอร์ม
        
        const dataToUpdate = {
            ...form,
            quantity: qtyOld + qtyNew, 
            cost: Number(form.cost),    // ใช้ค่าใหม่จากฟอร์ม
            price: Number(form.price),  // ใช้ค่าใหม่จากฟอร์ม
            isUpdate: true              
        };

        const confirm = await Swal.fire({
            title: 'พบสินค้าเดิม!',
            text: `ต้องการเพิ่มจำนวน ${found.name} อีก ${qtyNew} หน่วย ใช่หรือไม่?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'อัปเดต',
            cancelButtonText: 'ยกเลิก'
        });

        if (confirm.isConfirmed) {
            await fetchProducts(dataToUpdate); // ส่งไปที่ API ตัวเดิม
            await fetchExistingProducts();     // ดึงข้อมูลใหม่มาเก็บในเครื่อง
            setForm({ userID: role === 'admin' ? "1" : "2" }); // ล้างฟอร์มหลังเสร็จ
        }
    } else {
        // --- สินค้าใหม่ ---
        await fetchProducts(form);
        await fetchExistingProducts();
        setForm({ userID: role === 'admin' ? "1" : "2" });
    }
};

// เมื่อพิมพ์บาร์โค้ดจนครบหรือสแกนเสร็จ ให้ดึงชื่อสินค้าเดิมมาโชว์ในฟอร์มอัตโนมัติ
useEffect(() => {
    if (form.barcode) {
        const found = existingProducts.find(item => item.barcode === form.barcode);
        if (found) {
            // ถ้าเจอ ให้เอาชื่อและข้อมูลเดิมมาใส่ในฟอร์มรอไว้เลย ยกเว้นจำนวนกับราคาที่รอเรากรอกใหม่
            setForm(prev => ({
                ...prev,
                name: found.name,
                detail: found.detail,
                categoryID: found.category_id,
                unitID: found.unit_id
                // ไม่ใส่ quantity, cost, price เพราะต้องการให้คุณกรอกค่า "ใหม่" เข้าไปเอง
            }));
        }
    }
}, [form.barcode, existingProducts]);


    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className='text-2xl font-bold text-black-700'>- เพิ่มรายการสินค้า -</h2>
            <div className="container bg-white rounded-xl shadow-lg p-8 mx-auto ">
                <div className="flex " style={{ width: '100%' }}>
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5 '>รหัสสินค้า</label>
                        <input
                            type="text"
                            name="barcode"
                            style={{ width: '200%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            placeholder="กรุณากรอกรหัสสินค้า"
                            required
                        />
                    </div>
                </div>
                <div className="flex" style={{ width: '100%' }}>
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ชื่อสินค้า</label>
                        <input
                            type="text"
                            name="name"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            placeholder="กรุณากรอกชื่อสินค้า"
                            required
                        />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ขาย</label>
                        <input
                            type="number"
                            name="price"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            placeholder="ราคาขาย"
                            required
                        />
                    </div>
                </div>
                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ต้นทุน</label>
                        <input
                            type="number"
                            name="cost"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            // value={productCost}
                            onChange={(e) => handleChange(e)}
                            placeholder="ราคาต้นทุน"
                            required
                        />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ข้อมูลสินค้า</label>
                        <input
                            type="text"
                            name="detail"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            // value={productDetail}
                            onChange={(e) => handleChange(e)}
                            placeholder="รายละเอียดสินค้า"
                            required
                        />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>วันที่เพิ่มสินค้า</label>
                        <input
                            type="date"
                            name="date"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            // value={date}
                            onChange={(e) => handleChange(e)}
                            placeholder="วันที่เพิ่มสินค้า"
                            required
                            maxLength="100"
                        />
                    </div>
                </div>

                <div className="flex">
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>จำนวนสินค้า</label>
                        <input
                            type="number"
                            name="quantity"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            // value={quantity}
                            onChange={(e) => handleChange(e)}
                            placeholder="จำนวน"
                            required
                        />
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mb-4 flex flex-col mr-2">
                        <label className='font-bold text-blue-700 mb-1 h-5'>หน่วยนับ</label>
                        <select
                            name="unitID"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            required
                            className='border-2 border-blue-300 rounded-md p-2'
                        >
                            <option value={null}>เลือกหน่วยนับ</option>
                            {unit.map((c) => (
                                <option key={c.unit_id} value={c.unit_id} >
                                    {c.unit_name}
                                </option>
                            ))}
                        </select>
                        {/* <select
                            // value={unitID}
                            type='text'
                            name="unitID"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            required
                            className='border-2 border-blue-300 rounded-md p-2'
                        >
                            <option value="null" >หน่วยนับ</option>
                            <option value="1" >กระป๋อง</option>
                            <option value="2" >ขวด</option>
                            <option value="3" >ห่อ</option>
                            <option value="4" >ชิ้น</option>
                        </select> */}
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mb-4 flex flex-col">
                        <label className='font-bold text-blue-700 mb-1 h-5'>ประเภทสินค้า</label>
                        <select
                            name="categoryID"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            onChange={(e) => handleChange(e)}
                            required
                            className='border-2 border-blue-300 rounded-md p-2'
                        >
                            <option value={null}>เลือกประเภท</option>
                            {category.map((c) => (
                                <option key={c.category_id} value={c.category_id} >
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                        {/* <select
                            // value={categoryID}
                            name="categoryID"
                            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                            type='text'
                            required
                            onChange={handleChange}
                            className='border-2 border-blue-300 rounded-md p-2'
                        >
                            <option value="null" >เลือกประเภท</option>
                            <option value="1" >เครื่องดื่ม</option>
                            <option value="2">อาหารแห้ง</option>
                            <option value="3">ขนม</option>
                            <option value="4">เครื่องปรุง</option>
                        </select> */}
                    </div>
                </div>

                <div className="flex flex-row-reverse">
                    <button
                        type="submit"
                        className="font-bold py-2 px-4 rounded ml-5"
                        style={{ backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#367c39';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#4CAF50';
                        }}
                    >
                        บันทึกข้อมูล
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        type="reset"
                        className="font-bold py-2 px-4 rounded ml-5"
                        style={{ backgroundColor: '#f44336', color: 'white', cursor: 'pointer' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c62828';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#f44336';
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setForm({});
                            fetchProducts();
                        }}
                    >
                        ล้างข้อมูล
                    </button>
                </div>
            </div>
        </form>
    );

}

export default Input;