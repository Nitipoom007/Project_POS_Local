import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import Swal from 'sweetalert2';
import { MdSettings } from 'react-icons/md'
import { HiUserGroup } from "react-icons/hi";
import { IoTrashSharp, IoPencil } from "react-icons/io5";

import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Editusers from './Editusers';
import Adduser from './Manageuser';

function Showusers() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const [isOpen, setIsOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/showusers');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsOpen(true);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
        setIsAddUserOpen(false);
        setSelectedUser(null);
    };

    return (
        <div >
            {/* <Adduser /> */}
            <div className="bg-white rounded-xl p-8 mx-auto overflow-x-auto flex-grow">
                {/* <h3 className="text-xl font-semibold text-gray-800 mb-4"> */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center text-2xl'>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            <div className='flex justify-center items-center font-bold '>
                                <HiUserGroup className='mr-2' />&nbsp;
                                รายชื่อผู้ใช้งาน
                            </div>
                            {/* <HiUserGroup className='mr-2' />&nbsp; */}
                        </h3>
                    </div>
                    <div className='flex items-center'>
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
                            onClick={() => setIsAddUserOpen(true)}
                        >
                            {/* {isAddUserOpen ? 'ปิด' : 'เพิ่มผู้ใช้งาน'} */}
                            Add user
                        </button>
                    </div>
                {/* </h3> */}
                </div>
                <table className="min-w-full bg-white" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {/* <th className="py-2 px-4 border-b">id</th> */}
                            <th className="py-2 px-4 border-b">ชื่อผู้ใช้งาน</th>
                            <th className="py-2 px-4 border-b">อีเมล</th>
                            <th className="py-2 px-4 border-b">ที่อยู่</th>
                            <th className="py-2 px-4 border-b">หมายเลขโทรศัพท์</th>
                            <th className="py-2 px-4 border-b">สถานะ</th>
                            <th className="py-2 px-4 border-b">
                                <div className='flex justify-center items-center font-bold'>
                                    <MdSettings />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                {/* <td className="py-2 px-4 border-b">{user.user_id}</td> */}
                                <td className="py-2 px-4 border-b">{user.user_firstname}</td>
                                <td className="py-2 px-4 border-b">{user.user_email}</td>
                                <td className="py-2 px-4 border-b">{user.user_address}</td>
                                <td className="py-2 px-4 border-b">{user.user_tel}</td>
                                <td className="py-2 px-4 border-b">{user.user_status}</td>
                                <td className="flex py-2 px-4 border-b">

                                    <button
                                        className="bg-gray-200 border-gray-300 text-gray-800 rounded-lg px-4 py-2"
                                        onClick={() => handleEditClick(user)}
                                        disabled={isOpen} // Disable the button when the popup is open
                                    >
                                        <IoPencil className='text-xl' /> {/* Edit button */}
                                    </button>

                                    &nbsp;&nbsp;&nbsp;

                                    <button className="bg-red-500 border-red-700 text-white rounded-lg px-4 py-2"
                                        onClick={async () => {
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Yes, delete it!"
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    try {
                                                        axios.delete(`http://localhost:5000/api/deleteuser/${user.user_id}`);
                                                        //  fetchProducts(); // ✅ อัปเดตข้อมูลใหม่
                                                        Swal.fire({
                                                            title: "Deleted!",
                                                            text: "Your file has been deleted.",
                                                            icon: "success"
                                                        });
                                                    } catch (error) {
                                                        console.error('Error deleting product:', error);
                                                        Swal.fire({
                                                            title: "Error!",
                                                            text: "ไม่สามารถลบข้อมูลผู้ใช้งานได้",
                                                            icon: "error"
                                                        });
                                                    }
                                                    fetchUsers();
                                                }
                                            });
                                            // if (window.confirm('คุณต้องการลบผู้ใช้คนนี้หรือไม่?')) {
                                            //     try {
                                            //         await axios.delete(`http://localhost:5000/api/deleteuser/${user.user_id}`);
                                            //         setUsers(prevUsers => prevUsers.filter(u => u.user_id !== user.user_id));
                                            //         alert('ลบข้อมูลผู้ใช้สำเร็จ');
                                            //     } catch (error) {
                                            //         console.error('Error deleting user:', error);
                                            //         alert('เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้');
                                            //     }
                                            // }
                                        }}
                                        disabled={isOpen} // Disable the button when the popup is open
                                    >
                                        <IoTrashSharp className='text-xl' /> {/* Delete button */}
                                        {console.log(user.user_id)}
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 border-black-500 flex justify-center items-center"
                        style={{ backdropFilter: 'blur(5px)', borderColor: 'black' }}> {/* Changed background opacity */}
                        <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                            <Editusers user={selectedUser} onClose={handleClosePopup} />
                            <p className='mt-8'>****** UserID : {selectedUser.user_id} ******</p>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-6 bg-gray-200 text-gray-600 rounded-full w-8 h-8 text-xl flex items-center justify-center hover:bg-gray-300 transition"
                            >
                                x
                            </button>
                        </div>
                    </div>
                )}
                {isAddUserOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 border-black-500 flex justify-center items-center"
                        style={{ backdropFilter: 'blur(5px)', borderColor: 'black' }}> {/* Changed background opacity */}
                        <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                           <h2 className='text-2xl font-bold text-black-700'>- เพิ่มข้อมูลผู้ใช้งาน -</h2>
                            <Adduser onClose={handleClosePopup} />
                            {/* <p className='mt-8'>****** UserID : {selectedUser.user_id} ******</p> */}
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
};
export default Showusers;