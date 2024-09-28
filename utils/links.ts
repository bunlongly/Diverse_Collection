import { IconType } from 'react-icons';
import {
  FaTachometerAlt,
  FaTags,
  FaWarehouse,
  FaInfoCircle,
  FaEnvelope,
  FaUserCircle
} from 'react-icons/fa';

export type NavLink = {
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
  { href: '/profile', label: 'Profile', icon: FaUserCircle }
];
