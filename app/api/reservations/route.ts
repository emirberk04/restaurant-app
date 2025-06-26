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
    console.log('🚀 REZERVASYON API DEBUG - BAŞLANGIC');
    
    const body = await request.json();
    console.log('📝 Request Body:', body);
    
    const { name, email, phoneNumber, date, time, numberOfGuests, specialRequests } = body;
    
    console.log('📋 Extracted Fields:');
    console.log('  - name:', name);
    console.log('  - email:', email);
    console.log('  - phoneNumber:', phoneNumber);
    console.log('  - date:', date);
    console.log('  - time:', time);
    console.log('  - numberOfGuests:', numberOfGuests, '(type:', typeof numberOfGuests, ')');
    console.log('  - specialRequests:', specialRequests);

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phoneNumber) missingFields.push('phoneNumber');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!numberOfGuests) missingFields.push('numberOfGuests');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun', missingFields },
        { status: 400 }
      );
    }

    // Process date
    const processedDate = new Date(date);
    const processedGuests = parseInt(numberOfGuests.toString());
    
    console.log('🔄 Processing Data:');
    console.log('  - Original date:', date);
    console.log('  - Processed date:', processedDate);
    console.log('  - Original numberOfGuests:', numberOfGuests);
    console.log('  - Processed numberOfGuests:', processedGuests);

    const reservationData = {
      name,
      email,
      phoneNumber,
      date: processedDate,
      time,
      numberOfGuests: processedGuests,
      specialRequests: specialRequests || '',
      status: 'PENDING' as const,
    };

    console.log('🗄️ Database Insert Data:', reservationData);
    console.log('🔗 Attempting to create reservation in database...');

    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: reservationData,
    });

    console.log('✅ Database Insert Success!');
    console.log('🗄️ Created Reservation:', reservation);
    console.log('🆔 Reservation ID:', reservation.id);

    // Return success response
    const response = {
      message: 'Rezervasyon başarıyla oluşturuldu',
      reservation,
    };
    
    console.log('📤 API Response:', response);
    console.log('🏁 REZERVASYON API DEBUG - BİTİŞ');
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ REZERVASYON API HATASI:');
    console.error('  - Error message:', error instanceof Error ? error.message : String(error));
    console.error('  - Error object:', error);
    console.error('  - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.error('🔄 Duplicate reservation detected');
      return NextResponse.json(
        { error: 'Bu email ile zaten bir rezervasyon mevcut' },
        { status: 409 }
      );
    }

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