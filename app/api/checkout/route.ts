import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

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

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        tableId: body.tableId || 'default',
        status: 'PENDING',
        orderItems: {
          create: items.map((item: { id: number; quantity: number }) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
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