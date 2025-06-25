import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { items, customerNote } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz sipariş verileri' },
        { status: 400 }
      );
    }

    // Menü öğelerini al
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: items.map(item => item.id),
        },
      },
    });

    // Toplam tutarı hesapla
    const totalAmount = menuItems.reduce((total: number, menuItem: MenuItemWithPrice) => {
      const orderItem = items.find(item => item.id === menuItem.id);
      return total + (menuItem.price.toNumber() * (orderItem?.quantity || 1));
    }, 0);

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        customerNote,
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

    // Mutfağa bildirim gönder (WebSocket veya başka bir yöntemle)
    // TODO: Implement kitchen notification system

    return NextResponse.json({
      message: 'Sipariş başarıyla oluşturuldu',
      order,
    });

  } catch (error) {
    console.error('Sipariş hatası:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Sipariş sorgulama hatası:', error);
    return NextResponse.json(
      { error: 'Siparişler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status || !['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz sipariş ID veya durum' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Sipariş durumu güncellendi',
      order: updatedOrder,
    });

  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Sipariş güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 