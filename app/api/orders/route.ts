import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, tableId, customerNote } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !tableId) {
      return NextResponse.json(
        { error: 'Geçersiz sipariş verileri' },
        { status: 400 }
      );
    }

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        tableId,
        status: 'PENDING',
        customerNote,
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
    const tableId = searchParams.get('tableId');
    const status = searchParams.get('status');

    const where: any = {};
    if (tableId) where.tableId = tableId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: true,
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
        table: true,
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