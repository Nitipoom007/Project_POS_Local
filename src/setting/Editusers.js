import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../output.css';

function Editusers({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('');
    // const [userdata, setUserdata] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/getuser/${user.user_id}`);
                const userData = response.data.data;
                setFirstname(userData.user_firstname);
                setLastname(userData.user_lastname);
                setUsername(userData.user_name);
                setPassword(userData.user_password);
                setAddress(userData.user_address);
                setEmail(userData.user_email);
                setPhone(userData.user_tel);
                setStatus(userData.user_status);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUserData = {
            firstname,
            lastname,
            username,
            password,
            address,
            email,
            phone,
            status
        };

        try {
            await axios.put(`http://localhost:5000/api/updateuser/${id}`, updatedUserData);
            alert('แก้ไขข้อมูลผู้ใช้สำเร็จ');
            // navigate('/manageusers'); // Redirect to manage users page
        } catch (error) {
            console.error('Error updating user:', error);
            alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">- แก้ไขข้อมูลผู้ใช้ -</h1>

            <form onSubmit={handleSubmit}>
                <div className="container bg-white rounded-xl shadow-lg p-8 mx-auto">
                    <div className="flex" >
                        <div className="mb-4 flex flex-col mr-2" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>ชื่อผู้ใช้งาน</label>
                            {/* <label className='font-normal text-black-700 mb-1 h-5' style={{ textAlign: 'left', width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>{user.user_firstname}</label> */}
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={user.user_firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="ชื่อผู้ใช้งาน"
                                defaultValue={user.user_firstname} // Set default value from user data
                            />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="mb-4 flex flex-col" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>นามสกุล</label>
                            {/* <label className='font-normal text-black-700 mb-1 h-5' style={{ textAlign: 'left', width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>{user.user_lastname}</label> */}
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={user.user_lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                placeholder="นามสกุล"
                                defaultValue={user.user_lastname} // Set default value from user data
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-4 flex flex-col mr-2" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>Username</label>
                            {/* <label className='font-normal text-black-700 mb-1 h-5' style={{ textAlign: 'left',width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>{user.user_name}</label> */}
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={user.user_name}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ชื่อผู้ใช้งาน"
                                defaultValue={user.user_name} // Set default value from user data
                            />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="mb-4 flex flex-col" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>Password</label>
                            <input
                                type="password"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="รหัสผ่าน"
                                defaultValue={user.user_password} // Set default value from user data
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-4 flex flex-col mr-2" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>Email</label>
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="อีเมล"
                            />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="mb-4 flex flex-col" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>Phone number</label>
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="หมายเลขโทรศัพท์"
                                maxLength="10"
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-4 flex flex-col mr-2" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>Address</label>
                            <input
                                type="text"
                                style={{ width: '100%', height: '35px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="ที่อยู่"
                            />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="mb-4 flex flex-col" style={{ width: '50%' }}>
                            <label className='font-bold text-blue-700 mb-1 h-5' style={{ textAlign: 'left' }}>สถานะ</label>
                            {/* <label className='font-bold text-black-700 mb-1 h-5' style={{ textAlign: 'left', marginTop: '5px' }}>{user.user_status}</label> */}
                            <select
                                value={status}
                                style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
                                onChange={(e) => setStatus(e.target.value)}
                                // required
                                className='border-2 border-blue-300 rounded-md p-2'
                            >
                                <option value="">เลือกสถานะ</option>
                                <option value="admin">admin</option>
                                <option value="user">user</option>
                            </select>
                        </div>
                    </div>
                    {/* {console.log(user)} */}
                    <p>UserID : {user.user_id}</p>
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
                                setFirstname('');
                                setUsername('');
                                setPassword('');
                                setAddress('');
                                setEmail('');
                                setPhone('');
                                setStatus('');
                            }}
                        >
                            ล้างข้อมูล
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Editusers;