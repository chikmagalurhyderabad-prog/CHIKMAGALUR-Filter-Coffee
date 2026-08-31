import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Coffee, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Truck, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  Edit3, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ShippingAddress, UserPreferences, Order } from '../types';

export default function Profile() {
  const { 
    user, 
    orders, 
    updateProfile, 
    updatePreferences, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress,
    logout
  } = useAuth();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'preferences' | 'addresses' | 'account'>('orders');
  
  // Edit Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Taste Preferences Form State
  const [roastPref, setRoastPref] = useState<UserPreferences['roastPreference']>(
    user?.preferences.roastPreference || 'Medium-Dark'
  );
  const [chicoryPref, setChicoryPref] = useState<UserPreferences['chicoryPreference']>(
    user?.preferences.chicoryPreference || '80:20 Blend'
  );
  const [brewMethod, setBrewMethod] = useState<UserPreferences['brewingMethod']>(
    user?.preferences.brewingMethod || 'Traditional South Indian Brass Drip'
  );
  const [milkType, setMilkType] = useState<UserPreferences['milkType']>(
    user?.preferences.milkType || 'Whole Milk'
  );
  const [prefSuccessMsg, setPrefSuccessMsg] = useState<string | null>(null);

  // Address Modal/State
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrState, setAddrState] = useState('Karnataka');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');

  if (!user) {
    return (
      <div className="bg-[#FFFFFF] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center border border-[#593222]/15 p-8 sm:p-10 bg-[#FFFFFF]">
          <div className="w-16 h-16 rounded-full border border-[#593222]/20 flex items-center justify-center mx-auto mb-4 text-[#B48C44]">
            <User className="w-8 h-8 opacity-50" />
          </div>
          <h2 className="text-2xl font-serif text-[#593222] mb-2">Member Access</h2>
          <p className="text-xs text-[#593222]/70 font-sans leading-relaxed mb-6">
            Sign in to access your Chikmagalur order history, saved roastery addresses, and custom brewing preferences.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#593222] text-[#FFFFFF] py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
          >
            Access Kaapi Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setProfileSuccessMsg('Account details successfully updated.');
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      roastPreference: roastPref,
      chicoryPreference: chicoryPref,
      brewingMethod: brewMethod,
      milkType: milkType
    });
    setPrefSuccessMsg('Brewing profile updated. Roastery recommendations customized.');
    setTimeout(() => setPrefSuccessMsg(null), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrStreet || !addrPincode) return;

    addAddress({
      fullName: addrName,
      phone: addrPhone || user.phone || '+91 98765 43210',
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      label: addrLabel,
      isDefault: user.addresses.length === 0
    });

    setIsAddingAddr(false);
    setAddrName('');
    setAddrPhone('');
    setAddrStreet('');
    setAddrPincode('');
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.productId,
        name: item.name,
        price: `₹ ${item.unitPrice}.00`,
        rawPrice: item.unitPrice,
        category: 'powder',
        image: item.image,
        description: `Handcrafted blend (${item.weight})`
      }, {
        grind: item.grind,
        weight: item.weight,
        quantity: item.quantity
      });
    });
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#593222] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Identity Header */}
        <div className="border border-[#593222]/15 p-6 sm:p-10 bg-[#FFFFFF] mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#593222] text-[#FFFFFF] flex items-center justify-center text-2xl font-serif italic border-2 border-[#B48C44]/40 flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#593222]">
                  {user.name}
                </h1>
                <span className="bg-[#B48C44]/15 text-[#B48C44] border border-[#B48C44]/30 text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5">
                  Heritage Connoisseur
                </span>
              </div>
              <p className="text-xs font-sans text-[#593222]/70 mt-1">
                {user.email} &bull; Member Since {user.memberSince || '2024'}
              </p>
              <p className="text-[11px] font-sans text-[#B48C44] mt-1 italic font-serif">
                Preferred Brew: {user.preferences.roastPreference} ({user.preferences.chicoryPreference})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 md:flex-none bg-[#593222] text-[#FFFFFF] px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer text-center"
            >
              Shop New Batches
            </button>
            <button
              onClick={logout}
              className="p-3 border border-[#593222]/20 text-[#593222]/70 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#593222]/15 mb-8 overflow-x-auto gap-2 sm:gap-6 pb-px">
          {[
            { id: 'orders', label: 'Order History', icon: Package, count: orders.length },
            { id: 'preferences', label: 'Brewing Profile', icon: Coffee },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user.addresses.length },
            { id: 'account', label: 'Account Details', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 py-3 px-3 text-xs uppercase tracking-[0.15em] font-sans font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#593222] text-[#593222] bg-[#593222]/5'
                    : 'border-transparent text-[#593222]/60 hover:text-[#593222] hover:border-[#593222]/30'
                }`}
              >
                <Icon className="w-4 h-4 text-[#B48C44]" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-[#593222]/10 px-1.5 py-0.2 rounded-full font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}

        {/* 1. Orders Section */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="p-12 text-center border border-[#593222]/10 bg-[#FFFFFF]">
                <Package className="w-10 h-10 text-[#B48C44] opacity-40 mx-auto mb-3" />
                <h3 className="text-xl font-serif text-[#593222] mb-1">No Orders Yet</h3>
                <p className="text-xs text-[#593222]/60 max-w-sm mx-auto mb-6">
                  Experience the genuine aroma of Chikmagalur single-estate kaapi delivered to your door.
                </p>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-[#593222] text-[#FFFFFF] px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors"
                >
                  Order Coffee
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const getStatusColor = (status: Order['status']) => {
                  switch (status) {
                    case 'Delivered':
                      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
                    case 'In Transit':
                      return 'bg-blue-100 text-blue-900 border-blue-300';
                    case 'Dispatched from Chikmagalur':
                      return 'bg-amber-100 text-amber-900 border-amber-300';
                    default:
                      return 'bg-[#B48C44]/15 text-[#593222] border-[#B48C44]/40';
                  }
                };

                return (
                  <div 
                    key={order.id}
                    className="border border-[#593222]/15 bg-[#FFFFFF] overflow-hidden transition-all duration-300"
                  >
                    {/* Order Bar */}
                    <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#593222]/10 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#593222]">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-0.5 border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#593222]/60 font-sans block mt-1">
                          Placed on {order.date} &bull; Paid via {order.paymentMethod}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider font-sans text-[#593222]/60 block">Total</span>
                          <span className="text-lg font-serif font-bold text-[#B48C44]">₹{order.total}</span>
                        </div>
                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-[#593222] text-[#FFFFFF] px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="p-5 sm:p-6 divide-y divide-[#593222]/10">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-14 h-16 object-cover bg-[#593222]/5 border border-[#593222]/10 flex-shrink-0"
                            />
                            <div>
                              <h4 className="text-sm font-serif font-medium text-[#593222]">{item.name}</h4>
                              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-sans text-[#593222]/60 mt-1">
                                <span>{item.weight}</span>
                                <span>&bull;</span>
                                <span>{item.grind}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-xs font-sans">
                            <span className="text-[#593222]/70">Qty: {item.quantity}</span>
                            <span className="font-serif font-bold text-[#593222] block text-sm mt-0.5">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Footer */}
                    <div className="bg-[#593222]/5 px-5 sm:px-6 py-3 border-t border-[#593222]/10 flex flex-col sm:flex-row justify-between text-xs font-sans text-[#593222]/70">
                      <div>
                        <strong>Delivery Address:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                      </div>
                      {order.notes && (
                        <div className="mt-1 sm:mt-0 italic">
                          <strong>Notes:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. Brewing Preferences Section */}
        {activeTab === 'preferences' && (
          <div className="border border-[#593222]/15 bg-[#FFFFFF] p-6 sm:p-10 max-w-3xl">
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-medium text-[#593222] mb-1">
                Your Chikmagalur Taste Profile
              </h2>
              <p className="text-xs font-sans text-[#593222]/70">
                Personalize your roast levels and chicory blend ratios. Our roastery team crafts your order based on these preferences.
              </p>
            </div>

            {prefSuccessMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{prefSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-8">
              
              {/* Preferred Roast */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-sans font-bold text-[#593222] mb-3">
                  1. Preferred Roast Intensity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Light', 'Medium', 'Medium-Dark', 'Dark'] as UserPreferences['roastPreference'][]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoastPref(r)}
                      className={`p-3 text-center border text-xs font-sans transition-all cursor-pointer ${
                        roastPref === r
                          ? 'border-[#593222] bg-[#593222] text-[#FFFFFF] font-bold'
                          : 'border-[#593222]/20 text-[#593222] hover:border-[#593222]/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chicory Ratio */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-sans font-bold text-[#593222] mb-3">
                  2. Chicory Ratio Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: '100% Pure Kaapi', desc: 'Single origin, no chicory' },
                    { id: '80:20 Blend', desc: 'Classic South Indian Kaapi' },
                    { id: '70:30 Traditional', desc: 'Extra thick decoction & heavy body' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChicoryPref(c.id as any)}
                      className={`p-4 text-left border transition-all cursor-pointer ${
                        chicoryPref === c.id
                          ? 'border-[#593222] bg-[#593222] text-[#FFFFFF]'
                          : 'border-[#593222]/20 text-[#593222] hover:border-[#593222]/50'
                      }`}
                    >
                      <span className="block text-xs font-bold font-sans uppercase tracking-wider mb-1">
                        {c.id}
                      </span>
                      <span className="text-[10px] opacity-75 font-sans block leading-tight">
                        {c.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brewing Method */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-sans font-bold text-[#593222] mb-3">
                  3. Primary Brewing Apparatus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Traditional South Indian Brass Drip',
                    'Moka Pot',
                    'French Press',
                    'Pour Over / V60',
                    'AeroPress'
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setBrewMethod(m as any)}
                      className={`p-3 text-left border text-xs font-sans transition-all cursor-pointer ${
                        brewMethod === m
                          ? 'border-[#593222] bg-[#593222] text-[#FFFFFF] font-bold'
                          : 'border-[#593222]/20 text-[#593222] hover:border-[#593222]/50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#593222] text-[#FFFFFF] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
              >
                Save Taste Preferences
              </button>

            </form>
          </div>
        )}

        {/* 3. Addresses Section */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-medium text-[#593222]">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs font-sans text-[#593222]/70">
                  Manage doorstep locations for your fresh roastery shipments.
                </p>
              </div>
              <button
                onClick={() => setIsAddingAddr(true)}
                className="bg-[#593222] text-[#FFFFFF] px-5 py-2.5 text-[10px] uppercase tracking-wider font-sans font-bold hover:bg-[#B48C44] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Form Card if active */}
            {isAddingAddr && (
              <form onSubmit={handleCreateAddress} className="border border-[#593222]/30 bg-[#FFFFFF] p-6 sm:p-8 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm uppercase tracking-wider font-sans font-bold text-[#593222]">
                    New Delivery Location
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddr(false)}
                    className="text-xs text-[#593222]/60 hover:text-[#593222]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="Receiver's name"
                      className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-mono focus:outline-none focus:border-[#B48C44] text-[#593222]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">Street Address, Apartment, Area *</label>
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="Flat No, Wing, Street, Landmark"
                    className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">City</label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">State</label>
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-[#593222]/70 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      placeholder="560038"
                      className="w-full border-b border-[#593222]/20 bg-transparent py-1.5 text-xs font-mono focus:outline-none focus:border-[#B48C44] text-[#593222]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  {(['Home', 'Office', 'Other'] as const).map(l => (
                    <label key={l} className="flex items-center gap-2 text-xs font-sans cursor-pointer text-[#593222]">
                      <input
                        type="radio"
                        name="addrLabel"
                        checked={addrLabel === l}
                        onChange={() => setAddrLabel(l)}
                        className="accent-[#593222]"
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-[#593222] text-[#FFFFFF] px-6 py-2.5 text-[10px] uppercase tracking-wider font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
                >
                  Save Address
                </button>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`border p-6 bg-[#FFFFFF] relative transition-all ${
                    addr.isDefault 
                      ? 'border-[#593222] ring-1 ring-[#593222]' 
                      : 'border-[#593222]/15 hover:border-[#593222]/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#593222]">
                        {addr.fullName}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-sans px-2 py-0.5 bg-[#593222]/10 text-[#593222]">
                        {addr.label}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[9px] uppercase tracking-widest font-sans font-bold bg-[#B48C44] text-[#FFFFFF] px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-sans text-[#593222]/80 leading-relaxed mb-4">
                    {addr.street}, {addr.landmark && `${addr.landmark}, `}
                    {addr.city}, {addr.state} - <span className="font-mono font-bold">{addr.pincode}</span>
                  </p>
                  
                  <span className="text-xs font-mono text-[#593222]/60 block mb-6">
                    {addr.phone}
                  </span>

                  <div className="flex items-center justify-between pt-3 border-t border-[#593222]/10 text-[10px] uppercase tracking-wider font-sans font-semibold">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[#593222] hover:text-[#B48C44] cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-800 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> Default Delivery Location
                      </span>
                    )}

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 4. Account Settings Section */}
        {activeTab === 'account' && (
          <div className="border border-[#593222]/15 bg-[#FFFFFF] p-6 sm:p-10 max-w-2xl">
            <h2 className="text-2xl font-serif font-medium text-[#593222] mb-1">
              Personal Information
            </h2>
            <p className="text-xs font-sans text-[#593222]/70 mb-8">
              Update your contact credentials for roastery notifications and billing invoices.
            </p>

            {profileSuccessMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-sans font-bold text-[#593222] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-[#593222]/20 bg-transparent py-2 text-sm font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-sans font-bold text-[#593222] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-[#593222]/20 bg-transparent py-2 text-sm font-serif focus:outline-none focus:border-[#B48C44] text-[#593222]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-sans font-bold text-[#593222] mb-2">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-[#593222]/20 bg-transparent py-2 text-sm font-mono focus:outline-none focus:border-[#B48C44] text-[#593222]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#593222] text-[#FFFFFF] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors cursor-pointer"
                >
                  Update Information
                </button>

                <div className="flex items-center gap-1 text-[10px] font-sans text-[#593222]/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B48C44]" />
                  <span>Encrypted Data Privacy</span>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
