import { React, useState, useEffect } from 'react';
import axios from 'axios';
import '../output.css';

function Shopdata() {
    const [shopData, setShopData] = useState([]);

    const fetchShopdata = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shop_address');
            setShopData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };

    useEffect(() => {
        fetchShopdata();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ข้อมูลร้านค้า</h1>
            <ul>
                {shopData.map((shop) => (
                    <li key={shop.id} className="flex border-b py-2 gap-2">
                        <h2 className="text-xl font-semibold">{shop.shop_name}</h2>
                        <p>{shop.shop_address}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Shopdata;