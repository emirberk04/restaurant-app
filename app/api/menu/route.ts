import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Fallback static menu data
const fallbackMenuData = [
  {
    id: 1,
    name: 'Burgers',
    description: 'Delicious burgers',
    menuItems: [
      {
        id: 1,
        name: 'Classic Burger',
        description: 'Beef patty, cheddar cheese, lettuce, tomato, pickles and our special sauce',
        price: 150,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
        categoryId: 1,
      },
      {
        id: 2,
        name: 'Cheeseburger',
        description: 'Beef patty, double cheddar cheese, caramelized onions',
        price: 160,
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
        categoryId: 1,
      },
      {
        id: 3,
        name: 'BBQ Burger',
        description: 'Beef patty, BBQ sauce, cheddar cheese, crispy onions',
        price: 170,
        image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
        categoryId: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Pizzas',
    description: 'Exquisite pizzas',
    menuItems: [
      {
        id: 4,
        name: 'Margherita Pizza',
        description: 'Tomato sauce, mozzarella cheese, fresh basil',
        price: 140,
        image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
        categoryId: 2,
      },
      {
        id: 5,
        name: 'Pepperoni Pizza',
        description: 'Tomato sauce, mozzarella cheese, pepperoni',
        price: 160,
        image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg',
        categoryId: 2,
      },
      {
        id: 6,
        name: 'Mixed Pizza',
        description: 'Tomato sauce, mozzarella cheese, sausage, mushrooms, peppers',
        price: 180,
        image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
        categoryId: 2,
      },
    ],
  },
  {
    id: 3,
    name: 'Beverages',
    description: 'Refreshing drinks',
    menuItems: [
      {
        id: 7,
        name: 'Cola',
        description: 'Chilled cola',
        price: 30,
        image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
        categoryId: 3,
      },
      {
        id: 8,
        name: 'Ayran',
        description: 'Fresh ayran (Turkish yogurt drink)',
        price: 20,
        image: 'https://images.pexels.com/photos/4051402/pexels-photo-4051402.jpeg',
        categoryId: 3,
      },
      {
        id: 9,
        name: 'Lemonade',
        description: 'Homemade lemonade',
        price: 35,
        image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
        categoryId: 3,
      },
    ],
  },
  {
    id: 4,
    name: 'Desserts',
    description: 'Sweet alternatives',
    menuItems: [
      {
        id: 10,
        name: 'Chocolate Souffle',
        description: 'Hot chocolate souffle',
        price: 80,
        image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
        categoryId: 4,
      },
      {
        id: 11,
        name: 'Tiramisu',
        description: 'Italian style tiramisu',
        price: 70,
        image: 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg',
        categoryId: 4,
      },
      {
        id: 12,
        name: 'Cheesecake',
        description: 'New York style cheesecake',
        price: 75,
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
        categoryId: 4,
      },
    ],
  },
];

export async function GET() {
  try {
    // Try to get data from database first
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (categories && categories.length > 0) {
      return NextResponse.json(categories);
    }

    // If no database data, return fallback data
    console.log('Using fallback menu data');
    return NextResponse.json(fallbackMenuData);
  } catch (error) {
    console.log('Database error, using fallback menu data:', error);
    // If database error, return fallback data
    return NextResponse.json(fallbackMenuData);
  }
} 