'use client';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaTachometerAlt,
  FaTags,
  FaWarehouse,
  FaInfoCircle,
  FaEnvelope,
  FaUserCircle,
  FaHome,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartLine,
  FaSignOutAlt,
  FaBoxOpen,
  FaCogs,
  FaWallet,
  FaThList,
  FaPlus,
  FaFileInvoice
} from 'react-icons/fa';

function Sidebar() {
  // State for dropdown menus and sidebar
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [financialDropdownOpen, setFinancialDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle dropdowns
  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };

  const toggleFinancialDropdown = () => {
    setFinancialDropdownOpen(!financialDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  type NavLink = {
    href: string;
    label: string;
    icon: IconType;
  };

  // Define dropdown sub-links
  const productSubLinks = [
    { href: '/products', label: 'Products', icon: FaChartLine },
    { href: '/products/create', label: 'Create Products', icon: FaPlus },
    { href: '/categories', label: 'Categories', icon: FaThList }
  ];

  const adminSubLinks = [
    { href: '/user-management', label: 'User Management', icon: FaUsers }
  ];

  const financialSubLinks = [
    { href: '/income', label: 'Income', icon: FaFileInvoiceDollar },
    { href: '/invoices', label: 'Invoices', icon: FaFileInvoice }
  ];

  // Render dropdown sub-menu links
  const renderSubMenu = (links: NavLink[], isOpen: boolean) => (
    <div
      className={`pl-4 overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {links.map(link => (
        <li key={link.label} className='my-1'>
          <a
            href={link.href}
            className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
          >
            {React.createElement(link.icon, { className: 'mr-2' })} {link.label}
          </a>
        </li>
      ))}
    </div>
  );

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className='fixed top-5 left-5 z-50 p-1 rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none'
      >
        <svg
          className={`transition-transform h-6 w-6 ${
            isSidebarOpen ? '' : 'rotate-90'
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id='sidebar-multi-level-sidebar'
        className={`fixed top-0 left-0 z-30 w-64 h-screen flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--main-color)' }}
      >
        <div className='pt-16 px-3 py-4 overflow-y-auto h-full'>
          <ul className='space-y-2 font-medium'>
            {/* Static Sidebar Links */}
            <li>
              <a
                href='/'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaHome className='mr-2' />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href='/home'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaTachometerAlt className='mr-2' /> Home
              </a>
            </li>
            <li>
              <a
                href='/promotions'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaTags className='mr-2' /> Promotions
              </a>
            </li>
            <li>
              <a
                href='/instock'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaWarehouse className='mr-2' /> Instock
              </a>
            </li>
            <li>
              <a
                href='/about'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaInfoCircle className='mr-2' /> About us
              </a>
            </li>
            <li>
              <a
                href='/contact'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaEnvelope className='mr-2' /> Contact
              </a>
            </li>

            {/* Dropdown for Product Management */}
            <li>
              <button
                type='button'
                onClick={toggleProductDropdown}
                className='flex items-center w-full p-2 text-base text-white transition duration-300 ease-in-out rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaBoxOpen className='mr-2' /> Product Management
                <svg
                  className={`ml-auto w-3 h-3 transform transition-transform ${
                    productDropdownOpen ? 'rotate-180' : ''
                  }`}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 10 6'
                  fill='none'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 1l4 4 4-4'
                  />
                </svg>
              </button>
              {renderSubMenu(productSubLinks, productDropdownOpen)}
            </li>

            {/* Dropdown for Admin Management */}
            <li>
              <button
                type='button'
                onClick={toggleAdminDropdown}
                className='flex items-center w-full p-2 text-base text-white transition duration-300 ease-in-out rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaCogs className='mr-2' /> Admin Management
                <svg
                  className={`ml-auto w-3 h-3 transform transition-transform ${
                    adminDropdownOpen ? 'rotate-180' : ''
                  }`}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 10 6'
                  fill='none'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 1l4 4 4-4'
                  />
                </svg>
              </button>
              {renderSubMenu(adminSubLinks, adminDropdownOpen)}
            </li>

            {/* Dropdown for Financial Management */}
            <li>
              <button
                type='button'
                onClick={toggleFinancialDropdown}
                className='flex items-center w-full p-2 text-base text-white transition duration-300 ease-in-out rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaWallet className='mr-2' /> Financial Management
                <svg
                  className={`ml-auto w-3 h-3 transform transition-transform ${
                    financialDropdownOpen ? 'rotate-180' : ''
                  }`}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 10 6'
                  fill='none'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 1l4 4 4-4'
                  />
                </svg>
              </button>
              {renderSubMenu(financialSubLinks, financialDropdownOpen)}
            </li>

            {/* Profile Link */}
            <li>
              <a
                href='/profile'
                className='flex items-center p-2 text-white rounded-lg hover:bg-[var(--secondary-color)] dark:text-white'
              >
                <FaUserCircle className='mr-2' /> Profile
              </a>
            </li>
          </ul>
        </div>

        {/* Sign Out Link */}
        <div className='p-2 w-full'>
          <a
            href='/logout'
            className='flex items-center p-2 text-white rounded-lg hover:bg-red-500 dark:text-white hover:text-white'
          >
            <FaSignOutAlt className='mr-2' /> Sign Out
          </a>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
