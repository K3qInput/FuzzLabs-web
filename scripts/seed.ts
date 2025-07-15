import { db } from '../server/db';
import { serviceCategories, services } from '../shared/schema';

async function seed() {
  console.log('Seeding database...');

  // Create service categories
  const categories = await db.insert(serviceCategories).values([
    {
      name: 'Server Hosting',
      description: 'Professional Minecraft server hosting solutions',
      icon: 'server'
    },
    {
      name: 'Custom Development',
      description: 'Tailored plugins and modifications',
      icon: 'code'
    },
    {
      name: 'Design Services',
      description: 'Professional graphics and branding',
      icon: 'palette'
    },
    {
      name: 'Support Services',
      description: 'Technical support and maintenance',
      icon: 'headphones'
    },
    {
      name: 'World Building',
      description: 'Custom world creation and design',
      icon: 'globe'
    },
    {
      name: 'Server Management',
      description: 'Complete server administration',
      icon: 'settings'
    }
  ]).returning();

  console.log('Categories created:', categories.length);

  // Create services
  const servicesData = [
    // Server Hosting
    {
      categoryId: categories[0].id,
      name: 'Starter Server',
      description: 'Perfect for small communities with up to 20 players',
      price: '9.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[0].id,
      name: 'Pro Server',
      description: 'High-performance hosting for up to 100 players',
      price: '24.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[0].id,
      name: 'Enterprise Server',
      description: 'Dedicated resources for large communities',
      price: '49.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    // Custom Development
    {
      categoryId: categories[1].id,
      name: 'Custom Plugin',
      description: 'Tailored plugin development for your server',
      price: '199.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[1].id,
      name: 'Plugin Modification',
      description: 'Modify existing plugins to fit your needs',
      price: '99.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[1].id,
      name: 'Discord Bot',
      description: 'Custom Discord bot for your community',
      price: '149.99',
      isRecurring: false,
      isActive: true
    },
    // Design Services
    {
      categoryId: categories[2].id,
      name: 'Server Logo',
      description: 'Professional logo design for your server',
      price: '49.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[2].id,
      name: 'Banner Design',
      description: 'Eye-catching banners for social media',
      price: '29.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[2].id,
      name: 'Website Design',
      description: 'Complete website design and development',
      price: '299.99',
      isRecurring: false,
      isActive: true
    },
    // Support Services
    {
      categoryId: categories[3].id,
      name: 'Priority Support',
      description: '24/7 priority support for your server',
      price: '19.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[3].id,
      name: 'Server Setup',
      description: 'Complete server setup and configuration',
      price: '79.99',
      isRecurring: false,
      isActive: true
    },
    // World Building
    {
      categoryId: categories[4].id,
      name: 'Custom World',
      description: 'Professionally designed custom world',
      price: '199.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[4].id,
      name: 'Spawn Area',
      description: 'Beautiful spawn area design',
      price: '99.99',
      isRecurring: false,
      isActive: true
    },
    // Server Management
    {
      categoryId: categories[5].id,
      name: 'Full Management',
      description: 'Complete server management service',
      price: '39.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[5].id,
      name: 'Security Audit',
      description: 'Complete security audit and hardening',
      price: '149.99',
      isRecurring: false,
      isActive: true
    }
  ];

  await db.insert(services).values(servicesData);

  console.log('Services created:', servicesData.length);
  console.log('Database seeded successfully!');
}

seed().catch(console.error);