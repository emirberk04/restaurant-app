import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

interface MenuItem {
  id: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    // Get products from database
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: items.map((item: { id: number }) => item.id),
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    // Convert to MenuItem type with number price
    const convertedMenuItems: MenuItem[] = menuItems.map(item => ({
      id: item.id,
      price: Number(item.price)
    }));

    // Calculate total amount
    const totalAmount = convertedMenuItems.reduce((total: number, menuItem: MenuItem) => {
      const orderItem = items.find((item: { id: number }) => item.id === menuItem.id);
      return total + (menuItem.price * (orderItem?.quantity || 1));
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        totalAmount: totalAmount.toFixed(2),
        orderItems: {
          create: items.map((item: { id: number; quantity: number }) => {
            const menuItem = convertedMenuItems.find((mi: MenuItem) => mi.id === item.id);
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              unitPrice: menuItem ? menuItem.price.toString() : '0',
            };
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the order' },
      { status: 500 }
    );
  }
} 