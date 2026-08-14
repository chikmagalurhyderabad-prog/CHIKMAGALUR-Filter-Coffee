import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F2] text-[#3D2B1F] pt-20 pb-8 border-t border-[#3D2B1F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-[#3D2B1F] text-[11px] uppercase tracking-[0.2em] font-sans font-bold mb-6">CHIKMAGALUR COFFEE WORKS</h3>
            <p className="text-sm leading-relaxed mb-8 opacity-80 italic">
              Bringing you the finest Chikmagalur coffee. Experience the rich heritage and perfect aroma in every cup.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#B48C44] transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#B48C44] transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#B48C44] transition-colors"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-[#3D2B1F] text-[11px] uppercase tracking-[0.2em] font-sans font-bold mb-6">QUICK LINKS</h3>
            <ul className="space-y-4 text-sm opacity-80 font-sans">
              <li><Link to="/" className="hover:text-[#B48C44] transition-colors">Search</Link></li>
              <li><Link to="/shop" className="hover:text-[#B48C44] transition-colors">Shop</Link></li>
              <li><Link to="/contact" className="hover:text-[#B48C44] transition-colors">Franchise</Link></li>
              <li><Link to="/" className="hover:text-[#B48C44] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#B48C44] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#3D2B1F] text-[11px] uppercase tracking-[0.2em] font-sans font-bold mb-6">POLICIES</h3>
            <ul className="space-y-4 text-sm opacity-80 font-sans">
              <li><a href="#" className="hover:text-[#B48C44] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#B48C44] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#B48C44] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#3D2B1F] text-[11px] uppercase tracking-[0.2em] font-sans font-bold mb-6">CONTACT US</h3>
            <ul className="space-y-5 text-sm opacity-80 font-sans">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-4 mt-1 text-[#B48C44] flex-shrink-0" />
                <a
                  href="https://maps.google.com?q=Beside+Dilsukhnagar+Public+school,+Opposite+Peddabavi+Gardens,+Badangpet,+Ranga+Reddy,+Telangana+500058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B48C44] transition-colors leading-relaxed"
                >
                  Beside Dilsukhnagar Public school,<br />
                  Opposite Peddabavi Gardens,<br />
                  Badangpet, Ranga Reddy,<br />
                  Telangana - 500058
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-4 text-[#B48C44]" />
                <a href="tel:+918125052714" className="hover:text-[#B48C44] transition-colors">+91 81250 52714</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-4 text-[#B48C44]" />
                <a href="mailto:Chikmagalurhyderabad@gmail.com" className="hover:text-[#B48C44] transition-colors">Chikmagalurhyderabad@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3D2B1F]/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.15em] font-sans font-bold opacity-60">
          <p>&copy; {new Date().getFullYear()} Chikmagalur Coffee Works. All rights reserved.</p>
          <div className="mt-4 md:mt-0 italic">
            Preserving the Legacy of Indian Coffee Culture
          </div>
        </div>
      </div>
    </footer>
  );
}
