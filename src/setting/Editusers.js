import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../output.css';
import Swal from 'sweetalert2';

function Editusers({ userId, onClose }) {

    // const [id, setId] = useState(user?.user_id);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);

    // โหลดข้อมูลผู้ใช้
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/getuser/${userId}`);
                const userData = response.data.data;

                setUsername(userData.user_name);
                setEmail(userData.user_email);
                setPhone(userData.user_tel);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);




    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบเบอร์โทร
        if (!/^[0-9]{10}$/.test(phone)) {
            alert('กรุณากรอกเบอร์โทรให้ถูกต้อง 10 หลัก');
            return;
        }

        const updatedData = {
            password,
            phone
        };

        try {
            await axios.put(`http://localhost:3001/api/updateuser/${userId}`, updatedData);
            // alert('อัปเดตข้อมูลสำเร็จ');
            setPassword('');
            onClose(); // Close the popup after successful update
            Swal.fire({
                title: "อัปเดตข้อมูลสำเร็จ",
                icon: "success",
                showCancelButton: false,
                timer: 1500,
                draggable: true
            });
        } catch (error) {
            console.error('Error updating user:', error);
            // alert('เกิดข้อผิดพลาด');
            Swal.fire({
                title: 'เกิดข้อผิดพลาด: ' + error.message,
                icon: "error",
                showCancelButton: false,
                timer: 1500,
                draggable: true
            });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">
                แก้ไขข้อมูลผู้ใช้
            </h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-6">

                {/* Username (แก้ไม่ได้) */}
                <div>
                    <label className="block font-bold text-blue-700 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        readOnly
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email (แก้ไม่ได้) */}
                <div>
                    <label className="block font-bold text-blue-700 mb-2">
                        Email
                    </label>
                    <input
                        type="text"
                        value={email}
                        readOnly
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password (แก้ได้) */}
                <div>
                    <label className="block font-bold text-blue-700 mb-2">
                        เปลี่ยนรหัสผ่าน
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านใหม่ (ถ้าไม่เปลี่ยนให้เว้นว่าง)"
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Phone (แก้ได้) */}
                <div>
                    <label className="block font-bold text-blue-700 mb-2">
                        เบอร์โทรศัพท์
                    </label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setPhone(value);
                        }}
                        maxLength="10"
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    บันทึกการแก้ไข
                </button>
                {/* <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                    >
                        บันทึกข้อมูล
                    </button>
                </div> */}
            </form>
        </div>
    );
}

export default Editusers;
