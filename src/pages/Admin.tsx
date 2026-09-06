import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Coupon } from '../types';
import { productsData as initialMockProducts } from '../data/products';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, UploadCloud, Tag, Package, ShoppingBag } from 'lucide-react';

type Tab = 'products' | 'orders' | 'coupons';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isEditingCoupon, setIsEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'coupons') {
      fetchCoupons();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('products').select('*').order('id');
      if (err) throw err;
      setProducts(data || []);
    } catch (err) {
      console.warn("Supabase fetch failed", err);
      const savedMock = localStorage.getItem('chk_mock_products');
      if (savedMock) {
        setProducts(JSON.parse(savedMock));
      } else {
        setProducts(initialMockProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setCoupons(data || []);
    } catch (err) {
      console.warn("Failed to fetch coupons", err);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setOrders(data || []);
    } catch (err) {
      console.warn("Failed to fetch orders", err);
    }
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error: err } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (err) throw err;
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Error updating order status");
    }
  };

  const handleSaveCoupon = async (coupon: Partial<Coupon>) => {
    try {
      if (coupon.id) {
        const { error: err } = await supabase.from('coupons').update(coupon).eq('id', coupon.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('coupons').insert([coupon]);
        if (err) throw err;
      }
      await fetchCoupons();
      setIsEditingCoupon(null);
    } catch (err) {
      console.error("Failed to save coupon", err);
      alert("Error saving coupon.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const { error: err } = await supabase.from('coupons').delete().eq('id', id);
      if (err) throw err;
      await fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
      alert("Error deleting coupon.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload an image. Please ensure the 'product-images' bucket exists and is public.");
      }
    }
    
    if (uploadedUrls.length > 0 && isEditing) {
      const currentImages = isEditing.additionalImages || [];
      const primaryImage = isEditing.image || uploadedUrls[0];
      setIsEditing({
        ...isEditing, 
        image: primaryImage,
        additionalImages: [...currentImages, ...uploadedUrls]
      });
    }
    
    setIsUploading(false);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const { error: err } = await supabase.from('products').upsert(updatedProduct);
      if (err) throw err;
      await fetchProducts();
    } catch (err) {
      console.warn("Supabase save failed. Saving to local mock data.", err);
      const currentProducts = [...products];
      const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
      if (index >= 0) {
        currentProducts[index] = updatedProduct;
      } else {
        updatedProduct.id = Date.now();
        currentProducts.push(updatedProduct);
      }
      setProducts(currentProducts);
      localStorage.setItem('chk_mock_products', JSON.stringify(currentProducts));
      window.dispatchEvent(new Event('chk_products_updated'));
    }
    setIsEditing(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error: err } = await supabase.from('products').delete().eq('id', id);
      if (err) throw err;
      await fetchProducts();
    } catch (err) {
      console.warn("Supabase delete failed. Deleting from local mock data.");
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('chk_mock_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('chk_products_updated'));
    }
  };

  const startNewProduct = () => {
    setIsEditing({
      id: 0,
      name: '',
      description: '',
      price: '',
      rawPrice: 0,
      category: 'powder',
      image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80',
      additionalImages: []
    });
  };

  const startNewCoupon = () => {
    setIsEditingCoupon({
      code: '',
      discount_percentage: 10,
      is_active: true
    });
  };

  const renderProductsTab = () => (
    <div className="bg-white border border-[#593222]/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#593222]/10 flex justify-between items-center bg-[#593222]/5">
        <h2 className="text-lg font-serif text-[#593222]">Products</h2>
        <button 
          onClick={startNewProduct}
          className="bg-[#593222] text-[#FFFFFF] px-4 py-2 uppercase tracking-[0.1em] text-xs font-bold hover:bg-[#B48C44] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#593222]/50">
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p className="font-sans text-sm">Loading products...</p>
        </div>
      ) : (
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#593222]/5 border-b border-[#593222]/10 uppercase tracking-wider text-[10px] text-[#593222]/70 font-bold">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#593222]/10">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-[#593222]/10 border border-[#593222]/20 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 font-serif font-medium text-[#593222]">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-[#593222]/5 border border-[#593222]/10 px-2 py-1 text-[10px] uppercase tracking-wider">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#593222]">
                  ₹{product.rawPrice}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setIsEditing(product)}
                    className="p-2 text-[#593222]/50 hover:text-[#B48C44] transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-[#593222]/50 hover:text-red-700 transition-colors ml-1"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#593222]/50 font-serif italic">
                  No products found. Start by adding a new product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderCouponsTab = () => (
    <div className="bg-white border border-[#593222]/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#593222]/10 flex justify-between items-center bg-[#593222]/5">
        <h2 className="text-lg font-serif text-[#593222]">Coupons</h2>
        <button 
          onClick={startNewCoupon}
          className="bg-[#593222] text-[#FFFFFF] px-4 py-2 uppercase tracking-[0.1em] text-xs font-bold hover:bg-[#B48C44] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#593222]/50">
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p className="font-sans text-sm">Loading coupons...</p>
        </div>
      ) : (
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#593222]/5 border-b border-[#593222]/10 uppercase tracking-wider text-[10px] text-[#593222]/70 font-bold">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#593222]/10">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#593222]">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-[#593222]">
                  {coupon.discount_percentage}%
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setIsEditingCoupon(coupon)}
                    className="p-2 text-[#593222]/50 hover:text-[#B48C44] transition-colors"
                    title="Edit Coupon"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-2 text-[#593222]/50 hover:text-red-700 transition-colors ml-1"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#593222]/50 font-serif italic">
                  No coupons found. Start by creating a new coupon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="bg-white border border-[#593222]/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#593222]/10 bg-[#593222]/5">
        <h2 className="text-lg font-serif text-[#593222]">Orders</h2>
      </div>
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#593222]/50">
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p className="font-sans text-sm">Loading orders...</p>
        </div>
      ) : (
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#593222]/5 border-b border-[#593222]/10 uppercase tracking-wider text-[10px] text-[#593222]/70 font-bold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#593222]/10">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#593222]">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-[#593222]/80">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-bold text-[#593222]">
                  ₹{order.total}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="bg-white border border-[#593222]/20 px-2 py-1 text-xs focus:outline-none focus:border-[#B48C44] rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#593222]/50 font-serif italic">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Mobile Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-[#593222]/10 p-4 sticky top-6">
            <h3 className="text-xs uppercase tracking-wider text-[#593222] font-bold mb-4 px-2">Navigation</h3>
            <nav className="space-y-1 flex md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible">
              <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded ${activeTab === 'products' ? 'bg-[#593222]/10 text-[#593222]' : 'text-[#593222]/70 hover:bg-[#593222]/5'}`}
              >
                <ShoppingBag className="w-4 h-4" /> Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded ${activeTab === 'orders' ? 'bg-[#593222]/10 text-[#593222]' : 'text-[#593222]/70 hover:bg-[#593222]/5'}`}
              >
                <Package className="w-4 h-4" /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded ${activeTab === 'coupons' ? 'bg-[#593222]/10 text-[#593222]' : 'text-[#593222]/70 hover:bg-[#593222]/5'}`}
              >
                <Tag className="w-4 h-4" /> Coupons
              </button>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-[#593222]/10">
              <nav className="space-y-1">
                <a href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors text-[#593222]/70 hover:text-[#593222] hover:bg-[#593222]/5 rounded">
                  Back to Store
                </a>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href='/'; }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors text-red-600/70 hover:text-red-700 hover:bg-red-50 rounded">
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#593222] mb-2">Admin Dashboard</h1>
            <p className="text-[#593222]/70 font-sans text-sm">
              Manage your store operations seamlessly.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 font-sans text-sm">
              {error}
            </div>
          )}

          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'coupons' && renderCouponsTab()}
        </div>
      </div>

      {/* Coupon Edit Modal */}
      {isEditingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] w-full max-w-md shadow-xl border border-[#593222]/20 flex flex-col">
            <div className="p-6 border-b border-[#593222]/10 flex justify-between items-center bg-white">
              <h2 className="text-xl font-serif text-[#593222]">
                {isEditingCoupon.id ? 'Edit Coupon' : 'New Coupon'}
              </h2>
              <button onClick={() => setIsEditingCoupon(null)} className="text-[#593222]/50 hover:text-[#593222]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Coupon Code (Uppercase)</label>
                <input 
                  type="text" 
                  value={isEditingCoupon.code || ''}
                  onChange={e => {
                     const code = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                     setIsEditingCoupon({...isEditingCoupon, code})
                  }}
                  className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44] uppercase"
                  placeholder="e.g. WELCOME20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Discount Percentage (1-100)</label>
                <input 
                  type="text" 
                  value={isEditingCoupon.discount_percentage || ''}
                  onChange={e => {
                     const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                     let num = parseInt(cleanVal) || 0;
                     if (num > 100) num = 100;
                     setIsEditingCoupon({...isEditingCoupon, discount_percentage: num})
                  }}
                  className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  placeholder="e.g. 15"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={isEditingCoupon.is_active !== false}
                  onChange={e => setIsEditingCoupon({...isEditingCoupon, is_active: e.target.checked})}
                  className="w-4 h-4 text-[#B48C44] focus:ring-[#B48C44] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-[#593222]">Active Coupon</label>
              </div>
            </div>

            <div className="p-6 border-t border-[#593222]/10 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsEditingCoupon(null)}
                className="px-6 py-2.5 border border-[#593222]/20 text-[#593222] text-xs uppercase tracking-wider font-bold hover:bg-[#FFFFFF]"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveCoupon(isEditingCoupon)}
                className="px-6 py-2.5 bg-[#B48C44] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#8e6e33]"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] w-full max-w-2xl shadow-xl border border-[#593222]/20 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#593222]/10 flex justify-between items-center bg-white">
              <h2 className="text-xl font-serif text-[#593222]">
                {isEditing.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsEditing(null)} className="text-[#593222]/50 hover:text-[#593222]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={isEditing.name}
                    onChange={e => setIsEditing({...isEditing, name: e.target.value})}
                    className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={isEditing.description}
                    onChange={e => setIsEditing({...isEditing, description: e.target.value})}
                    className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Price (Numeric)</label>
                  <input 
                    type="number" 
                    value={isEditing.rawPrice}
                    onChange={e => {
                      const num = parseInt(e.target.value) || 0;
                      setIsEditing({...isEditing, rawPrice: num, price: `₹${num}`});
                    }}
                    className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">Category</label>
                  <select 
                    value={isEditing.category}
                    onChange={e => setIsEditing({...isEditing, category: e.target.value as any})}
                    className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  >
                    <option value="powder">Filter Powder</option>
                    <option value="beans">Coffee Beans</option>
                    <option value="estate">Estate Specials</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Upload Images
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#593222]/10 file:text-[#593222]
                        hover:file:bg-[#593222]/20"
                    />
                    {isUploading && <RefreshCw className="w-5 h-5 animate-spin text-[#593222]" />}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4">
                    {isEditing.image && (
                      <div className="relative group w-24 h-24 border border-[#593222]/20">
                        <img src={isEditing.image} alt="Primary" className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 bg-[#B48C44] text-white text-[10px] px-1 font-bold">Main</div>
                      </div>
                    )}
                    {isEditing.additionalImages && isEditing.additionalImages.map((img, idx) => (
                      <div key={idx} className="relative group w-24 h-24 border border-[#593222]/20">
                        <img src={img} alt={`Additional ${idx}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            const newAdditional = isEditing.additionalImages?.filter((_, i) => i !== idx);
                            setIsEditing({ ...isEditing, additionalImages: newAdditional });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-6 border-t border-[#593222]/10 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsEditing(null)}
                className="px-6 py-2.5 border border-[#593222]/20 text-[#593222] text-xs uppercase tracking-wider font-bold hover:bg-[#FFFFFF]"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveProduct(isEditing)}
                disabled={isUploading}
                className="px-6 py-2.5 bg-[#B48C44] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#8e6e33] disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
