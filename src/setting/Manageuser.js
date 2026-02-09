import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import Swal from 'sweetalert2';

function Adduser() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  // const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usersData = {
      fname: firstname,
      lname: lastname,
      username: username,
      password: password,
      address: address,
      email: email,
      phone: phone,
      status: status
    };
    try {
      const response = await axios.post('http://localhost:3001/api/addusers', usersData);
      // alert('บันทึกข้อมูลผู้ใช้สำเร็จ');
      Swal.fire({
                      title: "บันทึกข้อมูลสำเร็จ",
                      icon: "success",
                      draggable: true
                  });
      // fetchUsers(); // Refresh user list after adding
    } catch (error) {
      // alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้: ' + error.message);
      Swal.fire({
                      title: 'เกิดข้อผิดพลาด: ' + error.message,
                      icon: "error",
                      draggable: true
                  });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="container bg-white rounded-xl shadow-lg p-8 mx-auto ">
        <div className="flex" style={{width: '100%'}}>
          <div className="mb-4 flex flex-col mr-2">
            <label className='font-bold text-blue-700 mb-1 h-5'>ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
              required
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="mb-4 flex flex-col">
            <label className='font-bold text-blue-700 mb-1 h-5'>นามสกุล</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="กรุณากรอกนามสกุล"
              required
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 flex flex-col mr-2">
            <label className='font-bold text-blue-700 mb-1 h-5'>Username</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ชื่อผู้ใช้"
              required
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="mb-4 flex flex-col">
            <label className='font-bold text-blue-700 mb-1 h-5'>Password</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              required
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 flex flex-col mr-2">
            <label className='font-bold text-blue-700 mb-1 h-5'>Email</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
              required
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="mb-4 flex flex-col">
            <label className='font-bold text-blue-700 mb-1 h-5'>ที่อยู่</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ที่อยู่"
              required
              maxLength="100"
            />
          </div>
          
        </div>

        <div className="flex">
          <div className="mb-4 flex flex-col mr-2">
            <label className='font-bold text-blue-700 mb-1 h-5'>เบอร์โทรศัพท์</label>
            <input
              type="text"
              style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="หมายเลขโทรศัพท์"
              required
              maxLength="10"
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="mb-4 flex flex-col">
            <label className='font-bold text-blue-700 mb-1 h-5'>สถานะผู้ใช้งาน</label>
            <select
            value={status}
            style={{ width: '100%', height: '35px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '5px' }}
            onChange={(e) => setStatus(e.target.value)}
            required
            className='border-2 border-blue-300 rounded-md p-2'
          >
            <option value="">เลือกสถานะ</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
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
  );
};

export default Adduser;