import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCart } from "@/components/cart/cart-provider";
import { useNotifications } from "@/components/notifications/notification-provider";
import { Service } from "@/lib/types";
import {
  Server,
  Code,
  Palette,
  LifeBuoy,
  Globe,
  Settings,
  Plus
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
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ["/api/services"],
  });

  const handleAddToCart = (service: Service) => {
    addItem({
      id: service.id,
      name: service.name,
      price: parseFloat(service.price),
      isRecurring: service.isRecurring,
      recurringPeriod: service.recurringPeriod,
    });
    addNotification(`${service.name} added to cart!`, "success");
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
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Comprehensive <span className="gradient-text">Services</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto">
            Build your perfect server package. Add services to your cart and checkout securely.
          </p>
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
                            ${parseFloat(service.price).toFixed(2)}
                            {service.isRecurring && (
                              <span className="text-sm text-gray-400">
                                /{service.recurringPeriod}
                              </span>
                            )}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 mb-4">
                          {service.description || "Professional service tailored to your needs."}
                        </p>
                        
                        <Button
                          onClick={() => handleAddToCart(service)}
                          className="w-full btn-primary"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Cart
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
