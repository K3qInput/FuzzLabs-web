import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: 15,
    period: "month",
    description: "Perfect for small communities",
    features: [
      "2GB RAM",
      "Up to 20 players",
      "Basic DDoS protection",
      "Daily backups",
      "Email support",
      "Web control panel"
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 35,
    period: "month",
    description: "Ideal for growing servers",
    features: [
      "6GB RAM",
      "Up to 100 players",
      "Advanced DDoS protection",
      "Hourly backups",
      "Priority support",
      "Plugin management",
      "Custom subdomain",
      "Performance monitoring"
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 75,
    period: "month",
    description: "For large-scale operations",
    features: [
      "16GB RAM",
      "Unlimited players",
      "Enterprise DDoS protection",
      "Real-time backups",
      "24/7 dedicated support",
      "Custom development",
      "Multiple server locations",
      "Advanced analytics",
      "White-label options"
    ],
    popular: false,
  }
];

const addOnServices = [
  {
    name: "Server Logo Design",
    price: 30,
    description: "Professional logo design for your server branding"
  },
  {
    name: "Discord Bot Setup",
    price: 50,
    description: "Custom Discord bot integration with your server"
  },
  {
    name: "Custom Plugin Development",
    price: 150,
    description: "Bespoke plugin development starting from"
  },
  {
    name: "World Building Service",
    price: 200,
    description: "Professional world design and building"
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen py-20 px-6 bg-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Flexible <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Choose a plan that fits your budget and ambitions. All plans include our premium infrastructure and support.
          </p>
        </div>

        {/* Hosting Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`pricing-card relative ${plan.popular ? 'border-green-400' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-400 text-black">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold gradient-text">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-on Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Add-on <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Enhance your server with our professional add-on services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {addOnServices.map((service) => (
              <Card key={service.name} className="pricing-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">
                        ${service.price}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-secondary">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400">
                Yes, we offer a 7-day money-back guarantee for all hosting plans.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I upgrade my plan?</h3>
              <p className="text-gray-400">
                Absolutely! You can upgrade or downgrade your plan at any time from your dashboard.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and UPI payments for Indian customers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a setup fee?</h3>
              <p className="text-gray-400">
                No setup fees! Your server will be ready within minutes of payment confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
