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

  // Create services with ultra-affordable pricing ($2-20)
  const servicesData = [
    // Server Hosting
    {
      categoryId: categories[0].id,
      name: 'Starter Server',
      description: 'Perfect for small communities with up to 20 players. Includes basic plugins and 24/7 uptime.',
      price: '3.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[0].id,
      name: 'Pro Server',
      description: 'High-performance hosting for up to 100 players with premium features and DDoS protection.',
      price: '8.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[0].id,
      name: 'Enterprise Server',
      description: 'Dedicated resources for large communities with unlimited players and advanced management tools.',
      price: '15.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    // Custom Development
    {
      categoryId: categories[1].id,
      name: 'Simple Plugin',
      description: 'Basic custom plugin development for your server with core functionality.',
      price: '7.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[1].id,
      name: 'Plugin Modification',
      description: 'Modify existing plugins to fit your specific server needs and requirements.',
      price: '4.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[1].id,
      name: 'Discord Bot Setup',
      description: 'Custom Discord bot setup and configuration for your community.',
      price: '6.99',
      isRecurring: false,
      isActive: true
    },
    // Design Services
    {
      categoryId: categories[2].id,
      name: 'Server Logo',
      description: 'Professional logo design for your server with multiple revisions included.',
      price: '5.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[2].id,
      name: 'Banner Design',
      description: 'Eye-catching banners for social media and server promotion.',
      price: '3.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[2].id,
      name: 'Website Template',
      description: 'Ready-to-use website template customized for your server.',
      price: '12.99',
      isRecurring: false,
      isActive: true
    },
    // Support Services
    {
      categoryId: categories[3].id,
      name: 'Priority Support',
      description: '24/7 priority support for your server with quick response times.',
      price: '4.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[3].id,
      name: 'Server Setup',
      description: 'Complete server setup and configuration by our experts.',
      price: '8.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[3].id,
      name: 'Performance Optimization',
      description: 'Optimize your server for better performance and reduced lag.',
      price: '2.33',
      isRecurring: false,
      isActive: true
    },
    // World Building
    {
      categoryId: categories[4].id,
      name: 'Custom Build',
      description: 'Small custom build for your server (spawn area, shops, etc.).',
      price: '9.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[4].id,
      name: 'Spawn Area',
      description: 'Beautiful spawn area design with custom architecture.',
      price: '7.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[4].id,
      name: 'Mini-Game Arena',
      description: 'Custom mini-game arena or PvP area for your server.',
      price: '8.99',
      isRecurring: false,
      isActive: true
    },
    // Server Management
    {
      categoryId: categories[5].id,
      name: 'Basic Management',
      description: 'Essential server management including updates and backups.',
      price: '5.99',
      isRecurring: true,
      recurringPeriod: 'month',
      isActive: true
    },
    {
      categoryId: categories[5].id,
      name: 'Security Scan',
      description: 'Complete security audit and vulnerability assessment.',
      price: '9.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[5].id,
      name: 'Plugin Management',
      description: 'Professional plugin installation, updates, and configuration.',
      price: '4.99',
      isRecurring: false,
      isActive: true
    },
    // Additional Ultra-Affordable Services
    {
      categoryId: categories[1].id,
      name: 'Config Fix',
      description: 'Quick configuration fixes for existing plugins and server issues.',
      price: '2.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[2].id,
      name: 'Icon Pack',
      description: 'Set of 10 custom icons for your server UI and Discord.',
      price: '2.99',
      isRecurring: false,
      isActive: true
    },
    {
      categoryId: categories[3].id,
      name: 'Quick Support',
      description: 'One-time support session for urgent server issues.',
      price: '3.99',
      isRecurring: false,
      isActive: true
    }
  ];

  await db.insert(services).values(servicesData);

  console.log('Services created:', servicesData.length);
  console.log('Database seeded successfully!');
}

seed().catch(console.error);