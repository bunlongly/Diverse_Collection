import { IconType } from 'react-icons';
import {
  FaTachometerAlt,
  FaTags,
  FaWarehouse,
  FaInfoCircle,
  FaEnvelope,
  FaUserCircle,
  FaHome,
  FaToolbox,
  FaUsers,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaThList,
  FaFileInvoice,
  FaDollarSign,
  FaSignOutAlt
} from 'react-icons/fa';

export type NavLink = {
  href: string;
  label: string;
  icon?: IconType;
};

export type SideLink = {
  href: string;
  label: string;
  icon?: IconType;
};

export const links: NavLink[] = [
  { href: '/', label: 'Home', icon: FaTachometerAlt },
  { href: '/promotions', label: 'Promotions', icon: FaTags },
  { href: '/instock', label: 'Instock', icon: FaWarehouse },
  { href: '/about', label: 'About Us', icon: FaInfoCircle },
  { href: '/contact', label: 'Contact', icon: FaEnvelope },
  { href: '/product', label: 'Product', icon: FaBoxOpen },
  { href: '/categories', label: 'Categories', icon: FaThList },
  { href: '/invoice', label: 'Invoice', icon: FaFileInvoice },
  { href: '/income', label: 'Income', icon: FaDollarSign },
  { href: '/user', label: 'User', icon: FaUsers },
  { href: '/profile', label: 'Profile', icon: FaUserCircle }
];

export const sideLinks: SideLink[] = [
  { href: '/', label: 'Home', icon: FaTachometerAlt },
  { href: '/dashboard', label: 'Dashboard', icon: FaHome },
  { href: '/promotions', label: 'Promotions', icon: FaTags },
  { href: '/instock', label: 'Instock', icon: FaWarehouse },
  { href: '/about', label: 'About Us', icon: FaInfoCircle },
  { href: '/contact', label: 'Contact', icon: FaEnvelope },
  { href: '/profile', label: 'Profile', icon: FaUserCircle },
  { href: '/management', label: 'Management', icon: FaToolbox },
  { href: '/users', label: 'Users', icon: FaUsers },
  { href: '/invoices', label: 'Invoices', icon: FaFileInvoiceDollar },
  { href: '/logout', label: 'Log Out', icon: FaSignOutAlt }
];
