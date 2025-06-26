'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function MenuPage() {
  const params = useParams();
  const tableId = params?.tableId as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem, items } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/menu-items')
        ]);

        const categoriesData = await categoriesRes.json();
        const menuItemsData = await menuItemsRes.json();

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="bg-white shadow-md p-4 mb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center mb-4">Menü</h1>
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        {filteredItems.map((item) => {
          const cartItem = items.find(i => i.id === item.id);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">₺{item.price}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Sepete Ekle</span>
                    {cartItem && (
                      <span className="bg-blue-700 px-2 py-1 rounded-full text-sm">
                        {cartItem.quantity}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-up p-4">
          <button
            onClick={() => window.location.href = `/checkout?table=${tableId}`}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Siparişi Tamamla</span>
            <span className="bg-blue-700 px-2 py-1 rounded-full text-sm">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
} 