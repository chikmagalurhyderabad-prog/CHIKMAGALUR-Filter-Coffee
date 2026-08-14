import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-[#FAF7F2] py-20 lg:py-32 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center w-full relative z-10">
        <div className="w-full lg:w-[45%] flex flex-col space-y-8">
          <div>
            <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Chikmagalur Heritage</span>
            <h1 className="text-5xl lg:text-7xl leading-[1.05] tracking-tight font-medium mb-6 text-[#3D2B1F]">
              Best Chikmagalur Coffee
            </h1>
            <p className="text-lg leading-relaxed opacity-80 max-w-md text-[#3D2B1F]">
              Shop Online from Chikmagalur Coffee Works. Buy Coffee Powder, Roasted Beans, Tea, Spices, and Brewing Accessories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/shop"
              className="bg-[#3D2B1F] text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors inline-block"
            >
              SHOP NOW
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.1em] opacity-40 font-sans font-bold text-[#3D2B1F]">Starting at</span>
              <span className="text-xl text-[#3D2B1F]">₹150.00</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[55%] relative flex justify-center items-center mt-12 lg:mt-0 h-[400px] lg:h-[600px]">
           <div className="absolute w-full max-w-[450px] aspect-[3/4] bg-[#3D2B1F] rotate-2 shadow-2xl overflow-hidden hidden sm:block">
             <img
               src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
               alt="Coffee Beans"
               className="w-full h-full object-cover opacity-80 mix-blend-overlay"
             />
             <div className="absolute inset-4 border border-[#B48C44]/30 flex flex-col items-center justify-between py-12 pointer-events-none">
                <div className="w-24 h-24 border border-[#B48C44]/50 rounded-full flex items-center justify-center">
                  <span className="text-[#B48C44] text-3xl font-bold font-serif italic">C</span>
                </div>
                <div className="text-center px-8">
                  <h3 className="text-[#FAF7F2] text-3xl uppercase tracking-[0.2em] font-bold mb-2 font-sans">Premium</h3>
                  <div className="h-[1px] w-20 bg-[#B48C44] mx-auto mb-4"></div>
                  <p className="text-[#B48C44] text-[10px] uppercase tracking-[0.3em] font-sans font-bold">100% Arabica</p>
                </div>
             </div>
           </div>
           {/* Fallback simple image for smaller screens if needed */}
           <img
             src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
             alt="Coffee Beans"
             className="w-full h-full object-cover shadow-2xl sm:hidden"
           />
        </div>
      </div>
    </div>
  );
}
