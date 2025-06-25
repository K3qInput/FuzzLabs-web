import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/cart/cart-provider";
import { useNotifications } from "@/components/notifications/notification-provider";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Smartphone,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Copy,
  QrCode
} from "lucide-react";

type CheckoutStep = "details" | "payment" | "confirmation";

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  discordUsername?: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items, clearCart, getTotalPrice } = useCart();
  const { addNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("details");
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    discordUsername: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"upi">("upi");
  const [upiPaymentInfo, setUpiPaymentInfo] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  // Redirect if not authenticated or no items
  useEffect(() => {
    if (!isAuthenticated) {
      addNotification("Please sign in to checkout", "warning");
      setLocation("/");
      return;
    }

    if (items.length === 0) {
      addNotification("Your cart is empty", "warning");
      setLocation("/services");
      return;
    }
  }, [isAuthenticated, items.length, setLocation, addNotification]);

  // Update billing info when user changes
  useEffect(() => {
    if (user) {
      setBillingInfo(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        items: items.map(item => ({
          serviceId: item.id,
          quantity: item.quantity,
        })),
        billingInfo,
        paymentMethod,
      };

      const response = await apiRequest("POST", "/api/checkout", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderId(data.orderId);
      addNotification("Order created successfully!", "success");
      setCurrentStep("payment");
    },
    onError: (error) => {
      addNotification("Failed to create order. Please try again.", "error");
      console.error("Order creation error:", error);
    }
  });

  // Get UPI payment info mutation
  const getUpiInfoMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest("POST", "/api/upi-payment-info", { orderId });
      return response.json();
    },
    onSuccess: (data) => {
      setUpiPaymentInfo(data);
    },
    onError: (error) => {
      addNotification("Failed to get payment info. Please try again.", "error");
      console.error("UPI info error:", error);
    }
  });

  // Confirm UPI payment mutation
  const confirmUpiPaymentMutation = useMutation({
    mutationFn: async ({ orderId, transactionId }: { orderId: number; transactionId: string }) => {
      const response = await apiRequest("POST", "/api/confirm-upi-payment", { orderId, transactionId });
      return response.json();
    },
    onSuccess: (data) => {
      addNotification(data.message, "success");
      clearCart();
      setCurrentStep("confirmation");
    },
    onError: (error) => {
      addNotification("Failed to confirm payment. Please try again.", "error");
      console.error("Payment confirmation error:", error);
    }
  });

  // Load UPI payment info when order is created
  useEffect(() => {
    if (orderId && currentStep === "payment") {
      getUpiInfoMutation.mutate(orderId);
    }
  }, [orderId, currentStep]);

  const handleCreateOrder = () => {
    createOrderMutation.mutate();
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim()) {
      addNotification("Please enter the transaction ID", "warning");
      return;
    }
    if (orderId) {
      confirmUpiPaymentMutation.mutate({ orderId, transactionId });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification("Copied to clipboard!", "success");
  };

  const openUpiApp = () => {
    if (upiPaymentInfo?.upiUrl) {
      window.open(upiPaymentInfo.upiUrl, '_blank');
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === "details" ? "text-blue-600" : currentStep === "payment" || currentStep === "confirmation" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "details" ? "bg-blue-600 text-white" : currentStep === "payment" || currentStep === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span>Details</span>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div className={`flex items-center space-x-2 ${currentStep === "payment" ? "text-blue-600" : currentStep === "confirmation" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" ? "bg-blue-600 text-white" : currentStep === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span>Payment</span>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div className={`flex items-center space-x-2 ${currentStep === "confirmation" ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === "details" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={billingInfo.firstName}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={billingInfo.lastName}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discordUsername">Discord Username (Optional)</Label>
                  <Input
                    id="discordUsername"
                    value={billingInfo.discordUsername}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, discordUsername: e.target.value }))}
                    placeholder="username#1234"
                  />
                </div>
                <Button 
                  onClick={handleCreateOrder} 
                  className="w-full"
                  disabled={createOrderMutation.isPending || !billingInfo.firstName || !billingInfo.lastName || !billingInfo.email}
                >
                  {createOrderMutation.isPending ? "Creating Order..." : "Continue to Payment"}
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2" size={20} />
                  UPI Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getUpiInfoMutation.isPending ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading payment information...</p>
                  </div>
                ) : upiPaymentInfo ? (
                  <div className="space-y-6">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Complete your payment using any UPI app (PhonePe, Paytm, Google Pay, etc.)
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Payment Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>UPI ID:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{upiPaymentInfo.upiId}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(upiPaymentInfo.upiId)}
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">₹{upiPaymentInfo.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Order:</span>
                          <span className="font-mono">{upiPaymentInfo.orderNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        onClick={openUpiApp} 
                        className="w-full"
                        size="lg"
                      >
                        <Smartphone className="mr-2" size={20} />
                        Pay with UPI App
                      </Button>
                      
                      <div className="text-center">
                        <span className="text-sm text-gray-500">or scan QR code with your UPI app</span>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <QrCode size={120} className="text-gray-400" />
                          <p className="text-xs text-center mt-2 text-gray-500">QR Code</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                          id="transactionId"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter transaction ID from your UPI app"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          After making the payment, enter the transaction ID you received from your UPI app
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep("details")}
                          className="flex-1"
                        >
                          <ArrowLeft className="mr-2" size={16} />
                          Back
                        </Button>
                        <Button 
                          onClick={handleConfirmPayment}
                          disabled={confirmUpiPaymentMutation.isPending || !transactionId.trim()}
                          className="flex-1"
                        >
                          {confirmUpiPaymentMutation.isPending ? "Confirming..." : "Confirm Payment"}
                          <CheckCircle className="ml-2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Failed to load payment information. Please try again.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => orderId && getUpiInfoMutation.mutate(orderId)}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === "confirmation" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2" size={24} />
                  Payment Submitted Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your payment has been submitted for verification. We'll update your order status once the payment is confirmed. 
                    You'll receive an email notification when your order is processed.
                  </AlertDescription>
                </Alert>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setLocation("/dashboard")}
                    className="flex-1"
                  >
                    View Order Status
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/services")}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    {item.isRecurring && (
                      <p className="text-xs text-blue-600">Recurring: {item.recurringPeriod}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="mr-1" size={12} />
                <span>Secure payment with UPI</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}