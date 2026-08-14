import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote, Building2, ArrowRight } from 'lucide-react';
import { ShippingAddress, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, subtotal, discountAmount, shippingAmount, totalAmount, clearCart, closeCart } = useCart();
  const { user, addAddress, createOrder } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses.find(a => a.isDefault)?.id || user?.addresses[0]?.id || 'new'
  );

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(user ? user.addresses.length === 0 : true);
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '+91 ');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newPincode, setNewPincode] = useState('560038');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit / Debit Card' | 'Netbanking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let activeShippingAddress: ShippingAddress;

    if (isAddingNewAddress || selectedAddressId === 'new') {
      const addrData: Omit<ShippingAddress, 'id'> = {
        fullName: newFullName || 'Customer',
        phone: newPhone || '+91 9876543210',
        street: newStreet || '123 Estate Road',
        city: newCity || 'Bengaluru',
        state: newState || 'Karnataka',
        pincode: newPincode || '560001',
        isDefault: true,
        label: 'Home'
      };
      addAddress(addrData);
      activeShippingAddress = {
        ...addrData,
        id: `addr-${Date.now()}`
      };
    } else {
      activeShippingAddress = user?.addresses.find(a => a.id === selectedAddressId) || {
        id: 'addr-fallback',
        fullName: user?.name || 'Customer',
        phone: user?.phone || '+91 9876543210',
        street: 'Main Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true,
        label: 'Home'
      };
    }

    try {
      // Simulate roastery order registration
      await new Promise(res => setTimeout(res, 900));

      const orderItems = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        grind: item.grind,
        weight: item.weight,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }));

      const created = await createOrder({
        items: orderItems,
        subtotal,
        discount: discountAmount,
        shipping: shippingAmount,
        total: totalAmount,
        status: 'Freshly Roasted & Packed',
        shippingAddress: activeShippingAddress,
        paymentMethod,
        notes: orderNotes
      });

      setCompletedOrder(created);
      clearCart();
    } catch (err) {
      console.error('Failed to create order', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    onClose();
    closeCart();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-[#3D2B1F]/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#3D2B1F] shadow-2xl border border-[#3D2B1F]/15 overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#3D2B1F]/10 flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#B48C44]" />
              <h2 className="text-xl font-serif font-medium text-[#3D2B1F]">
                {completedOrder ? 'Order Confirmed' : 'Direct Roastery Checkout'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#3D2B1F]/60 hover:text-[#3D2B1F] hover:bg-[#3D2B1F]/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {completedOrder ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-[#B48C44]/15 rounded-full flex items-center justify-center mx-auto text-[#B48C44]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold text-[#B48C44] block mb-2">
                  Order Successfully Placed
                </span>
                <h3 className="text-3xl font-serif font-medium text-[#3D2B1F] mb-2">
                  Thank You, {completedOrder.shippingAddress.fullName.split(' ')[0]}
                </h3>
                <p className="text-sm font-sans text-[#3D2B1F]/80 max-w-md mx-auto">
                  Your batch has been scheduled for freshly ground roasting in Chikmagalur and will be packed in specialized degassing valve bags.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 p-5 text-left text-xs font-sans space-y-3">
                <div className="flex justify-between pb-2 border-b border-[#3D2B1F]/10">
                  <span className="text-[#3D2B1F]/60 font-semibold uppercase tracking-wider">Order Reference</span>
                  <span className="font-mono font-bold text-[#3D2B1F]">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#3D2B1F]/10">
                  <span className="text-[#3D2B1F]/60 font-semibold uppercase tracking-wider">Total Paid</span>
                  <span className="font-serif font-bold text-[#B48C44] text-sm">₹{completedOrder.total} ({completedOrder.paymentMethod})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#3D2B1F]/10">
                  <span className="text-[#3D2B1F]/60 font-semibold uppercase tracking-wider">Estimated Dispatch</span>
                  <span className="text-[#3D2B1F] font-medium">Tomorrow, 10:00 AM (Chikmagalur Estates)</span>
                </div>
                <div>
                  <span className="text-[#3D2B1F]/60 font-semibold uppercase tracking-wider block mb-1">Delivering To</span>
                  <p className="text-[#3D2B1F] leading-relaxed">
                    {completedOrder.shippingAddress.fullName}, {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleFinish}
                  className="bg-[#3D2B1F] text-[#FAF7F2] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
                >
                  Track Order in Profile
                </button>
                <button
                  onClick={() => {
                    onClose();
                    closeCart();
                    navigate('/shop');
                  }}
                  className="border border-[#3D2B1F] text-[#3D2B1F] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#3D2B1F] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
              
              {/* Order Items Preview Pill */}
              <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 p-3 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#3D2B1F]">{items.length} Blends</span>
                  <span className="text-[#3D2B1F]/50">•</span>
                  <span className="text-[#3D2B1F]/70">{items.reduce((s, i) => s + i.quantity, 0)} Total Packs</span>
                </div>
                <span className="font-serif font-bold text-sm text-[#B48C44]">Payable: ₹{totalAmount}</span>
              </div>

              {/* Step 1: Shipping Address */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] mb-3 flex items-center gap-2">
                  <span>1. Delivery Address</span>
                  {user && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      className="text-[10px] text-[#B48C44] hover:underline font-medium normal-case tracking-normal ml-auto"
                    >
                      {isAddingNewAddress ? 'Select saved address' : '+ Add new address'}
                    </button>
                  )}
                </h3>

                {!isAddingNewAddress && user && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3.5 border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#3D2B1F] bg-[#3D2B1F]/5 ring-1 ring-[#3D2B1F]'
                              : 'border-[#3D2B1F]/15 hover:border-[#3D2B1F]/40'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#3D2B1F]">{addr.fullName}</span>
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#FAF7F2] border border-[#3D2B1F]/20 font-sans">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-[#3D2B1F]/70 line-clamp-2 leading-relaxed">
                            {addr.street}, {addr.city} - {addr.pincode}
                          </p>
                          <span className="text-[11px] text-[#3D2B1F]/60 mt-1 block font-mono">
                            {addr.phone}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#FAF7F2] p-4 border border-[#3D2B1F]/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          placeholder="e.g. Rishanth Reddy"
                          className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-mono focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                        Street Address & Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="House / Flat No., Street, Landmark"
                        className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          placeholder="560038"
                          className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-mono focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] mb-3">
                  2. Payment Method
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: Smartphone },
                    { id: 'Credit / Debit Card', label: 'Cards', icon: CreditCard },
                    { id: 'Netbanking', label: 'Netbanking', icon: Building2 },
                    { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#3D2B1F] bg-[#3D2B1F] text-[#FAF7F2]'
                            : 'border-[#3D2B1F]/20 hover:border-[#3D2B1F]/50 text-[#3D2B1F]'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[10px] uppercase tracking-wider font-sans font-bold leading-tight">
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 p-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10">
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@okaxis or name@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-mono focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                    />
                    <span className="text-[9px] text-[#3D2B1F]/50 mt-1 block">Instant payment request will be sent to your UPI application.</span>
                  </div>
                )}
              </div>

              {/* Step 3: Roast & Delivery Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#3D2B1F]/70 mb-1">
                  Custom Roastery / Packaging Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Extra coarse for Cold Brew, or Leave with Security"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#3D2B1F]"
                />
              </div>

              {/* Summary & Submit */}
              <div className="pt-4 border-t border-[#3D2B1F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] text-[#3D2B1F]/60 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#B48C44]" />
                  <span>256-bit Encrypted Roastery Dispatch</span>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto bg-[#3D2B1F] text-[#FAF7F2] px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span>{isProcessing ? 'Confirming Batch...' : `Place Order (₹${totalAmount})`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
