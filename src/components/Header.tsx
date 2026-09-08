import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, User, X, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { totalItemsCount, openCart } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isFranchise = pathname === '/franchise';
  const isAbout = pathname === '/about';

  let headerClass = "bg-[#FFFFFF] border-b border-[#593222]/10 sticky top-0 z-40 transition-all duration-300";
  let textColorClass = "text-[#593222]";

  if (isFranchise || isAbout) {
    headerClass = "absolute top-0 left-0 right-0 bg-transparent border-b border-white/10 z-40 transition-all duration-300";
    textColorClass = "text-white";
  } else if (isHome) {
    headerClass = "bg-[#FFFFFF] md:bg-transparent border-b border-[#593222]/10 md:border-white/10 sticky md:absolute top-0 left-0 right-0 z-40 transition-all duration-300";
    textColorClass = "max-md:text-[#593222] md:text-white";
  }

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[96px]">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${textColorClass} hover:text-[#B48C44] transition-colors cursor-pointer`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className={`text-xl sm:text-2xl tracking-[0.3em] font-bold uppercase ${textColorClass} flex flex-col items-center sm:items-start ml-2 sm:ml-0`}>
              CHIKMAGALUR
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.5em] mt-1 opacity-60 font-sans hidden sm:block">Filter Coffee</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-12 lg:space-x-20">
            <Link to="/" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-semibold ${textColorClass} hover:text-[#B48C44] transition-colors`}>Home</Link>
            <Link to="/about" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-semibold ${textColorClass} hover:text-[#B48C44] transition-colors`}>About Us</Link>
            <Link to="/shop" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-semibold ${textColorClass} hover:text-[#B48C44] transition-colors`}>Shop</Link>
            <Link to="/franchise" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-semibold ${textColorClass} hover:text-[#B48C44] transition-colors`}>Franchise</Link>
            <Link to="/contact" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-semibold ${textColorClass} hover:text-[#B48C44] transition-colors`}>Contact</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={`nav-link text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-red-500 hover:text-red-400 transition-colors`}>Admin Panel</Link>
            )}
          </nav>

          <div className="flex items-center space-x-5 sm:space-x-6">
            <Link
              to="/profile"
              className={`${textColorClass} hover:text-[#B48C44] transition-colors flex items-center gap-2 group`}
              title="My Account & Orders"
              aria-label="Profile"
            >
              <div className="relative">
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {user && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B48C44]" />
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold hidden xl:inline-block">
                {user ? user.name.split(' ')[0] : 'Account'}
              </span>
            </Link>

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: { pathname: '/cart' } } });
                } else {
                  openCart();
                }
              }}
              className={`${textColorClass} hover:text-[#B48C44] transition-colors relative p-1 cursor-pointer group`}
              aria-label={`Shopping cart with ${totalItemsCount} items`}
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#B48C44] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-sans shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#593222]/15 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 font-sans font-semibold text-xs uppercase tracking-[0.2em] text-[#593222]">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5"
            >
              About Us
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5"
            >
              Coffee Shop
            </Link>
            <Link
              to="/franchise"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5"
            >
              Franchise
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5 flex justify-between items-center"
            >
              <span>Kaapi Cart</span>
              <span className="bg-[#B48C44] text-white px-2 py-0.5 text-[9px] rounded-full">
                {totalItemsCount}
              </span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44] border-b border-[#593222]/5 flex justify-between items-center"
            >
              <span>My Profile & Orders</span>
              <User className="w-3.5 h-3.5 text-[#B48C44]" />
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#B48C44]"
            >
              Contact Us
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-red-600 hover:text-red-400 border-t border-[#593222]/5"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

