import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

type MenuItemWithPrice = {
  id: number;
  price: {
    toString(): string;
    toNumber(): number;
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    // Ürünleri veritabanından al
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: items.map((item: { id: number }) => item.id),
        },
      },
    });

    // Toplam tutarı hesapla
    const totalAmount = menuItems.reduce((total: number, menuItem: MenuItemWithPrice) => {
      const orderItem = items.find((item: { id: number }) => item.id === menuItem.id);
      return total + (menuItem.price.toNumber() * (orderItem?.quantity || 1));
    }, 0);

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        totalAmount: totalAmount.toFixed(2),
        orderItems: {
          create: items.map((item: { id: number; quantity: number }) => {
            const menuItem = menuItems.find((mi: MenuItemWithPrice) => mi.id === item.id);
            const price = menuItem?.price || 0;
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              unitPrice: typeof price === 'number' ? price.toString() : price.toString(),
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
      message: 'Sipariş başarıyla oluşturuldu',
      order 
    });
  } catch (error) {
    console.error('Checkout hatası:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 