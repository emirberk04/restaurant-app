import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Menü yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Menü yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 