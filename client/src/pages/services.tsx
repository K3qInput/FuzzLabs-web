import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/components/notifications/notification-provider";
import { Service } from "@/lib/types";
import { useCurrency } from "@/hooks/useCurrency";
import { supportedCurrencies } from "@/lib/currency";
import {
  Server,
  Code,
  Palette,
  LifeBuoy,
  Globe,
  Settings,
  Plus,
  DollarSign
} from "lucide-react";

const categoryIcons = {
  "Server Hosting": Server,
  "Custom Development": Code,
  "Design Services": Palette,
  "Support Services": LifeBuoy,
  "World Building": Globe,
  "Server Management": Settings,
};

export default function Services() {
  const { addNotification } = useNotifications();
  const { selectedCurrency, setSelectedCurrency, formatPrice, isLoading: currencyLoading } = useCurrency();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ["/api/services"],
  });

  const handleAddToCart = (service: Service) => {
    const message = `Hi! I'm interested in purchasing "${service.name}" (${formatPrice(parseFloat(service.price))}${service.isRecurring ? ` per ${service.recurringPeriod}` : ''}). Can you help me get started?`;
    const discordUrl = `https://discord.com/users/1129755081416388750`;
    window.open(discordUrl, '_blank');
    addNotification(`Redirecting to Discord for ${service.name}!`, "success");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Services</h2>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group services by category
  const servicesByCategory = services?.reduce((acc: Record<string, Service[]>, service: Service) => {
    const categoryName = service.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(service);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Comprehensive <span className="gradient-text">Services</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-4xl mx-auto mb-8">
            Build your perfect server package. Add services to your cart and checkout securely.
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

        <div className="space-y-16">
          {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => {
            const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Server;
            
            return (
              <div key={categoryName}>
                <div className="flex items-center mb-8">
                  <IconComponent className="h-8 w-8 text-green-400 mr-3" />
                  <h2 className="text-3xl font-bold">{categoryName}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <Card key={service.id} className="service-card">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{service.name}</span>
                          <span className="text-lg font-bold text-green-400">
                            {formatPrice(parseFloat(service.price))}
                            {service.isRecurring && (
                              <span className="text-sm text-gray-200">
                                /{service.recurringPeriod}
                              </span>
                            )}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-200 mb-4">
                          {service.description || "Professional service tailored to your needs."}
                        </p>
                        
                        <Button
                          onClick={() => handleAddToCart(service)}
                          className="w-full btn-primary"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Contact for Purchase
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(servicesByCategory).length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No Services Available</h3>
            <p className="text-gray-400">
              We're working on adding amazing services for you. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
