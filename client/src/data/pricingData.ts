export const pricingPlans = [
  {
    id: 'starter',
    name: "Starter Package",
    price: 19.99,
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
    price: 29.99,
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
    id: 'hosting',
    name: "Hosting + Setup",
    price: 24.99,
    description: "Complete hosting solution with professional setup",
    popular: false,
    features: [
      "1 Month Premium Hosting",
      "Complete Server Setup",
      "Plugin Installation & Config",
      "Discord Integration",
      "24/7 Server Monitoring",
      "DDoS Protection",
      "Daily Backups",
      "Performance Optimization"
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
      "Flexible Budget Options",
      "1-on-1 Consultation",
      "Custom Development",
      "Unique Game Mechanics",
      "Premium Branding",
      "Ongoing Support",
      "Everything Under $30"
    ]
  }
];