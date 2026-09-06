import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { productsData } from '../data/products';
import ProductSkeleton from './ProductSkeleton';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductsProps {
  products?: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  title?: string;
  subtitle?: string;
  tag?: string;
  showViewAll?: boolean;
  limit?: number;
}

export default function Products({
  products = productsData,
  isLoading = false,
  skeletonCount = 4,
  title = "Featured Products",
  subtitle = "Discover our finest blends and roasts.",
  tag = "The Collection",
  showViewAll = true,
  limit
}: ProductsProps) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const displayProducts = limit ? products.slice(0, limit) : products;

  const handleQuickAdd = (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/shop' } } });
      return;
    }
    
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  return (
    <section className="py-24 bg-[#FFFFFF] border-t border-[#593222]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
            {tag}
          </span>
          <h2 className="text-4xl lg:text-5xl font-medium text-[#593222] tracking-tight">
            {title}
          </h2>
          <p className="mt-4 text-lg opacity-80 text-[#593222]">
            {subtitle}
          </p>
        </div>
        
        {isLoading ? (
          <ProductSkeleton count={skeletonCount} />
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 border border-[#593222]/10 bg-[#FFFFFF]">
            <p className="text-lg text-[#593222] opacity-70 italic font-serif">No products found in this selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {displayProducts.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col h-full border border-[#593222]/10 p-4 bg-[#FFFFFF] transition-all duration-300 hover:border-[#593222]/30"
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-[#593222]/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.roastProfile && (
                    <span className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#593222] text-[9px] uppercase tracking-[0.15em] font-sans font-bold px-2 py-1 border border-[#593222]/10">
                      {product.roastProfile}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-[#593222]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => handleQuickAdd(product)}
                      className="btn-sweep bg-[#593222] text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ADDED TO CART</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>QUICK ADD</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col flex-grow text-center">
                  <h3 className="text-lg font-medium text-[#593222] mb-2 leading-snug">{product.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-60 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto pt-2 border-t border-[#593222]/5">
                    <span className="text-[#B48C44] text-lg italic">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showViewAll && (
          <div className="mt-16 text-center">
            <Link
              to="/shop"
              className="inline-block border border-[#593222] text-[#593222] px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#593222] hover:text-[#FFFFFF] transition-colors"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

