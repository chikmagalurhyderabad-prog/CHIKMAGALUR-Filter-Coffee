import { Product } from '../types';

export const productsData: Product[] = [
  {
    id: 1,
    name: "Grand Aroma Coffee Powder (80:20)",
    price: "₹ 150.00",
    rawPrice: 150,
    category: "powder",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Exceptional washed Robusta with bold body, intense nutty flavour, and heavy chocolate finish.",
    roastProfile: "Vienna Roast",
    weight: "500g"
  }
];

export async function fetchProducts(category: string = 'all', delayMs: number = 800): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category === 'all') {
        resolve(productsData);
      } else {
        resolve(productsData.filter(p => p.category === category));
      }
    }, delayMs);
  });
}
