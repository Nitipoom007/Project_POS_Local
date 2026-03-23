import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './output.css';
import './index.css';
import Home from './components/Home';
import Input from './components/Inputproduct';
import Stock from './components/Stock';
import Login from './components/Login';
import Product from './components/Product';
import Setting from './components/Setting';
import Report from './components/Report';
import Setting2 from './components/Setting2';
import Setting3 from './components/Setting3';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="Inputproduct" element={<Input />} />
          <Route path="Stock" element={<Stock />} />
          <Route path="Product" element={<Product />} />
          <Route path="Setting" element={<Setting />} />
          <Route path="Report" element={<Report />} />
          <Route path="Setting2" element={<Setting2 />} />
          <Route path="Setting3" element={<Setting3 />} />
          {/* เพิ่ม Route อื่นๆ ที่ต้องการ */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;