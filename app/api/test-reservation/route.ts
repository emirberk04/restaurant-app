import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_VALUE: process.env.DATABASE_URL || 'NOT_SET',
      RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
      TIMESTAMP: new Date().toISOString(),
    };

    console.log('🔍 Environment Debug:', envInfo);

    return NextResponse.json({
      success: true,
      message: 'Test API working',
      environment: envInfo,
    });
  } catch (error) {
    console.error('❌ Test API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📝 Test POST Request Body:', body);
    
    // Mock reservation response
    const mockReservation = {
      id: Date.now(),
      name: body.name || 'Test User',
      email: body.email || 'test@test.com',
      phoneNumber: body.phoneNumber || '123456789',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '19:00',
      numberOfGuests: body.numberOfGuests || 2,
      specialRequests: body.specialRequests || '',
      status: 'PENDING',
      createdAt: new Date(),
    };

    console.log('🎭 Mock Reservation Created:', mockReservation);

    return NextResponse.json({
      success: true,
      message: 'Test reservation created successfully',
      reservation: mockReservation,
    });
  } catch (error) {
    console.error('❌ Test POST Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 