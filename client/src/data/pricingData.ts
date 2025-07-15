export const pricingPlans = [
  {
    id: 'starter',
    name: "Starter Package",
    price: 8.99,
    description: "Perfect for getting started with your Minecraft server",
    popular: false,
    features: [
      "Essential Plugins Setup",
      "Basic Server Configuration",
      "Discord Bot Setup",
      "Basic Support (48h response)",
      "Server Launch Assistance",
      { text: "Limited Customization", included: false },
      { text: "No Branding", included: false },
      { text: "No Website", included: false }
    ]
  },
  {
    id: 'pro',
    name: "Professional Package",
    price: 15.99,
    description: "Enhanced features for growing servers",
    popular: true,
    features: [
      "Advanced Plugin Configuration",
      "All Popular Game Modes",
      "Premium Discord & Bot Setup",
      "Custom Plugin Modifications",
      "Priority Support (24h response)",
      "Basic Branding Package",
      "Performance Optimization",
      "Security Configuration"
    ]
  },
  {
    id: 'premium',
    name: "Premium Complete",
    price: 19.99,
    originalPrice: 24.99,
    discount: "20% OFF",
    description: "Complete solution with everything included",
    popular: false,
    features: [
      "Everything in Professional",
      "Complete Server Setup",
      "Custom Website Template",
      "Premium Discord Integration",
      "24/7 Server Monitoring",
      "DDoS Protection",
      "Daily Backups",
      "Full Branding Package",
      "Dedicated Support Manager"
    ]
  },
  {
    id: 'custom',
    name: "Custom Solution",
    price: 0,
    description: "Tailored to your specific needs and budget",
    popular: false,
    features: [
      "Fully Customized Setup",
      "Budget-Friendly Options",
      "1-on-1 Consultation",
      "Custom Development",
      "Unique Game Mechanics",
      "Premium Branding",
      "Ongoing Support",
      "All Services $2-20"
    ]
  }
];