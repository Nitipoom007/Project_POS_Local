import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import '../output.css';
import Topbar from './Topbar';

function Home() {
  return (
    <>
      <div>
        <Topbar />
      </div>
      <div className="flex min-h-screen bg-gradient-to-br bg-gray-50">
        {/* <Navbar /> */}
        <main className="flex-1 ml-56 px-8 py-10">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Home;