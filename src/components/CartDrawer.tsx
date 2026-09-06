import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    totalItemsCount,
    couponCode,
    couponSuccess,
    couponError,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      await applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 overflow-hidden" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Backdrop */}
        <div 
          onClick={closeCart} 
          className="fixed inset-0 bg-[#593222]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300" 
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FFFFFF] text-[#593222] shadow-2xl flex flex-col justify-between border-l border-[#593222]/15 relative">
            
            {/* Header */}
            <div className="p-6 border-b border-[#593222]/10 flex items-center justify-between bg-[#FFFFFF]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#B48C44]" />
                <div>
                  <h2 id="cart-drawer-title" className="text-lg font-serif font-medium tracking-wide text-[#593222]">
                    Your Kaapi Cart
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#593222]/60">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/5 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="bg-[#FFFFFF] px-6 py-3 border-b border-[#593222]/10">
              {subtotal >= 499 ? (
                <div className="flex items-center gap-2 text-xs font-sans text-emerald-800 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Congratulations! You have unlocked <strong>Free Fresh Roastery Delivery</strong>.</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-[11px] font-sans text-[#593222]/80 mb-1.5">
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

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full border border-[#593222]/15 mx-auto flex items-center justify-center mb-4 text-[#B48C44]">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <h3 className="text-xl font-serif text-[#593222] mb-2">Your cart is empty</h3>
                  <p className="text-xs text-[#593222]/60 font-sans max-w-xs mx-auto mb-6">
                    Fresh batches of Chikmagalur Arabica and heritage filter blends are waiting to be brewed.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                    className="bg-[#593222] text-[#FFFFFF] px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
                  >
                    Explore Roastery Blends
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-[#593222]/10 last:border-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-[#593222]/5 border border-[#593222]/10 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-[#593222] line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#593222]/40 hover:text-red-700 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="mt-1.5 flex flex-wrap gap-1.5 text-[9px] uppercase tracking-[0.1em] font-sans text-[#593222]/70">
                          <span className="bg-[#593222]/5 px-2 py-0.5 border border-[#593222]/10">
                            {item.weight}
                          </span>
                          <span className="bg-[#593222]/5 px-2 py-0.5 border border-[#593222]/10 line-clamp-1 max-w-[180px]">
                            {item.grind}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex justify-between items-center mt-3 pt-2">
                        <div className="flex items-center border border-[#593222]/20 bg-[#FFFFFF]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/10 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-sans font-semibold text-[#593222]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/10 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-[#593222]/50 font-sans block">
                            ₹{item.unitPrice} each
                          </span>
                          <span className="text-sm font-serif font-bold text-[#B48C44]">
                            ₹{item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#593222]/10 bg-[#FFFFFF] space-y-4">
                
                {/* Coupon Code Section */}
                <div>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-[#B48C44]/10 border border-[#B48C44]/30 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 text-[#593222]">
                        <Tag className="w-3.5 h-3.5 text-[#B48C44]" />
                        <span>Code <strong>{couponCode}</strong> applied</span>
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
                        placeholder="Promo code (e.g. KAAPI1938)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 bg-transparent border border-[#593222]/20 text-xs px-3 py-2 font-sans focus:outline-none focus:border-[#B48C44] uppercase text-[#593222] placeholder-[#593222]/40"
                      />
                      <button
                        type="submit"
                        className="bg-[#593222]/10 hover:bg-[#593222] hover:text-white text-[#593222] px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-bold transition-colors cursor-pointer border border-[#593222]/20"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-700 font-sans mt-1">{couponError}</p>
                  )}
                  {couponSuccess && !couponCode && (
                    <p className="text-[11px] text-emerald-800 font-sans mt-1">{couponSuccess}</p>
                  )}
                </div>

                {/* Pricing Table */}
                <div className="space-y-1.5 text-xs font-sans text-[#593222]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-serif">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Heritage Promo Discount</span>
                      <span className="font-serif">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Chikmagalur Direct Shipping</span>
                    <span className="font-serif">
                      {shippingAmount === 0 ? (
                        <span className="text-emerald-800 uppercase text-[10px] tracking-wider font-bold font-sans">FREE</span>
                      ) : (
                        `₹${shippingAmount}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-[#593222]/10 pt-2 flex justify-between text-base font-serif font-bold text-[#593222]">
                    <span>Total Amount</span>
                    <span className="text-[#B48C44]">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#593222] text-[#FFFFFF] py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-sans font-bold text-[#593222]/60 pt-1">
                    <button 
                      onClick={() => {
                        closeCart();
                        navigate('/cart');
                      }}
                      className="hover:text-[#B48C44] transition-colors cursor-pointer"
                    >
                      View Full Cart Page
                    </button>
                    <div className="flex items-center gap-1 text-[#593222]/50">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B48C44]" />
                      <span>Secure Roastery Checkout</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </>
  );
}
