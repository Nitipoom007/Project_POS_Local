import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import '../output.css';
import { TiShoppingCart } from "react-icons/ti";
import { IoTrashSharp, IoPencil } from "react-icons/io5";
import Payment from '../Products/Payment';
import Swal from 'sweetalert2';

function Product() {
    const [products, setProducts] = useState([]);
    const [productsTemp, setProductsTemp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [barcode, setBarcode] = useState('');
    const [category, setCategory] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [barcodeBuffer, setBarcodeBuffer] = useState('');


    useEffect(() => {
        let timer = null;

        const handleKeyDown = (e) => {
            // ❌ ไม่ดักตอนพิมพ์ใน input / textarea
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            // เมื่อ scanner ส่ง Enter
            if (e.key === 'Enter') {
                if (barcodeBuffer.length > 0) {
                    const product = products.find(
                        p => String(p.product_barcode) === barcodeBuffer
                    );

                    if (product) {
                        handleSelect(product);
                    } else {
                        Swal.fire({
                            title: 'ไม่พบสินค้า',
                            text: `Barcode: ${barcodeBuffer}`,
                            icon: 'error',
                            timer: 1200,
                            showConfirmButton: false
                        });
                    }

                    setBarcodeBuffer('');
                }
                return;
            }

            // เก็บเฉพาะตัวอักษร
            if (/^[0-9a-zA-Z]$/.test(e.key)) {
                setBarcodeBuffer(prev => prev + e.key);

                // reset ถ้าพิมพ์ห่างเกิน (ป้องกันพิมพ์มือ)
                clearTimeout(timer);
                timer = setTimeout(() => {
                    setBarcodeBuffer('');
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcodeBuffer, products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/showproducts');
                setProducts(response.data.data || []);
                setProductsTemp(response.data.data || []);
            } catch (error) {
                setProducts([]);
                // setProductsTemp([]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/category');
                setCategory(response.data.data || []);
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        fetchCategory();
    }, []);

    // เพิ่มสินค้าเข้า selected
    const handleSelect = (product) => {

    // 1️⃣ เช็ค stock ก่อนทำอะไรทั้งหมด
    if (product.product_quantity <= 0) {
        Swal.fire({
            title: "สินค้าหมด",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
        });
        return; // ❗ หยุดการทำงานทันที
    }

    // 2️⃣ เช็คว่ามีสินค้าในตะกร้าแล้วไหม
    const existingProduct = selected.find(
        p => p.product_id === product.product_id
    );

    // 3️⃣ กรณีมีสินค้าอยู่แล้ว
    if (existingProduct) {

        // 3.1 เช็คว่าเกิน stock หรือยัง
        if (existingProduct.quantity >= product.product_quantity) {
            Swal.fire({
                title: "สินค้าหมด",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // 3.2 เพิ่มจำนวน
        setSelected(prev =>
            prev.map(p =>
                p.product_id === product.product_id
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            )
        );

        setTotal(prev => prev + product.product_price);

    } else {

        // 4️⃣ กรณียังไม่มีในตะกร้า
        setSelected(prev => [
            ...prev,
            { ...product, quantity: 1 }
        ]);

        setTotal(prev => prev + product.product_price);
    }
};

    // const handleSelect = (product) => {
    //     const existingProduct = selected.find(p => p.product_id === product.product_id);
    //     if (existingProduct) {
    //         if (existingProduct.quantity < product.product_quantity) {
    //             setSelected(prevSelected => prevSelected.map(p =>
    //                 p.product_id === product.product_id 
    //                     ? { ...p, quantity: p.quantity + 1 }
    //                     : p
    //             ));
    //             setTotal(prevTotal => prevTotal + product.product_price); // ✅ ย้ายมาที่นี่
    //         } else {
    //             // alert('สินค้าหมดแล้ว');
    //             Swal.fire({
    //                 title: "สินค้าหมด",
    //                 icon: "warning",
    //                 showConfirmButton: false,
    //                 timer: 1500,
    //                 // draggable: true
    //             });
    //         }
    //     } else {
    //         setSelected(prevSelected => [...prevSelected, { ...product, quantity: 1 }]);
    //         setTotal(prevTotal => prevTotal + product.product_price); // ✅ ย้ายมาที่นี่
    //         // setTotalPrice(prevTotalPrice => prevTotalPrice + product.product_price);
    //     }
    //     // console.log(selected);
    //     // console.log(selected);
    // };

    // ลบสินค้าออกจาก selected
    const handleRemove = (product_id) => {
        const product = selected.find(p => p.product_id === product_id);
        if (product) {
            setTotal(prevTotal => prevTotal - (product.product_price * product.quantity));
        }
        setSelected(selected.filter(p => p.product_id !== product_id));
    };

    const handleDelete = () => {
        setSelected([]);
        setTotal(0);
        setTotalPrice(0);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
        setSelected([]);
        setTotal(0);
        setTotalPrice(0);
        // setProduct([]);
        // setTotal(0);
        // setSelectedUser(null);
    };
    const barcodeRef = useRef(null);

    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);


    return (
       <div className="flex w-full mx-auto p-4 justify-center mt-8">
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-blue-600 py-6">
            <h1 className="text-2xl text-center font-bold text-white flex items-center justify-center gap-3">
                <TiShoppingCart className="text-3xl" />
                ตะกร้าสินค้า
            </h1>
        </div>

        <div className="p-6">
            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-4 px-4 font-semibold">สินค้า</th>
                            <th className="py-4 px-4 font-semibold text-center">จำนวน</th>
                            <th className="py-4 px-4 font-semibold text-right">ราคา/ชิ้น</th>
                            <th className="py-4 px-4 font-semibold text-right">รวม</th>
                            <th className="py-4 px-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {selected.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-400 italic">
                                    ไม่มีสินค้าในตะกร้า
                                </td>
                            </tr>
                        ) : (
                            selected.map((item) => (
                                <tr key={item.product_id} className="hover:bg-blue-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-gray-800">{item.product_name}</td>
                                    <td className="py-4 px-4 text-center text-gray-600">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                            x{item.quantity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right text-gray-600">
                                        {Number(item.product_price).toLocaleString()} ฿
                                    </td>
                                    <td className="py-4 px-4 text-right font-bold text-blue-600">
                                        {(item.product_price * item.quantity).toLocaleString()} ฿
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => handleRemove(item.product_id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all"
                                            title="ลบสินค้า"
                                        >
                                            <IoTrashSharp size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">ยอดรวมสุทธิ</span>
                    <span className="text-3xl font-extrabold text-blue-700">
                        {Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button
                    onClick={() => handleDelete()}
                    className="order-2 sm:order-1 w-full py-4 px-6 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                    ยกเลิกรายการ
                </button>
                <button
                    onClick={() => selected.length > 0 && setIsOpen(true)}
                    disabled={selected.length === 0}
                    className={`order-1 sm:order-2 w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${
                        selected.length > 0 
                        ? 'bg-green-500 hover:bg-green-600 hover:shadow-green-200 transform hover:-translate-y-0.5' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    ชำระเงิน
                </button>
            </div>
        </div>
    </div>

    {/* Payment Modal */}
    
    {isOpen && total > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClosePopup}></div>
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={handleClosePopup}
                    className="absolute top-5 right-5 z-20 bg-gray-100 text-gray-500 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
                >
                    ✕
                </button>
                <div className="p-8">
                    <Payment total={total} selected={selected} onClose={handleClosePopup} />
                </div>
            </div>
        </div>
    )}
</div>
    );
}

export default Product;