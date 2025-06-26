'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuCard from '@/components/MenuCard'
import Cart from '@/components/Cart'
import { useCartStore } from '@/store/cartStore'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  description: string | null;
  menuItems: MenuItem[];
}

const getItemImage = (categoryId: number, itemName: string) => {
  const imageMap: { [key: string]: string } = {
    // Burgers (categoryId: 1)
    'Classic Burger': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    'Cheeseburger': 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    'BBQ Burger': 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
    
    // Pizzas (categoryId: 2)
    'Margherita Pizza': 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
    'Pepperoni Pizza': 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg',
    'Mixed Pizza': 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
    
    // Beverages (categoryId: 3)
    'Cola': 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
    'Ayran': 'https://images.pexels.com/photos/4051402/pexels-photo-4051402.jpeg',
    'Lemonade': 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
    
    // Desserts (categoryId: 4)
    'Chocolate Souffle': 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
    'Tiramisu': 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg',
    'Cheesecake': 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
  };

  return imageMap[itemName] || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg';
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/menu')
        const data = await response.json()
        // Add images to menu items
        const dataWithImages = data.map((category: Category) => ({
          ...category,
          menuItems: category.menuItems.map(item => ({
            ...item,
            image: getItemImage(category.id, item.name)
          }))
        }));
        setCategories(dataWithImages)
        if (dataWithImages.length > 0) {
          setSelectedCategory(dataWithImages[0].id)
        }
      } catch (error) {
        console.error('Error loading menu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const selectedCategoryItems = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.menuItems || []
    : categories[0]?.menuItems || []

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
      
      <div className="flex overflow-x-auto gap-4 mb-8 pb-2 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategoryItems.map((item) => (
          <MenuCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Cart />
      </div>
    </div>
  )
} 