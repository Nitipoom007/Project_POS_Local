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
          {/* เพิ่ม Route อื่นๆ ที่ต้องการ */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;