import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCart } from "@/components/cart/cart-provider";
import { useNotifications } from "@/components/notifications/notification-provider";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { supportedCurrencies } from "@/lib/currency";
import { pricingPlans } from "@/data/pricingData";
import { Check, X, DollarSign } from "lucide-react";



export default function Pricing() {
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const { selectedCurrency, setSelectedCurrency, formatPrice, isLoading: currencyLoading } = useCurrency();

  const handleSelectPlan = (plan: typeof pricingPlans[0]) => {
    if (plan.price === 0) {
      window.open("https://discord.gg/b4f8WZy4R8", "_blank");
      return;
    }
    
    if (!isAuthenticated) {
      addNotification("Please log in to add items to cart", "error");
      return;
    }
    
    addItem({
      id: plan.id === 'starter' ? 101 : plan.id === 'advance' ? 102 : plan.id === 'pro' ? 103 : 104,
      name: plan.name,
      price: plan.price,
      quantity: 1,
      isRecurring: false,
      recurringPeriod: undefined
    });
    addNotification(`${plan.name} added to cart!`, "success");
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ultra-Affordable <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Ultra-affordable pricing from $2-20. Choose a plan that fits your budget perfectly.
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Currency:</span>
            </div>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currencyLoading && (
              <LoadingSpinner size="sm" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`pricing-card p-8 flex flex-col bg-[#1f1f1f] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative ${
                plan.popular ? 'border-2 border-[#00ff88]' : 'border-gray-800 hover:border-[#00ff88]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00ff88] text-[#0a0a0a] text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="text-5xl font-bold mb-6 text-white">
                  {plan.price === 0 ? 'Custom' : formatPrice(plan.price)}
                  {plan.originalPrice && (
                    <span className="text-2xl text-gray-400 line-through ml-2">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                  {plan.price > 0 && <span className="text-xl text-gray-400">/mo</span>}
                </div>
                {plan.discount && (
                  <div className="text-green-400 font-semibold mb-4 text-lg">
                    {plan.discount}
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0 flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => {
                    const isIncluded = typeof feature === 'string' || feature.included !== false;
                    const text = typeof feature === 'string' ? feature : feature.text;
                    
                    return (
                      <li key={index} className="flex items-center">
                        {isIncluded ? (
                          <Check className="h-5 w-5 text-[#00ff88] mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        )}
                        <span className={isIncluded ? "text-white" : "text-gray-500"}>
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full text-center font-bold py-3 px-6 rounded-full mt-auto ${
                    plan.popular 
                      ? 'btn-primary bg-gradient-to-r from-[#00ff88] to-[#00aaff] text-[#0a0a0a] hover:shadow-lg' 
                      : 'bg-transparent border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a]'
                  } transition-all duration-300`}
                >
                  {plan.price === 0 ? 'Contact Us' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
