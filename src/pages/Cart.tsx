import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles, Coffee, Truck, Clock } from 'lucide-react';
import { GrindOption, WeightOption } from '../types';
import CheckoutModal from '../components/CheckoutModal';
import { productsData } from '../data/products';

import { useAuth } from '../context/AuthContext';

const GRIND_OPTIONS: GrindOption[] = [
  'Traditional South Indian Filter Grind',
  'Medium Grind (Moka Pot & Pour Over)',
  'Coarse Grind (French Press / Cold Brew)',
  'Whole Roasted Beans'
];

const WEIGHT_OPTIONS: WeightOption[] = ['250g', '500g', '1kg'];

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const {
    items,
    removeFromCart,
    updateQuantity,
    addToCart,
    subtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    totalItemsCount,
    couponCode,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      await applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  // Recommendations for items not yet in cart
  const cartProductIds = new Set(items.map(i => i.product.id));
  const suggestedProducts = productsData.filter(p => !cartProductIds.has(p.id)).slice(0, 3);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#593222] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
            Direct from Chikmagalur
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#593222] mb-3">
            Your Kaapi Order
          </h1>
          <p className="text-sm font-serif italic opacity-75">
            Every batch is freshly roasted and packaged upon order confirmation.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] border border-[#593222]/10 max-w-xl mx-auto p-8">
            <div className="w-16 h-16 rounded-full border border-[#593222]/20 mx-auto flex items-center justify-center mb-4 text-[#B48C44]">
              <ShoppingBag className="w-8 h-8 opacity-40" />
            </div>
            <h2 className="text-2xl font-serif text-[#593222] mb-3">Your cart is empty</h2>
            <p className="text-xs text-[#593222]/60 font-sans leading-relaxed mb-8 max-w-sm mx-auto">
              You haven't selected any coffee yet. Browse our handpicked beans, single-estate blends, and authentic filter powders.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#593222] text-[#FFFFFF] px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col: Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free delivery banner */}
              <div className="bg-[#FFFFFF] border border-[#593222]/10 p-4">
                {subtotal >= 499 ? (
                  <div className="flex items-center gap-2.5 text-xs font-sans text-emerald-800 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>You've qualified for <strong>Free Express Roastery Delivery</strong> across India!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-sans text-[#593222]/80">
                      <span>Add <strong>₹{499 - subtotal}</strong> more for <strong>FREE Delivery</strong></span>
                      <span>₹{subtotal} / ₹499</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#593222]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#B48C44] transition-all duration-300 rounded-full" 
                        style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card List */}
              <div className="bg-[#FFFFFF] border border-[#593222]/10 divide-y divide-[#593222]/10">
                {items.map((item) => (
                  <div key={item.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-[#593222]/5 border border-[#593222]/10 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-medium text-[#593222] leading-snug">
                          {item.product.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-sans text-[#593222]/60">
                          <span className="bg-[#593222]/5 px-2 py-0.5 border border-[#593222]/10">
                            {item.weight}
                          </span>
                          <span className="bg-[#593222]/5 px-2 py-0.5 border border-[#593222]/10">
                            {item.grind}
                          </span>
                        </div>
                        <span className="text-xs text-[#B48C44] font-serif mt-2 block">
                          ₹{item.unitPrice} per pack
                        </span>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#593222]/10">
                      <div className="flex items-center border border-[#593222]/20 bg-[#FFFFFF]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/10 transition-colors cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-sans font-semibold text-[#593222]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/10 transition-colors cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <span className="text-base font-serif font-bold text-[#593222]">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#593222]/40 hover:text-red-700 transition-colors p-2 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Roastery Promise Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 border border-[#593222]/10 bg-[#FFFFFF] flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#B48C44] flex-shrink-0" />
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#593222]">Roasted to Order</h4>
                    <p className="text-[10px] text-[#593222]/60">Dispatched within 24 hours</p>
                  </div>
                </div>
                <div className="p-4 border border-[#593222]/10 bg-[#FFFFFF] flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-[#B48C44] flex-shrink-0" />
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#593222]">Aroma Sealed</h4>
                    <p className="text-[10px] text-[#593222]/60">Degassing valve pouches</p>
                  </div>
                </div>
                <div className="p-4 border border-[#593222]/10 bg-[#FFFFFF] flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#B48C44] flex-shrink-0" />
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#593222]">Chikmagalur Direct</h4>
                    <p className="text-[10px] text-[#593222]/60">Estate to doorstep freshness</p>
                  </div>
                </div>
              </div>

              {/* Recommended Pairings */}
              {suggestedProducts.length > 0 && (
                <div className="pt-8">
                  <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#593222] mb-4">
                    Complete Your Brew Collection
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestedProducts.map(p => (
                      <div key={p.id} className="p-4 border border-[#593222]/10 bg-[#FFFFFF] flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-sans text-[#B48C44] font-bold block mb-1">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-serif font-medium text-[#593222] mb-1 line-clamp-1">{p.name}</h4>
                          <span className="text-xs font-serif text-[#593222]/70">{p.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="mt-3 bg-[#593222]/10 hover:bg-[#593222] hover:text-[#FFFFFF] text-[#593222] py-2 text-[10px] uppercase tracking-wider font-sans font-bold transition-colors cursor-pointer text-center"
                        >
                          + Add to Order
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-[#FFFFFF] border border-[#593222]/15 p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-serif font-medium text-[#593222] border-b border-[#593222]/10 pb-4">
                  Order Summary
                </h2>

                {/* Promo Code input */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-2">
                    Heritage Coupon Code
                  </label>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-[#B48C44]/10 border border-[#B48C44]/30 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 text-[#593222]">
                        <Tag className="w-3.5 h-3.5 text-[#B48C44]" />
                        <span><strong>{couponCode}</strong> applied</span>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        className="text-[10px] uppercase tracking-wider text-red-700 hover:underline font-sans font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="KAAPI1938"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 bg-transparent border border-[#593222]/20 text-xs px-3 py-2 font-sans focus:outline-none focus:border-[#B48C44] uppercase text-[#593222]"
                      />
                      <button
                        type="submit"
                        className="bg-[#593222] text-[#FFFFFF] px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-red-700 font-sans mt-1">{couponError}</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs font-sans text-[#593222]/80 pt-2 border-t border-[#593222]/10">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({totalItemsCount} packs)</span>
                    <span className="font-serif">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Discount ({couponCode})</span>
                      <span className="font-serif">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping from Chikmagalur</span>
                    <span className="font-serif">
                      {shippingAmount === 0 ? (
                        <span className="text-emerald-800 uppercase text-[10px] tracking-wider font-bold">FREE</span>
                      ) : (
                        `₹${shippingAmount}`
                      )}
                    </span>
                  </div>
                  
                  <div className="border-t border-[#593222]/15 pt-4 flex justify-between items-baseline text-lg font-serif font-bold text-[#593222]">
                    <span>Total Amount</span>
                    <span className="text-[#B48C44] text-xl">₹{totalAmount}</span>
                  </div>
                  <span className="text-[9px] text-[#593222]/50 block text-right font-sans">
                    Includes all applicable GST & roastery packaging
                  </span>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: { pathname: '/cart' } } });
                      } else {
                        setIsCheckoutOpen(true);
                      }
                    }}
                    className="w-full bg-[#593222] text-[#FFFFFF] py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Roastery Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider font-sans text-[#593222]/60 pt-2">
                    <ShieldCheck className="w-4 h-4 text-[#B48C44]" />
                    <span>Safe & Encrypted Transactions</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </div>
  );
}
