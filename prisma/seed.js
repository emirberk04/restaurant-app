const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const existingCategories = await prisma.menuCategory.findMany();
  if (existingCategories.length > 0) {
    console.log('✅ Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        name: 'Burgers',
        description: 'Delicious burgers',
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Pizzas',
        description: 'Exquisite pizzas',
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Beverages',
        description: 'Refreshing drinks',
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Desserts',
        description: 'Sweet alternatives',
      },
    }),
  ]);

  // Create menu items
  await Promise.all([
    // Burgers
    prisma.menuItem.create({
      data: {
        name: 'Classic Burger',
        description: 'Beef patty, cheddar cheese, lettuce, tomato, pickles and our special sauce',
        price: 150.00,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Cheeseburger',
        description: 'Beef patty, double cheddar cheese, caramelized onions',
        price: 160.00,
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'BBQ Burger',
        description: 'Beef patty, BBQ sauce, cheddar cheese, crispy onions',
        price: 170.00,
        image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
        categoryId: categories[0].id,
      },
    }),

    // Pizzas
    prisma.menuItem.create({
      data: {
        name: 'Margherita Pizza',
        description: 'Tomato sauce, mozzarella cheese, fresh basil',
        price: 140.00,
        image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Tomato sauce, mozzarella cheese, pepperoni',
        price: 160.00,
        image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg',
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Mixed Pizza',
        description: 'Tomato sauce, mozzarella cheese, sausage, mushrooms, peppers',
        price: 180.00,
        image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
        categoryId: categories[1].id,
      },
    }),

    // Beverages
    prisma.menuItem.create({
      data: {
        name: 'Cola',
        description: 'Chilled cola',
        price: 30.00,
        image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Ayran',
        description: 'Fresh ayran (Turkish yogurt drink)',
        price: 20.00,
        image: 'https://images.pexels.com/photos/4051402/pexels-photo-4051402.jpeg',
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Lemonade',
        description: 'Homemade lemonade',
        price: 35.00,
        image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
        categoryId: categories[2].id,
      },
    }),

    // Desserts
    prisma.menuItem.create({
      data: {
        name: 'Chocolate Souffle',
        description: 'Hot chocolate souffle',
        price: 80.00,
        image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tiramisu',
        description: 'Italian style tiramisu',
        price: 70.00,
        image: 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg',
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Cheesecake',
        description: 'New York style cheesecake',
        price: 75.00,
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 