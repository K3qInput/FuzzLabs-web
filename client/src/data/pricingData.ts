export const pricingPlans = [
  {
    id: 'starter',
    name: "Basic Server Setup",
    price: 45,
    description: "Perfect for getting started with your Minecraft server",
    popular: false,
    features: [
      "Essential Plugins",
      "Basic Server Type (Factions, Lifesteal, Skyblock)",
      "Basic Discord Setup",
      "Basic Support Access (72h SLA)",
      { text: "Limited Customization", included: false },
      { text: "No Branding", included: false },
      { text: "No Website", included: false },
      { text: "No Store Setup", included: false },
      { text: "No Account Manager", included: false },
      { text: "No Custom Assets", included: false }
    ]
  },
  {
    id: 'advance',
    name: "Advanced Server Setup",
    price: 70,
    description: "Enhanced features for growing servers",
    popular: false,
    features: [
      "Essential Plugins",
      "All Popular Game Modes",
      "Standard Discord & Store Setup",
      "Custom Plugin Configurations",
      "Priority Support (48h SLA)",
      "Partial Branding Support",
      { text: "No Website", included: false },
      "Limited Custom Assets",
      { text: "No Account Manager", included: false }
    ]
  },
  {
    id: 'pro',
    name: "Professional Server Setup",
    price: 120,
    description: "Complete solution for serious server operators",
    popular: true,
    features: [
      "Essential Plugins",
      "All Game Modes Supported",
      "Premium Discord & Tebex Store Setup",
      "Custom Plugin Configurations",
      "1-on-1 Support (24h SLA)",
      "Full Branding & Website Included",
      "Custom Assets & UI Design",
      "Dedicated Account Manager",
      "Marketing Guidance Included",
      "Monetization Strategy Included"
    ]
  },
  {
    id: 'custom',
    name: "Custom Plan",
    price: 0,
    description: "Tailored to your specific needs",
    popular: false,
    features: [
      "Fully Tailored Setup",
      "Unlimited Features & Services",
      "1-on-1 Consultation",
      "Custom Game Modes & Mechanics",
      "Premium Branding & UI/UX",
      "Ongoing Support & Strategy",
      "Custom Budget & Timeline"
    ]
  }
];