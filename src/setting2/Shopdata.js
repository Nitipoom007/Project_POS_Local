import { React, useState, useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import { useNavigate } from 'react-router-dom';
import { HiUserGroup } from "react-icons/hi";
import { MdSettings } from "react-icons/md";
import { IoTrashSharp, IoPencil } from "react-icons/io5";
import Editshop from './Editshop';

function Shopdata() {
    const [shopData, setShopData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const fetchShopdata = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/shop_address');
            console.log('Shop data fetched:', response.data);
            setShopData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };

    useEffect(() => {
        fetchShopdata();
    }, []);

    const handleEditClick = (shop) => {
        setSelectedShop(shop);
        console.log('Selected Shop:', shop);
        // console.log('Selected Shop ID:', selectedShop);
        setIsOpen(true);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
        // setIsAddUserOpen(false);
        setSelectedShop(null);
    };

    return (
        <div>
            <div className="bg-white rounded-xl p-8 mx-auto overflow-x-auto flex-grow">
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center text-2xl'>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            <div className='flex justify-center items-center font-bold '>
                                <HiUserGroup className='mr-2' />&nbsp;
                                ข้อมูลร้านค้า
                            </div>
                            {/* <HiUserGroup className='mr-2' />&nbsp; */}
                        </h3>
                    </div>
                </div>
                <table className="min-w-full bg-white" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {/* <th className="py-2 px-4 border-b">ID</th> */}
                            <th className="py-2 px-4 border-b">ชื่อร้านค้า</th>
                            <th className="py-2 px-4 border-b">ที่อยู่ร้านค้า</th>
                            <th className="py-2 px-4 border-b">เบอร์โทรร้านค้า</th>
                            <th className="py-2 px-4 border-b">
                                <div className='flex justify-center items-center font-bold'>
                                    <MdSettings />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopData.map((shop) => (
                            <tr key={shop.id} className="hover:bg-gray-100">
                                {/* <td className="py-2 px-4 border-b">{shop.id}</td> */}
                                <td className="py-2 px-4 border-b text-center">{shop.shop_name}</td>
                                <td className="py-2 px-4 border-b text-center">{shop.shop_address}</td>
                                <td className="py-2 px-4 border-b text-center">{shop.shop_tel}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className='flex justify-center items-center'>
                                        <button
                                            className="bg-gray-200 border-gray-300 text-gray-800 rounded-lg px-4 py-2"
                                            onClick={() => handleEditClick(shop.shop_id)}
                                            disabled={isOpen} // Disable the button when the popup is open
                                        >
                                            <IoPencil className='text-xl' /> {/* Edit button */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isOpen && shopData && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 border-black-500 flex justify-center items-center"
                        style={{ backdropFilter: 'blur(5px)', borderColor: 'black' }}> {/* Changed background opacity */}
                        <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                            <Editshop shopID={selectedShop} onClose={handleClosePopup} />
                            {/* <p className='mt-8'>****** ShopID : {shopData.shop_id} ******</p> */}
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
        </div>

    );
}

export default Shopdata;