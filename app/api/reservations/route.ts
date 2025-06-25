import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, time, numberOfGuests, specialRequests, phoneNumber } = body;

    if (!name || !email || !date || !time || !numberOfGuests || !phoneNumber) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurunuz' },
        { status: 400 }
      );
    }

    // Rezervasyonu veritabanına kaydet
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phoneNumber,
        date: new Date(date),
        time,
        numberOfGuests,
        specialRequests,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      message: 'Rezervasyon başarıyla oluşturuldu',
      reservation 
    });

  } catch (error) {
    console.error('Rezervasyon hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const where: any = {};
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
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

    if (!reservationId || !status) {
      return NextResponse.json(
        { error: 'Geçersiz rezervasyon ID veya durum' },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status }
    });

    return NextResponse.json({
      message: 'Rezervasyon durumu güncellendi',
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('Rezervasyon güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 