import React, { useEffect, useState, useCallback,useRef } from 'react';
import axios from 'axios';
import '../output.css';
import { TiShoppingCart } from "react-icons/ti";
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
        const existingProduct = selected.find(p => p.product_id === product.product_id);
        if (existingProduct) {
            if (existingProduct.quantity < product.product_quantity) {
                setSelected(prevSelected => prevSelected.map(p =>
                    p.product_id === product.product_id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                ));
                setTotal(prevTotal => prevTotal + product.product_price); // ✅ ย้ายมาที่นี่
            } else {
                // alert('สินค้าหมดแล้ว');
                Swal.fire({
                    title: "สินค้าหมด",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500,
                    // draggable: true
                });
            }
        } else {
            setSelected(prevSelected => [...prevSelected, { ...product, quantity: 1 }]);
            setTotal(prevTotal => prevTotal + product.product_price); // ✅ ย้ายมาที่นี่
            // setTotalPrice(prevTotalPrice => prevTotalPrice + product.product_price);
        }
        // console.log(selected);
        // console.log(selected);
    };

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
        <div className="flex w-full mx-auto p-0 gap-5 mt-8 rounded-lg">
            <div className="text-center bg-white w-full justify-center items-center mb-8 px-8 pt-8 py-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-blue-700">รายการสินค้า</h1>
                <div className='flex'>
                    <div className='flex gap-5 mt-5'>
                        <input
                            className="flex px-3 py-2 rounded-lg w-56 border border-gray-300 mb-2"
                            type="text"
                            placeholder="   ยิง Barcode ที่นี่"
                            ref={barcodeRef}
                            value={barcode}
                            maxLength={"13"}
                            onChange={(e) => setBarcode(e.target.value)}
                            // onKeyDown={(e) => {
                            //     if (e.key === 'Enter') {
                            //         const filteredProducts = products.filter(product =>
                            //             String(product.product_barcode).includes(barcode)
                            //         );
                            //         setProductsTemp(filteredProducts);
                            //         setBarcode('');
                            //     }
                            // }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const product = products.find(
                                        p => String(p.product_barcode) === barcode
                                    );

                                    if (product) {
                                        handleSelect(product); // ✅ ใส่ตะกร้าทันที
                                    } else {
                                        Swal.fire({
                                            title: 'ไม่พบสินค้า',
                                            text: 'Barcode นี้ไม่มีในระบบ',
                                            icon: 'error',
                                            timer: 1500,
                                            showConfirmButton: false
                                        });
                                    }

                                    setBarcode(''); // เคลียร์ช่อง
                                }
                            }}

                        />
                        <input
                            type="text"
                            className="flex px-3 py-2 rounded-lg w-56 border border-gray-300 mb-2"
                            placeholder="   ค้นหาสินค้า"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const filteredProducts = products.filter(product =>
                                        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                                    );
                                    setProductsTemp(filteredProducts);
                                    setSearchTerm('');
                                }
                            }}
                        />
                    </div>
                    <div className='flex gap-5 mt-5 '>
                        <select
                            className="border px-3 py-2 rounded-lg border-gray-300 mb-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            // onClick={fetchCategory}
                            onChange={(e) => {
                                const selectedCategory = e.target.value;
                                if (selectedCategory) {
                                    const filteredProducts = products.filter(product =>
                                        product.category_id === Number(selectedCategory)
                                    );
                                    setProductsTemp(filteredProducts);
                                } else {
                                    setProductsTemp(products);
                                }
                            }}
                        >
                            <option value="">ประเภทสินค้า</option>
                            {category.map((c) => (
                                <option key={c.category_id} value={c.category_id}>
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center ml-4 mt-1 border-collapse rounded-xl shadow p-0 flex-col lg:flex-row gap-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-8">
                        {productsTemp.map(product => (
                            <button
                                onClick={() => handleSelect(product)}
                            // disabled={!!selected.find(p => p.product_id === product.product_id)}
                            >
                                <div key={product.product_id} className="bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center">
                                    <img
                                        src={`http://localhost:5000/uploads/${product.image}`}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                                    />
                                    <label >{product.product_name}</label>
                                    {/* <label >รหัส: <span className="font-semibold">{product.product_id}</span></label> */}
                                    <label >{product.product_price} ฿</label>
                                    <label >{product.product_detail}</label>
                                    <label className='text-right text-sm'> มี {product.product_quantity} {product.unit_name} </label>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-125 justify-center bg-white items-center mb-8 pt-8 p-2 rounded-xl shadow-lg sticky">
                <h1 className="text-2xl text-center font-bold text-blue-700">
                    <div className='flex items-center justify-center gap-2'>
                        <TiShoppingCart />ตะกร้าสินค้า
                    </div>
                </h1>
                <div className="flex ml-4 border-collapse rounded-xl p-2 flex-col lg:flex-row gap-8 mt-5">
                    <div className="w-full lg:w-80 bg-blue-100 rounded-xl shadow-lg pt-2 px-4 border-l border-blue-200">
                        รายการสินค้า
                        <div className='bg-white mt-4 mb-3 rounded-lg'>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-4">สินค้า</th>
                                        <th className="text-left py-2 px-4">จำนวน</th>
                                        <th className="text-left py-2 px-4">ราคา</th>
                                        <th className="text-left py-2 px-4">รวม</th>
                                    </tr>
                                </thead>
                                {selected.length === 0 && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">ไม่มีสินค้าในตะกร้า</td>
                                        </tr>
                                    </tbody>
                                )}
                                <tbody>
                                    {selected.map(item => (
                                        <tr key={item.product_id}>
                                            <td className="text-life-sm  border-b p-2">{item.product_name}</td>
                                            <td className="py-2 px-4 border-b text-center">x{item.quantity}</td>
                                            <td className="text-right  border-b">{item.product_price} ฿</td>
                                            {/* <td className="text-right border-b">{item.product_price * item.quantity} ฿</td> */}
                                            <td className="text-right border-b"> {totalPrice} ฿</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mt-4 px-4">
                        <span className="text-lg font-bold">รวม</span>
                        <span className="text-lg font-bold">{Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</span>
                    </div>
                </div>

                <button
                    type="submit"
                    onClick={() => selected.length > 0 && setIsOpen(true)}
                    className="rounded-lg font-bold text-sm shadow px-4 py-4 mt-8 w-full"
                    style={{ backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#367c39';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#4CAF50';
                    }}
                >
                    ชำระเงิน
                </button>
                <button
                    onClick={(e) => handleDelete()}
                    type="submit"
                    className="rounded-lg font-bold text-sm shadow px-4 py-4 mt-1 w-full"
                    style={{ backgroundColor: '#f44336', color: 'white', cursor: 'pointer' }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#d32f2f';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f44336';
                    }}
                >
                    ยกเลิกรายการ
                </button>
            </div>
            {isOpen && total > 0 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 border-black-500 flex justify-center items-center rounded-lg"
                    style={{ backdropFilter: 'blur(5px)', borderColor: 'black' }}> {/* Changed background opacity */}
                    <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                        <Payment total={total} selected={[selected]} onClose={handleClosePopup} />
                        {/* <p className='mt-8'>****** ราคารวม : {total} ******</p> */}
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-4 right-6 bg-gray-200 text-gray-600 rounded-full w-8 h-8 text-xl flex items-center justify-center hover:bg-gray-300 transition"
                        >
                            x
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Product;