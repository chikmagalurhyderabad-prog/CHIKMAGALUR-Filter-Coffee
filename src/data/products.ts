import { Product } from '../types';
import { supabase } from '../lib/supabase';

export const productsData: Product[] = [
  {
    id: 1,
    name: "Grand Aroma Coffee Powder (80:20)",
    price: "₹ 150.00",
    rawPrice: 150,
    category: "powder",
    image: "/images/slide4.jpg",
    description: "Premium blend of 80% Coffee and 20% Chicory for authentic South Indian filter decoction.",
    roastProfile: "Medium-Dark Roast",
    weight: "500g"
  },
  {
    id: 2,
    name: "Pure Filter Coffee Powder",
    price: "₹ 180.00",
    rawPrice: 180,
    category: "powder",
    image: "/images/slide5.jpg",
    description: "100% Pure plantation Arabica & Robusta coffee for the perfect strong aromatic cup.",
    roastProfile: "Dark Roast",
    weight: "500g"
  },
  {
    id: 3,
    name: "Peaberry Roasted Beans",
    price: "₹ 400.00",
    rawPrice: 400,
    category: "beans",
    image: "/images/slide4.jpg",
    description: "Finest handpicked single-bean peaberry, slow roasted to accentuate caramel and chocolate undertones.",
    roastProfile: "Medium Roast",
    weight: "250g"
  },
  {
    id: 4,
    name: "Estate Blend Coffee",
    price: "₹ 200.00",
    rawPrice: 200,
    category: "estate",
    image: "/images/slide5.jpg",
    description: "Signature single-origin blend straight from high-altitude Chikmagalur shade-grown estates.",
    roastProfile: "Medium-Dark Roast",
    weight: "500g"
  },
  {
    id: 5,
    name: "Mysore Nuggets Extra Bold",
    price: "₹ 450.00",
    rawPrice: 450,
    category: "beans",
    image: "/images/slide4.jpg",
    description: "Premium AAA grade washed Arabica beans with a smooth body, mild acidity, and delicate spice notes.",
    roastProfile: "City Roast",
    weight: "250g"
  },
  {
    id: 6,
    name: "Traditional Royal Chicory Blend (70:30)",
    price: "₹ 140.00",
    rawPrice: 140,
    category: "powder",
    image: "/images/slide5.jpg",
    description: "Rich, thick, and lingering brew crafted according to ancestral South Indian coffee traditions.",
    roastProfile: "Dark Roast",
    weight: "500g"
  },
  {
    id: 7,
    name: "Monsooned Malabar AA",
    price: "₹ 420.00",
    rawPrice: 420,
    category: "estate",
    image: "/images/slide4.jpg",
    description: "Naturally aged in monsoon winds to produce a unique mellow cup with velvety crema and low acidity.",
    roastProfile: "Medium Roast",
    weight: "250g"
  },
  {
    id: 8,
    name: "Specialty Robusta Kaapi Royale",
    price: "₹ 260.00",
    rawPrice: 260,
    category: "beans",
    image: "/images/slide5.jpg",
    description: "Exceptional washed Robusta with bold body, intense nutty flavour, and heavy chocolate finish.",
    roastProfile: "Vienna Roast",
    weight: "500g"
  }
];


export async function fetchProducts(category: string = 'all', delayMs: number = 800): Promise<Product[]> {
  // Simulate network delay for UI consistency
  if (delayMs > 0) {
    await new Promise(res => setTimeout(res, delayMs));
  }

  try {
    // Attempt Supabase fetch
    let query = supabase.from('products').select('*');
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        ...item,
        image: item.image_url || item.image,
        price: item.price ? (typeof item.price === 'number' ? `₹ ${item.price.toFixed(2)}` : item.price) : '₹ 0.00',
        rawPrice: item.price ? (typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, ''))) : 0,
      })) as Product[];
    }
  } catch (err) {
    // If Supabase fails (e.g. placeholder keys), fallback to our mock
    console.warn("Supabase fetch failed. Falling back to local mock data.");
  }
  
  // Fallback Logic
  const savedMock = localStorage.getItem('chk_mock_products_v2');
  let currentProducts = savedMock ? JSON.parse(savedMock) : productsData;
  
  if (!savedMock) {
    localStorage.setItem('chk_mock_products_v2', JSON.stringify(productsData));
  }
  
  if (category === 'all') {
    return currentProducts;
  } else {
    return currentProducts.filter((p: Product) => p.category === category);
  }
}
