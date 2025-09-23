import React, { useState,useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import logo from './img/LOGO-KMUTNB.png';
import Navbar from "./Navbar"; // Import Navbar
import axios from "axios";

/**
 * Topbar — blue background with a left icon
 *
 * Usage:
 *   <Topbar title="POS Shop" onMenuClick={() => console.log('menu')} />
 */
export default function Topbar({
  title = "My App",
  onMenuClick = () => {},
  rightContent,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const Fname = localStorage.getItem('userFirstName');

  useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/showusers');
                setUsers(response.data.data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-blue-600 text-white shadow-lg">
      <div className="mx-auto flex h-[80px] max-w-screen-xl items-center gap-4 px-6">

        {/* Left icon / menu */}
        <button
          aria-label="Open menu"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-2xl p-3 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <Menu className="h-6 w-6" />
        </button>

        <img src={logo} alt="Logo" style={{ height: '40px', width: '40px' }} />

        {/* Title / brand */}
        <div className="flex min-w-0 flex-1 items-center">
          <span className="truncate text-xl font-semibold tracking-wide">
            {title}
          </span>
        </div>

        {/* Optional: search (can remove if not needed) */}
        {/* <div className="hidden items-center gap-2 sm:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-80" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="h-10 w-48 rounded-2xl bg-white/15 pl-10 pr-3 text-white placeholder-white/80 outline-none ring-1 ring-white/20 focus:bg-white/20 focus:ring-white/40 md:w-64"
            />
          </div>
        </div> */}

        <div className="hidden items-center gap-2 sm:flex ">
          <p>Welcome, {Fname}</p>
        </div>

        {/* Right area (notifications or custom content) */}
        <div className="flex items-center gap-2">
          {rightContent}
          <button
            aria-label="Notifications"
            className="rounded-2xl p-3 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Conditionally render Navbar */}
      {/* {isMenuOpen && <Navbar />} */}
      <Navbar/>
    </header>
  );
}