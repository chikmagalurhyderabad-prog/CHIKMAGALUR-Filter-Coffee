import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { productsData as initialMockProducts } from '../data/products';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase.from('products').select('*').order('id');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        // If table is empty, we might just have no products yet
        setProducts([]);
      }
    } catch (err) {
      console.warn("Supabase fetch failed (likely using placeholder keys). Falling back to mock data.", err);
      // Fallback to local storage or initial mock data
      const savedMock = localStorage.getItem('chk_mock_products');
      if (savedMock) {
        setProducts(JSON.parse(savedMock));
      } else {
        setProducts(initialMockProducts);
        localStorage.setItem('chk_mock_products', JSON.stringify(initialMockProducts));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      // Try saving to Supabase
      const { error } = await supabase
        .from('products')
        .upsert(updatedProduct); // insert or update
        
      if (error) throw error;
      
      await fetchProducts(); // Refresh list
    } catch (err) {
      console.warn("Supabase save failed. Saving to local mock data.", err);
      // Fallback
      let currentProducts = [...products];
      const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
      
      if (index >= 0) {
        currentProducts[index] = updatedProduct;
      } else {
        // If it's new, give it a random ID
        updatedProduct.id = Date.now();
        currentProducts.push(updatedProduct);
      }
      
      setProducts(currentProducts);
      localStorage.setItem('chk_mock_products', JSON.stringify(currentProducts));
      
      // Dispatch an event so the Shop page knows to refresh if it's listening
      window.dispatchEvent(new Event('chk_products_updated'));
    }
    setIsEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
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
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#593222] mb-2">Admin Dashboard</h1>
            <p className="text-[#593222]/70 font-sans text-sm">
              Manage your products in real-time. Changes here will immediately reflect on the shop page.
            </p>
          </div>
          <button 
            onClick={startNewProduct}
            className="bg-[#593222] text-[#FFFFFF] px-4 py-2 uppercase tracking-[0.1em] text-xs font-bold hover:bg-[#B48C44] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 font-sans text-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-[#593222]/10 shadow-sm overflow-hidden">
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
                        onClick={() => handleDelete(product.id)}
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
      </div>

      {/* Edit/Add Modal */}
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
                    <ImageIcon className="w-4 h-4" /> Image URL
                  </label>
                  <input 
                    type="text" 
                    value={isEditing.image}
                    onChange={e => setIsEditing({...isEditing, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white border border-[#593222]/20 px-3 py-2 text-sm focus:outline-none focus:border-[#B48C44]"
                  />
                  {isEditing.image && (
                    <div className="mt-3 w-32 h-32 border border-[#593222]/20 bg-[#593222]/5 overflow-hidden">
                      <img src={isEditing.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
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
                onClick={() => handleSave(isEditing)}
                className="px-6 py-2.5 bg-[#B48C44] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#8e6e33]"
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
