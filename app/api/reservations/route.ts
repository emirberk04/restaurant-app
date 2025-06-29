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
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('🗄️ Database URL exists:', !!process.env.DATABASE_URL);
    console.log('🗄️ Database URL value:', process.env.DATABASE_URL);
    
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
    console.log('🔄 Processing date...');
    const processedDate = new Date(date);
    console.log('🔄 Date processed:', processedDate);
    
    console.log('🔄 Processing numberOfGuests...');
    const processedGuests = parseInt(numberOfGuests.toString());
    console.log('🔄 Guests processed:', processedGuests);
    
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

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not found, using mock data for development');
      
      // Create a mock reservation for testing
      const mockReservation = {
        id: Date.now(), // Use timestamp as mock ID
        ...reservationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('🎭 Mock Reservation Created:', mockReservation);
      
      // Send email with mock data
      setTimeout(async () => {
        try {
          const emailData = {
            reservation: {
              id: mockReservation.id,
              name: mockReservation.name,
              email: mockReservation.email,
              phoneNumber: mockReservation.phoneNumber,
              date: mockReservation.date.toISOString().split('T')[0],
              time: mockReservation.time,
              numberOfGuests: mockReservation.numberOfGuests,
              specialRequests: mockReservation.specialRequests,
              status: mockReservation.status
            }
          };

          const url = new URL(request.url);
          const baseUrl = `${url.protocol}//${url.host}`;
          
          console.log('📧 Sending email with mock data...');
          const emailResponse = await fetch(`${baseUrl}/api/send-reservation-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData),
          });

          if (emailResponse.ok) {
            console.log('✅ Email sent successfully with mock data!');
          } else {
            console.error('⚠️ Email sending failed');
          }
        } catch (emailError) {
          console.error('❌ Email sending error:', emailError);
        }
      }, 100);
      
      return NextResponse.json({
        message: 'Rezervasyon başarıyla oluşturuldu (development mode)',
        reservation: mockReservation,
      });
    }

    console.log('🔗 Attempting to create reservation in database...');

    // Test database connection first
    try {
      console.log('🔍 Testing database connection...');
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (dbConnectError) {
      console.error('❌ Database connection failed:', dbConnectError);
      throw new Error('Database connection failed');
    }

    // Create reservation in database
    let reservation: any;
    try {
      console.log('💾 Creating reservation record...');
      reservation = await prisma.reservation.create({
        data: reservationData,
      });
      console.log('✅ Database Insert Success!');
      console.log('🗄️ Created Reservation:', reservation);
      console.log('🆔 Reservation ID:', reservation.id);
    } catch (dbError) {
      console.error('❌ Database Insert Error:', dbError);
      console.error('❌ Database Error Details:', {
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace',
      });
      throw dbError;
    }

    // Send email notifications (non-blocking)
    console.log('📧 Attempting to send email notifications...');
    
    // Email sending should not block the reservation creation
    setTimeout(async () => {
      try {
        const emailData = {
          reservation: {
            id: reservation.id,
            name: reservation.name,
            email: reservation.email,
            phoneNumber: reservation.phoneNumber,
            date: reservation.date.toISOString().split('T')[0], // YYYY-MM-DD format
            time: reservation.time,
            numberOfGuests: reservation.numberOfGuests,
            specialRequests: reservation.specialRequests,
            status: reservation.status
          }
        };

        console.log('📧 Email Data:', emailData);

        // Get the base URL
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        
        console.log('🌐 Base URL:', baseUrl);
        console.log('🔗 Email API URL:', `${baseUrl}/api/send-reservation-email`);

        const emailResponse = await fetch(`${baseUrl}/api/send-reservation-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        console.log('📧 Email API Response Status:', emailResponse.status);
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('📧 Email API Response:', emailResult);
          console.log('✅ Email notifications sent successfully!');
        } else {
          const errorText = await emailResponse.text();
          console.error('⚠️ Email API Error:', errorText);
          console.error('⚠️ Email sending failed, but reservation was created');
        }
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        console.error('⚠️ Reservation created but email failed');
      }
    }, 100); // 100ms delay

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
    console.error('  - Error name:', error instanceof Error ? error.name : 'Unknown');
    
    // Check specific error types
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        console.error('🔄 Duplicate reservation detected');
        return NextResponse.json(
          { error: 'Bu email ile zaten bir rezervasyon mevcut' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Database connection failed')) {
        console.error('🗄️ Database connection issue');
        return NextResponse.json(
          { error: 'Database bağlantı hatası' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Rezervasyon oluşturulurken bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      },
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