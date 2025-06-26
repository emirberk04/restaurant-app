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

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'No menu items found' },
        { status: 404 }
      );
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error loading menu:', error);
    return NextResponse.json(
      { error: 'An error occurred while loading the menu' },
      { status: 500 }
    );
  }
} 