'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

interface MenuCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const MenuCard = ({ id, name, description, price, image }: MenuCardProps) => {
  const { addItem, items } = useCartStore();
  const cartItem = items.find(item => item.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-playfair mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">{price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
          <button
            onClick={() => addItem({ id, name, price, image })}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <span>Sepete Ekle</span>
            {cartItem && (
              <span className="bg-primary/80 px-2 py-1 rounded-full text-xs ml-2">
                {cartItem.quantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard; 