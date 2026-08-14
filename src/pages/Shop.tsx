import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../data/products';
import ProductSkeleton from '../components/ProductSkeleton';
import { Check, RefreshCw, SlidersHorizontal, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { id: 'all', label: 'All Blends' },
  { id: 'powder', label: 'Filter Coffee Powder' },
  { id: 'beans', label: 'Roasted Whole Beans' },
  { id: 'estate', label: 'Estate Blends' },
];

export default function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedId, setAddedId] = useState<number | null>(null);

  const loadProducts = async (cat: string) => {
    setIsLoading(true);
    try {
      // Simulate real-world network fetch delay (850ms)
      const data = await fetchProducts(cat, 850);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === selectedCategory) {
      // If clicking same category, re-trigger loading demo
      loadProducts(catId);
    } else {
      setSelectedCategory(catId);
    }
  };

  // Filter & sort
  const filteredProducts = products
    .filter(p => {
      if (!searchQuery.trim()) return true;
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.rawPrice - b.rawPrice;
      if (sortBy === 'price-desc') return b.rawPrice - a.rawPrice;
      return a.id - b.id;
    });

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#3D2B1F] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
            Curated Artisanal Kaapi
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#3D2B1F] mb-4">
            The Coffee Collection
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-serif italic">
            Shade-grown, single-estate, and traditionally roasted coffee beans from the misty slopes of Chikmagalur.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="border-y border-[#3D2B1F]/10 py-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#3D2B1F] text-[#FAF7F2]'
                      : 'bg-transparent text-[#3D2B1F]/70 hover:text-[#3D2B1F] hover:bg-[#3D2B1F]/5 border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search, Sort, and Re-fetch Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search roasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border border-[#3D2B1F]/20 text-xs py-2.5 pl-8 pr-3 font-sans focus:outline-none focus:border-[#B48C44] w-full sm:w-44 text-[#3D2B1F] placeholder-[#3D2B1F]/40"
              />
              <Search className="w-3.5 h-3.5 text-[#3D2B1F]/50 absolute left-2.5 top-3 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3D2B1F]/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-[#3D2B1F]/20 text-xs py-2.5 px-3 font-sans focus:outline-none focus:border-[#B48C44] text-[#3D2B1F] cursor-pointer"
              >
                <option value="featured" className="bg-[#FAF7F2] text-[#3D2B1F]">Featured</option>
                <option value="price-asc" className="bg-[#FAF7F2] text-[#3D2B1F]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#FAF7F2] text-[#3D2B1F]">Price: High to Low</option>
              </select>
            </div>

            {/* Reload / Refresh Button to easily test loading skeleton */}
            <button
              onClick={() => loadProducts(selectedCategory)}
              disabled={isLoading}
              title="Refresh catalogue"
              className="p-2.5 border border-[#3D2B1F]/20 hover:border-[#B48C44] hover:text-[#B48C44] transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Refresh product list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Loading Indicator Status Bar */}
        {isLoading && (
          <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-sans text-[#B48C44] opacity-80">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B48C44] animate-ping" />
              Fetching freshly roasted batches...
            </span>
            <span className="font-serif italic text-xs lowercase">estate direct</span>
          </div>
        )}

        {/* Products Grid or Skeleton Loading */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-[#3D2B1F]/10 bg-[#FAF7F2]">
            <p className="text-xl text-[#3D2B1F] opacity-70 italic font-serif mb-4">
              No coffee blends matched your criteria.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="border border-[#3D2B1F] text-[#3D2B1F] px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#3D2B1F] hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col h-full border border-[#3D2B1F]/10 p-4 bg-[#FAF7F2] transition-all duration-300 hover:border-[#3D2B1F]/30"
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-[#3D2B1F]/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.roastProfile && (
                    <span className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#3D2B1F] text-[9px] uppercase tracking-[0.15em] font-sans font-bold px-2 py-1 border border-[#3D2B1F]/10">
                      {product.roastProfile}
                    </span>
                  )}
                  {product.weight && (
                    <span className="absolute bottom-3 right-3 bg-[#3D2B1F]/80 text-[#FAF7F2] text-[8px] uppercase tracking-[0.15em] font-sans px-2 py-0.5">
                      {product.weight}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-[#3D2B1F]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => handleQuickAdd(product)}
                      className="bg-[#3D2B1F] text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
                    >
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
                    </button>
                  </div>
                </div>
                <div className="flex flex-col flex-grow text-center">
                  <h3 className="text-lg font-medium text-[#3D2B1F] mb-2 leading-snug">{product.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-60 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto pt-2 border-t border-[#3D2B1F]/5">
                    <span className="text-[#B48C44] text-lg italic font-serif">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

