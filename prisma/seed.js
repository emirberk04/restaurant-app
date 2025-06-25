const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Kategorileri oluştur
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Burgerler',
        description: 'Lezzetli burgerlerimiz',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pizzalar',
        description: 'Enfes pizzalarımız',
      },
    }),
    prisma.category.create({
      data: {
        name: 'İçecekler',
        description: 'Serinletici içecekler',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tatlılar',
        description: 'Tatlı alternatiflerimiz',
      },
    }),
  ]);

  // Menü öğelerini oluştur
  await Promise.all([
    // Burgerler
    prisma.menuItem.create({
      data: {
        name: 'Klasik Burger',
        description: 'Dana eti, cheddar peyniri, marul, domates, turşu ve özel sosumuz',
        price: 150.00,
        image: '/images/classic-burger.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Cheeseburger',
        description: 'Dana eti, çift cheddar peyniri, karamelize soğan',
        price: 160.00,
        image: '/images/cheeseburger.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'BBQ Burger',
        description: 'Dana eti, barbekü sos, cheddar peyniri, kıtır soğan',
        price: 170.00,
        image: '/images/bbq-burger.jpg',
        categoryId: categories[0].id,
      },
    }),

    // Pizzalar
    prisma.menuItem.create({
      data: {
        name: 'Margarita Pizza',
        description: 'Domates sos, mozarella peyniri, fesleğen',
        price: 140.00,
        image: '/images/margherita.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Domates sos, mozarella peyniri, pepperoni',
        price: 160.00,
        image: '/images/pepperoni.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Karışık Pizza',
        description: 'Domates sos, mozarella peyniri, sosis, mantar, biber',
        price: 180.00,
        image: '/images/mixed-pizza.jpg',
        categoryId: categories[1].id,
      },
    }),

    // İçecekler
    prisma.menuItem.create({
      data: {
        name: 'Cola',
        description: 'Soğuk cola',
        price: 30.00,
        image: '/images/cola.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Ayran',
        description: 'Taze ayran',
        price: 20.00,
        image: '/images/ayran.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Limonata',
        description: 'Ev yapımı limonata',
        price: 35.00,
        image: '/images/lemonade.jpg',
        categoryId: categories[2].id,
      },
    }),

    // Tatlılar
    prisma.menuItem.create({
      data: {
        name: 'Çikolatalı Sufle',
        description: 'Sıcak çikolatalı sufle',
        price: 80.00,
        image: '/images/chocolate-souffle.jpg',
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tiramisu',
        description: 'İtalyan usulü tiramisu',
        price: 70.00,
        image: '/images/tiramisu.jpg',
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Cheesecake',
        description: 'New York cheesecake',
        price: 75.00,
        image: '/images/cheesecake.jpg',
        categoryId: categories[3].id,
      },
    }),
  ]);

  // Örnek masaları oluştur
  await Promise.all([
    prisma.table.create({
      data: {
        id: 'T1',
        number: 1,
      },
    }),
    prisma.table.create({
      data: {
        id: 'T2',
        number: 2,
      },
    }),
    prisma.table.create({
      data: {
        id: 'T3',
        number: 3,
      },
    }),
    prisma.table.create({
      data: {
        id: 'T4',
        number: 4,
      },
    }),
    prisma.table.create({
      data: {
        id: 'T5',
        number: 5,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 