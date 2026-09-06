import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import { fetchProducts } from '../data/products';
import { Product } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts('all', 0).then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Hero />
      <Products products={products.length > 0 ? products : undefined} isLoading={isLoading} limit={8} />
      
      {/* Immersive Shop Banner */}
      <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <img 
          src="/images/home-stall-banner.jpg" 
          alt="Chikmagalur Filter Coffee Outlet" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4 drop-shadow-md">
            Visit Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-6 drop-shadow-lg tracking-tight">
            Experience Our Legacy
          </h2>
          <p className="text-lg text-white/95 max-w-2xl font-light drop-shadow-md">
            Step into our beautifully designed outlets and immerse yourself in the authentic ambiance of traditional South Indian coffee brewing.
          </p>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
