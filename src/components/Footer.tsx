import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A100C] text-[#F2EDE4] pt-24 pb-12 border-t border-[#B48C44]/20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B48C44]/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#593222]/20 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B48C44] text-lg font-serif font-medium mb-6 tracking-wide">
              Chikmagalur<br/>Filter Coffee
            </h3>
            <p className="text-sm leading-relaxed mb-8 opacity-70">
              Preserving the legacy of authentic Indian coffee culture. Experience the rich heritage and perfect aroma in every cup, sourced directly from the lush hills of Chikmagalur.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full bg-[#F2EDE4]/5 flex items-center justify-center hover:bg-[#B48C44] hover:text-[#1A100C] transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F2EDE4]/5 flex items-center justify-center hover:bg-[#B48C44] hover:text-[#1A100C] transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F2EDE4]/5 flex items-center justify-center hover:bg-[#B48C44] hover:text-[#1A100C] transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F2EDE4] text-xs uppercase tracking-[0.25em] font-sans font-bold mb-8">Quick Links</h3>
            <ul className="space-y-4 text-sm opacity-80 font-sans">
              <li><Link to="/shop" className="hover:text-[#B48C44] transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2">-</span> Shop Coffee</Link></li>
              <li><Link to="/franchise" className="hover:text-[#B48C44] transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2">-</span> Partner With Us</Link></li>
              <li><Link to="/about" className="hover:text-[#B48C44] transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2">-</span> Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#B48C44] transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2">-</span> Contact Us</Link></li>
              <li><Link to="/" className="hover:text-[#B48C44] transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2">-</span> Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#F2EDE4] text-xs uppercase tracking-[0.25em] font-sans font-bold mb-8">Contact Us</h3>
            <ul className="space-y-6 text-sm opacity-80 font-sans">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-4 mt-1 text-[#B48C44] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="https://maps.app.goo.gl/pTUVhB46Xc9ijihA6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B48C44] transition-colors leading-relaxed"
                >
                  Beside Dilsukhnagar Public school,<br />
                  Opposite Peddabavi Gardens,<br />
                  Badangpet, Ranga Reddy, TG - 500058
                </a>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-4 text-[#B48C44] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+918125052714" className="hover:text-[#B48C44] transition-colors">+91 81250 52714</a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-4 text-[#B48C44] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:Chikmagalurhyderabad@gmail.com" className="hover:text-[#B48C44] transition-colors">Chikmagalurhyderabad@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-[#F2EDE4] text-xs uppercase tracking-[0.25em] font-sans font-bold mb-8">Newsletter</h3>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-[#F2EDE4]/5 border border-[#F2EDE4]/10 rounded-none px-4 py-3 text-sm text-[#F2EDE4] placeholder-[#F2EDE4]/40 focus:outline-none focus:border-[#B48C44] transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-[#B48C44] text-[#1A100C] hover:bg-white transition-colors flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F2EDE4]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.15em] font-sans font-bold opacity-50 text-center md:text-left">
            &copy; {new Date().getFullYear()} Chikmagalur Coffee Works. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[10px] uppercase tracking-[0.1em] font-sans opacity-50">
            <a href="#" className="hover:text-[#B48C44] hover:opacity-100 transition-all">Terms</a>
            <a href="#" className="hover:text-[#B48C44] hover:opacity-100 transition-all">Privacy</a>
            <a href="#" className="hover:text-[#B48C44] hover:opacity-100 transition-all">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
