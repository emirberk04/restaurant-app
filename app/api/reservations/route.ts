import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phoneNumber, date, time, numberOfGuests, specialRequests } = body;

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phoneNumber,
        date: new Date(date),
        time,
        numberOfGuests,
        specialRequests,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Rezervasyon başarıyla oluşturuldu',
      reservation,
    });
  } catch (error) {
    console.error('Rezervasyon hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Rezervasyon sorgulama hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyonlar alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { reservationId, status } = body;

    if (!reservationId || !status || !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz rezervasyon ID veya durum' },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
    });

    return NextResponse.json({
      message: 'Rezervasyon durumu güncellendi',
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error('Rezervasyon güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 